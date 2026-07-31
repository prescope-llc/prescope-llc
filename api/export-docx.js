// Vercel serverless function: /api/export-docx
// Creates a valid .docx without third-party runtime dependencies.

function xml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function crc32(bytes) {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;

    for (let i = 0; i < 8; i++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function u16(number) {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16LE(number >>> 0);
  return buffer;
}

function u32(number) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(number >>> 0);
  return buffer;
}

function makeZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = Buffer.from(name);
    const data = Buffer.from(content);
    const checksum = crc32(data);

    const local = Buffer.concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(checksum),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0),
      nameBytes,
      data,
    ]);

    localParts.push(local);

    const central = Buffer.concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(checksum),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      nameBytes,
    ]);

    centralParts.push(central);
    offset += local.length;
  }

  const centralDirectory = Buffer.concat(centralParts);

  const end = Buffer.concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(centralParts.length),
    u16(centralParts.length),
    u32(centralDirectory.length),
    u32(offset),
    u16(0),
  ]);

  return Buffer.concat([
    ...localParts,
    centralDirectory,
    end,
  ]);
}

function paragraph(text, style = '', bold = false) {
  const styleXml = style
    ? `<w:pStyle w:val="${style}"/>`
    : '';

  const boldXml = bold ? '<w:b/>' : '';

  return `
    <w:p>
      <w:pPr>${styleXml}</w:pPr>
      <w:r>
        <w:rPr>
          ${boldXml}
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
        </w:rPr>
        <w:t xml:space="preserve">${xml(text)}</w:t>
      </w:r>
    </w:p>
  `;
}

function bullet(text) {
  return `
    <w:p>
      <w:pPr>
        <w:ind w:left="720" w:hanging="360"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
        </w:rPr>
        <w:t>${xml(`• ${text}`)}</w:t>
      </w:r>
    </w:p>
  `;
}

function addList(output, title, values) {
  if (!Array.isArray(values) || values.length === 0) return;

  output.push(paragraph(title, '', true));

  values.forEach((value) => {
    output.push(bullet(value));
  });
}

function addFlow(output, flow) {
  if (!flow?.steps?.length) return;

  output.push(paragraph('Process Flow', 'Heading3'));

  flow.steps.forEach((step, index) => {
    const type = String(step.type || 'process').toUpperCase();

    output.push(
      paragraph(
        `${index + 1}. [${type}] ${step.label || ''}`,
        '',
        true
      )
    );

    if (step.description) {
      output.push(paragraph(step.description));
    }

    (step.branches || []).forEach((branch) => {
      output.push(
        bullet(
          `Branch: ${branch.label || ''} → ${branch.toStepId || ''}`
        )
      );
    });
  });

  addList(output, 'Business Rules', flow.businessRules);
  addList(output, 'Data Rules', flow.dataRules);
}

function addStory(output, story, index) {
  output.push(
    paragraph(
      `Story ${index + 1}: ${story.title || 'Untitled'}`,
      'Heading4'
    )
  );

  if (story.storyText) {
    output.push(paragraph(story.storyText));
  }

  if (story.status) {
    output.push(paragraph(`Status: ${story.status}`));
  }

  if (story.readyForRefinement !== undefined) {
    output.push(
      paragraph(
        story.readyForRefinement
          ? 'Ready for refinement'
          : 'Needs more detail',
        '',
        true
      )
    );
  }

  if (story.improvementNotes) {
    output.push(
      paragraph(`Notes: ${story.improvementNotes}`)
    );
  }

  addList(
    output,
    'Acceptance Criteria',
    story.acceptanceCriteria
  );

  addList(
    output,
    'Assumptions',
    story.assumptions
  );

  addList(
    output,
    'Dependencies',
    story.dependencies
  );

  addList(
    output,
    'Open Questions',
    story.openQuestions
  );
}

function addFeature(output, feature, index) {
  output.push(
    paragraph(
      `Feature ${index + 1}: ${feature.title || 'Untitled'}`,
      'Heading3'
    )
  );

  if (feature.description) {
    output.push(paragraph(feature.description));
  }

  if (feature.businessValue) {
    output.push(
      paragraph(`Business Value: ${feature.businessValue}`)
    );
  }

  (feature.stories || []).forEach((story, storyIndex) => {
    addStory(output, story, storyIndex);
  });

  addFlow(output, feature.flow);
}

