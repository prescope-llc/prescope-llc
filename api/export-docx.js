// Vercel serverless function: /api/export-docx
// Accepts the full backlog payload and returns a formatted .docx file.

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak,
} = require('docx');

const PAGE_W = 12240; // 8.5in in DXA
const CONTENT_W = 9360; // 9360 = 9360/1440 = 6.5in content area (1in margins each side)

const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function spacer(spacing = 80) {
  return new Paragraph({ children: [new TextRun('')], spacing: { before: spacing, after: 0 } });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, font: 'Arial' })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, font: 'Arial' })] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text, font: 'Arial' })] });
}
function h4(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_4, children: [new TextRun({ text, font: 'Arial' })] });
}

function body(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Arial', size: 22, ...opts })],
    spacing: { before: 40, after: 80 },
  });
}

function label(text) {
  return new TextRun({ text, font: 'Arial', size: 22, bold: true, color: '2E75B6' });
}

function badge(text, color = '1F4E79') {
  return new Paragraph({
    children: [new TextRun({ text: `  ${text}  `, font: 'Arial', size: 18, bold: true, color: 'FFFFFF' })],
    shading: { fill: color, type: ShadingType.CLEAR },
    spacing: { before: 40, after: 80 },
  });
}

function bulletList(items, ref = 'bullets') {
  if (!items?.length) return [];
  return items.map((item) => new Paragraph({
    numbering: { reference: ref, level: 0 },
    children: [new TextRun({ text: item, font: 'Arial', size: 22 })],
  }));
}

function labeledSection(labelText, items) {
  if (!items?.length) return [];
  return [
    new Paragraph({ children: [label(labelText)], spacing: { before: 120, after: 40 } }),
    ...bulletList(items),
  ];
}

function labeledParagraph(labelText, text) {
  if (!text) return [];
  return [new Paragraph({
    children: [label(labelText + ' '), new TextRun({ text, font: 'Arial', size: 22 })],
    spacing: { before: 80, after: 80 },
  })];
}

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '334155', space: 1 } },
    spacing: { before: 160, after: 160 },
    children: [new TextRun('')],
  });
}

function renderStory(story, idx) {
  const nodes = [];
  nodes.push(h4(`Story ${idx + 1}: ${story.title}`));
  if (story.storyText) nodes.push(body(story.storyText, { italics: true }));
  if (story.readyForRefinement !== undefined) {
    nodes.push(badge(
      story.readyForRefinement ? '✓  Ready for refinement' : '⚠  Needs more detail',
      story.readyForRefinement ? '1A5C38' : '7C3A00',
    ));
  }
  if (story.improvementNotes) nodes.push(...labeledParagraph('Notes:', story.improvementNotes));
  nodes.push(...labeledSection('Acceptance Criteria:', story.acceptanceCriteria));
  nodes.push(...labeledSection('Assumptions:', story.assumptions));
  nodes.push(...labeledSection('Dependencies:', story.dependencies));
  nodes.push(...labeledSection('Open Questions:', story.openQuestions));
  nodes.push(spacer(80));
  return nodes;
}

function renderFlow(flow) {
  if (!flow?.steps?.length) return [];
  const nodes = [];
  nodes.push(h3('Process Flow'));

  flow.steps.forEach((step, i) => {
    const typeColors = {
      start: { bg: '022C22', text: '6EE7B7', badge: '059669' },
      end: { bg: '2E1065', text: 'C4B5FD', badge: '7C3AED' },
      decision: { bg: '451A03', text: 'FCD34D', badge: 'D97706' },
      process: { bg: '082F49', text: '7DD3FC', badge: '0284C7' },
    };
    const c = typeColors[step.type] || typeColors.process;

    // Step row: type badge + label
    nodes.push(new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [1200, CONTENT_W - 1200],
      rows: [new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            shading: { fill: c.badge, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            width: { size: 1200, type: WidthType.DXA },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: step.type.toUpperCase(), font: 'Arial', size: 16, bold: true, color: 'FFFFFF' })],
            })],
          }),
          new TableCell({
            borders,
            shading: { fill: c.bg, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 160, right: 120 },
            width: { size: CONTENT_W - 1200, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: step.label, font: 'Arial', size: 22, bold: true, color: c.text })] }),
              ...(step.description ? [new Paragraph({ children: [new TextRun({ text: step.description, font: 'Arial', size: 20, color: '94A3B8' })] })] : []),
            ],
          }),
        ],
      })],
    }));

    if (step.branches?.length) {
      step.branches.forEach((b) => {
        nodes.push(new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: `${b.label}`, font: 'Arial', size: 20, bold: true, color: 'D97706' }),
            new TextRun({ text: ` → Step ${b.toStepId}`, font: 'Arial', size: 20, color: '94A3B8' })],
          spacing: { before: 40, after: 40 },
        }));
      });
    }

    if (i < flow.steps.length - 1) nodes.push(spacer(40));
  });

  nodes.push(spacer(120));
  nodes.push(...labeledSection('Business Rules:', flow.businessRules));
  nodes.push(...labeledSection('Data Rules:', flow.dataRules));
  nodes.push(spacer(80));
  return nodes;
}

