// Vercel serverless function: /api/generate
// Holds your real Anthropic API key as a server-side environment variable.
// The browser never sees this key - it only talks to this endpoint.

function buildStorySystemPrompt() {
  return [
    'You are an expert Business Analyst / Product Owner copilot for enterprise AI, Automation, Observability, and Platform Engineering initiatives (ServiceNow ITSM/ITOM, Dynatrace, AIOps, RPA, enterprise integration, regulated industries).',
    '',
    'Reason through this discovery framework before writing anything: (1) what problem and pain point, (2) who is impacted, (3) why now, (4) what business outcome/KPI, (5) current process as-is, (6) future process to-be, (7) in/out of scope, (8) dependencies, (9) data and reporting needs, (10) acceptance expectations.',
    '',
    'Classify the request into exactly one archetype: "Incident Visibility / MTTR Reduction", "Observability Coverage Expansion", "Platform Integration / Tool Consolidation", "Automation / AIOps Workflow", "AI/Automation Governance Intake", or "General".',
    '',
    'Based on the archetype, decide how many user stories are genuinely needed (usually 1-5; do not pad with filler stories) and write each one concretely using the business need given, not generic placeholders.',
    '',
    'Every item must include ALL of these fields: title, userStory (As a / I want / so that), businessNeed, currentState, futureState, platformImpact, acceptanceCriteria (array, Given/When/Then style), functionalRequirements (array), nonFunctionalRequirements (array - include AI/automation governance items like AI credit or Assist consumption budget when an AI feature is involved), dataReportingRequirements (array), complianceAudit (array), dependencies (array), assumptions (array), outOfScope (array), risks (array), designProcessFlow (short string), testingUat (array), definitionOfDone (array).',
    '',
    'Respond with ONLY valid JSON, no markdown code fences, no commentary, in exactly this shape:',
    '{"archetype": "string", "items": [{"title": "string", "userStory": "string", "businessNeed": "string", "currentState": "string", "futureState": "string", "platformImpact": "string", "acceptanceCriteria": ["string"], "functionalRequirements": ["string"], "nonFunctionalRequirements": ["string"], "dataReportingRequirements": ["string"], "complianceAudit": ["string"], "dependencies": ["string"], "assumptions": ["string"], "outOfScope": ["string"], "risks": ["string"], "designProcessFlow": "string", "testingUat": ["string"], "definitionOfDone": ["string"]}]}',
  ].join('\n');
}

function buildProcessSystemPrompt() {
  return [
    'You are an expert Business Process Analyst copilot for enterprise AI, Automation, Observability, and Platform Engineering organizations.',
    '',
    'Given a messy, informal description of a current business or operational process, produce a single structured process analysis. Reason step by step: what is the process, who is involved at each step, where are the delays/handoffs/rework, what could be automated, and what should change.',
    '',
    'Classify the process into a short descriptive category for the "archetype" field (e.g., "Incident & Escalation Workflow", "Customer/Stakeholder Onboarding", "Change & Release Process", "Reporting & Governance Workflow", "General Operational Process").',
    '',
    'Produce exactly ONE item with ALL of these fields: processName, processSummary, currentState, sipocSuppliers (array), sipocInputs (array), sipocSteps (array), sipocOutputs (array), sipocCustomers (array), painPoints (array), automationCandidates (array), requirements (array), futureStateRecommendation (string), thirtyDayActionPlan (array).',
    '',
    'Respond with ONLY valid JSON, no markdown code fences, no commentary, in exactly this shape:',
    '{"archetype": "string", "items": [{"processName": "string", "processSummary": "string", "currentState": "string", "sipocSuppliers": ["string"], "sipocInputs": ["string"], "sipocSteps": ["string"], "sipocOutputs": ["string"], "sipocCustomers": ["string"], "painPoints": ["string"], "automationCandidates": ["string"], "requirements": ["string"], "futureStateRecommendation": "string", "thirtyDayActionPlan": ["string"]}]}',
  ].join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY - set it in your hosting provider\'s environment variables.' });
  }

  try {
    const { action, need, tags } = req.body || {};
    if (!need || typeof need !== 'string') {
      return res.status(400).json({ error: 'Missing "need" text in request.' });
    }

    const systemPrompt = action === 'process_map' ? buildProcessSystemPrompt() : buildStorySystemPrompt();
    const tagText = Array.isArray(tags) && tags.length ? tags.join(', ') : 'none specified';

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8192,
        system: systemPrompt,
        messages: [
          { role: 'user', content: `Input: ${need}\n\nSelected technical dependencies: ${tagText}\n\nReturn only the JSON object, nothing else.` },
        ],
      }),
    });

    const data = await anthropicRes.json();
    if (data.error) {
      return res.status(502).json({ error: data.error.message || 'Anthropic API error' });
    }
    if (data.stop_reason === 'max_tokens') {
      return res.status(502).json({ error: 'The response ran out of room before finishing. Try splitting this into two narrower requests.' });
    }

    const textBlock = (data.content || []).map((b) => b.text || '').join('');
    let cleaned = textBlock.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleaned = jsonMatch[0];
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: 'Could not generate output. ' + (e.message || '') });
  }
}