function documentBody(payload) {
  const output = [
    paragraph('PreScope Backlog Export', 'Heading1'),
  ];

  if (payload.requestText) {
    output.push(
      paragraph(`Request: ${payload.requestText}`)
    );
  }

  if (payload.classification) {
    const classification =
      typeof payload.classification === 'string'
        ? {
            classification: payload.classification,
          }
        : payload.classification;

    const confidence = classification.confidence
      ? ` (${classification.confidence} confidence)`
      : '';

    output.push(
      paragraph(
        `Classification: ${
          classification.classification || ''
        }${confidence}`
      )
    );

    if (classification.businessNeed) {
      output.push(
        paragraph(
          `Business Need: ${classification.businessNeed}`
        )
      );
    }

    if (classification.reason) {
      output.push(
        paragraph(`Why: ${classification.reason}`)
      );
    }
  }

  if (payload.exportedAt) {
    output.push(
      paragraph(
        `Exported: ${new Date(
          payload.exportedAt
        ).toLocaleString('en-US')}`
      )
    );
  }

  if (payload.epic) {
    const epic = payload.epic;

    output.push(
      paragraph(
        `Epic: ${epic.title || 'Untitled'}`,
        'Heading1'
      )
    );

    if (epic.businessNeed) {
      output.push(
        paragraph(`Business Need: ${epic.businessNeed}`)
      );
    }

    (epic.initiatives || []).forEach(
      (initiative, initiativeIndex) => {
        output.push(
          paragraph(
            `Initiative ${initiativeIndex + 1}: ${
              initiative.title || 'Untitled'
            }`,
            'Heading2'
          )
        );

        if (initiative.description) {
          output.push(
            paragraph(initiative.description)
          );
        }

        if (initiative.businessNeed) {
          output.push(
            paragraph(
              `Business Need: ${initiative.businessNeed}`
            )
          );
        }

        (initiative.features || []).forEach(
          (feature, featureIndex) => {
            addFeature(
              output,
              feature,
              featureIndex
            );
          }
        );
      }
    );
  } else if (payload.standaloneInitiative) {
    const initiative = payload.standaloneInitiative;

    output.push(
      paragraph(
        `Initiative: ${initiative.title || 'Untitled'}`,
        'Heading1'
      )
    );

    if (initiative.businessNeed) {
      output.push(
        paragraph(
          `Business Need: ${initiative.businessNeed}`
        )
      );
    }

    (initiative.features || []).forEach(
      (feature, index) => {
        addFeature(output, feature, index);
      }
    );
  } else if (payload.standaloneFeatures) {
    const featureGroup = payload.standaloneFeatures;

    output.push(
      paragraph(
        `Feature Group: ${
          featureGroup.title || 'Untitled'
        }`,
        'Heading1'
      )
    );

    (featureGroup.features || []).forEach(
      (feature, index) => {
        addFeature(output, feature, index);
      }
    );
  } else if (payload.standaloneStories) {
    const storyGroup = payload.standaloneStories;

    output.push(
      paragraph(
        `Feature: ${storyGroup.title || 'Untitled'}`,
        'Heading1'
      )
    );

    (storyGroup.stories || []).forEach(
      (story, index) => {
        addStory(output, story, index);
      }
    );

    addFlow(output, storyGroup.flow);
  }

  return output.join('');
}

function createDocx(payload) {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels"
    ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml"
    ContentType="application/xml"/>
  <Override PartName="/word/document.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

  const relationships = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship
    Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
    Target="word/document.xml"/>
</Relationships>`;

  const documentRelationships = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship
    Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"
    Target="styles.xml"/>
</Relationships>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
        <w:sz w:val="22"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>

  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr>
      <w:b/>
      <w:sz w:val="36"/>
      <w:color w:val="0F172A"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr>
      <w:b/>
      <w:sz w:val="30"/>
      <w:color w:val="1E3A5F"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr>
      <w:b/>
      <w:sz w:val="26"/>
      <w:color w:val="2E75B6"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading4">
    <w:name w:val="heading 4"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr>
      <w:b/>
      <w:sz w:val="23"/>
      <w:color w:val="374151"/>
    </w:rPr>
  </w:style>
</w:styles>`;

  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${documentBody(payload)}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar
        w:top="1440"
        w:right="1440"
        w:bottom="1440"
        w:left="1440"
        w:header="720"
        w:footer="720"
        w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  return makeZip({
    '[Content_Types].xml': contentTypes,
    '_rels/.rels': relationships,
    'word/document.xml': document,
    'word/styles.xml': styles,
    'word/_rels/document.xml.rels':
      documentRelationships,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: 'Method not allowed' });
  }

  try {
    const file = createDocx(req.body || {});

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="prescope-export.docx"'
    );

    res.setHeader(
      'Content-Length',
      String(file.length)
    );

    return res.status(200).send(file);
  } catch (error) {
    console.error('Word export error:', error);

    return res.status(500).json({
      error:
        error?.message ||
        'Failed to generate Word document',
    });
  }
}