function renderFeature(feat, fIdx) {
  const nodes = [];
  nodes.push(h3(`Feature ${fIdx + 1}: ${feat.title}`));
  if (feat.description) nodes.push(body(feat.description));
  nodes.push(...labeledParagraph('Business Value:', feat.businessValue));
  nodes.push(spacer(80));
  if (feat.stories?.length) {
    feat.stories.forEach((s, si) => nodes.push(...renderStory(s, si)));
  }
  if (feat.flow) nodes.push(...renderFlow(feat.flow));
  return nodes;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const {
      requestText, classification, epic,
      standaloneInitiative, standaloneFeatures, standaloneStories, exportedAt,
    } = req.body || {};

    const children = [];

    // Cover / header
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Backlog Export', font: 'Arial', bold: true, size: 40 })],
      spacing: { before: 0, after: 240 },
    }));

    if (requestText) {
      children.push(new Paragraph({
        children: [label('Request:  '), new TextRun({ text: requestText, font: 'Arial', size: 22 })],
        spacing: { before: 0, after: 120 },
      }));
    }
    if (classification) {
      const cl = typeof classification === 'string' ? { classification } : classification;
      children.push(new Paragraph({
        children: [
          label('Classification:  '),
          new TextRun({ text: cl.classification || '', font: 'Arial', size: 22, bold: true }),
          cl.confidence ? new TextRun({ text: `  (${cl.confidence} confidence)`, font: 'Arial', size: 22, color: '64748B' }) : new TextRun(''),
        ],
        spacing: { before: 0, after: 80 },
      }));
      if (cl.businessNeed) children.push(...labeledParagraph('Business Need:', cl.businessNeed));
      if (cl.reason) children.push(...labeledParagraph('Why:', cl.reason));
    }
    if (exportedAt) {
      children.push(body(`Exported: ${new Date(exportedAt).toLocaleString()}`, { color: '64748B', size: 18 }));
    }
    children.push(divider());

    // Epic
    if (epic) {
      children.push(h1(`EPIC: ${epic.title}`));
      if (epic.businessNeed) children.push(...labeledParagraph('Business Need:', epic.businessNeed));
      children.push(divider());

      (epic.initiatives || []).forEach((init, ii) => {
        children.push(h2(`Initiative ${ii + 1}: ${init.title}`));
        if (init.description) children.push(body(init.description));
        if (init.businessNeed) children.push(...labeledParagraph('Business Need:', init.businessNeed));
        children.push(spacer(120));

        (init.features || []).forEach((feat, fi) => {
          children.push(...renderFeature(feat, fi));
        });
        children.push(divider());
      });

    } else if (standaloneInitiative) {
      children.push(h1(`Initiative: ${standaloneInitiative.title}`));
      if (standaloneInitiative.businessNeed) children.push(...labeledParagraph('Business Need:', standaloneInitiative.businessNeed));
      children.push(spacer(120));
      (standaloneInitiative.features || []).forEach((feat, fi) => {
        children.push(...renderFeature(feat, fi));
      });

    } else if (standaloneFeatures) {
      children.push(h1(`Feature Group: ${standaloneFeatures.title}`));
      children.push(spacer(120));
      (standaloneFeatures.features || []).forEach((feat, fi) => {
        children.push(...renderFeature(feat, fi));
      });

    } else if (standaloneStories) {
      children.push(h1(`Feature: ${standaloneStories.title}`));
      children.push(spacer(80));
      (standaloneStories.stories || []).forEach((s, si) => {
        children.push(...renderStory(s, si));
      });
      if (standaloneStories.flow) children.push(...renderFlow(standaloneStories.flow));
    }

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: 'bullets',
            levels: [{
              level: 0, format: LevelFormat.BULLET, text: '\u2022',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            }],
          },
        ],
      },
      styles: {
        default: { document: { run: { font: 'Arial', size: 22 } } },
        paragraphStyles: [
          {
            id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 36, bold: true, font: 'Arial', color: '0F172A' },
            paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 },
          },
          {
            id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 28, bold: true, font: 'Arial', color: '1E3A5F' },
            paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
          },
          {
            id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 24, bold: true, font: 'Arial', color: '2E75B6' },
            paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 },
          },
          {
            id: 'Heading4', name: 'Heading 4', basedOn: 'Normal', next: 'Normal', quickFormat: true,
            run: { size: 22, bold: true, font: 'Arial', color: '374151' },
            paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 3 },
          },
        ],
      },
      sections: [{
        properties: {
          page: {
            size: { width: PAGE_W, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="backlog-export.docx"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (e) {
    console.error('Export error:', e);
    res.status(500).json({ error: e.message || 'Failed to generate document' });
  }
}
