const { useState, useEffect } = React;

const {
  Sparkles, Loader2, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Copy, Check,
  History, X, AlertTriangle, ListChecks, Trash2, HelpCircle, Map: MapIcon, ArrowLeft,
  Pencil, Save, XCircle, Plus, GitBranch, RefreshCw, Download, BookOpen
} = LucideReact;
const DOMAIN_CONFIG = {
  saas: {
    id: 'saas', label: 'SaaS / Software Product', icon: '\uD83D\uDE80',
    tagline: 'Web & Mobile Apps, APIs, B2B & B2C Products',
    color: { pill: 'bg-violet-950 border-violet-600 text-violet-300', card: 'border-violet-700', glow: 'hover:border-violet-500' },
    tags: ['Web App (React / Vue / Angular)','Mobile App (iOS / Android)','REST API','GraphQL API','PostgreSQL / MySQL','MongoDB / NoSQL','AWS / GCP / Azure','Auth0 / Okta','Stripe / Billing','Intercom / Support','Mixpanel / Amplitude / Analytics','Figma / Design System','Webhook / Event System','Kafka / Message Queue','Elasticsearch / Search','CI/CD Pipeline','Feature Flags (LaunchDarkly)'],
    promptContext: `Domain: SaaS and software product development.\nKey platforms: React/Vue/Angular, iOS/Android, REST/GraphQL APIs, AWS/GCP/Azure, Stripe, analytics, CRM.\nTypical personas: End User, Admin, Developer, Product Manager, Support Agent.\nCommon initiatives: Onboarding, core features, API integration, billing, notifications, search, admin, performance, analytics, self-serve trial.\nWrite stories with clear user outcomes verifiable in staging. NFRs: performance, error handling, mobile responsiveness, WCAG 2.1 AA.`,
    archetypes: '"User Onboarding & Activation","Core Feature Development","API & Integration","Billing & Subscription","Notifications & Messaging","Search & Discovery","Admin & Settings","Analytics & Reporting","Performance & Reliability","Self-Serve & Trial Flow"',
    examples: [
      { label: 'Epic', text: 'Build a self-serve onboarding flow so that new users can sign up, connect their data source, and see their first meaningful insight within 10 minutes without contacting sales or support.' },
      { label: 'Feature', text: 'Allow users to invite teammates to their workspace, assign them a role (Admin, Editor, or Viewer), and revoke access at any time from the Settings page.' },
      { label: 'Discovery', text: 'Users are dropping off during signup. We need to fix it.' },
    ],
  },
  itsm: {
    id: 'itsm', label: 'ITSM / Observability', icon: '\uD83D\uDD27',
    tagline: 'ServiceNow, Dynatrace, AIOps, Platform Engineering',
    color: { pill: 'bg-teal-950 border-teal-600 text-teal-300', card: 'border-teal-700', glow: 'hover:border-teal-500' },
    tags: ['ServiceNow (ITSM)','ServiceNow (ITOM / CMDB)','Dynatrace','Splunk','Datadog','Grafana','PagerDuty','AWS','Azure','GCP','RPA (UiPath / Power Automate)','Kafka / Event Bus','REST / SOAP API','SQL / NoSQL Database','LLM / AI Service','SSO / Identity','ChatOps (Slack/Teams)'],
    promptContext: `Domain: Enterprise ITSM, Observability, AIOps, and Platform Engineering.\nKey platforms: ServiceNow (ITSM/ITOM/CMDB), Dynatrace, Splunk, Datadog, PagerDuty, AIOps tooling.\nTypical personas: NOC Analyst, SRE, Platform Engineer, ITSM Admin, Operations Manager, BA/PO.\nCommon initiatives: Incident visibility, MTTR reduction, alert-to-incident automation, observability expansion, CMDB enrichment, problem management, AIOps governance, change/release workflow.\nRegulated industry context is common. Compliance, audit trail, and CAB approval are frequently relevant NFRs.`,
    archetypes: '"Incident Visibility / MTTR Reduction","Observability Coverage Expansion","Platform Integration / Tool Consolidation","Automation / AIOps Workflow","AI/Automation Governance Intake"',
    examples: [
      { label: 'Epic', text: 'Track an incident from the time it is reported through incident resolution, problem management, root cause analysis, code change, deployment, validation, and final closure across ServiceNow and Dynatrace.' },
      { label: 'Feature', text: 'Integrate Dynatrace with ServiceNow ITSM so that when a Dynatrace alert fires, an incident ticket is automatically created and assigned to the correct team.' },
      { label: 'Discovery', text: 'We need better reporting.' },
    ],
  },
  retail: {
    id: 'retail', label: 'Retail / eCommerce', icon: '\uD83D\uDED2',
    tagline: 'Storefront, Order Management, Payments, Loyalty',
    color: { pill: 'bg-orange-950 border-orange-600 text-orange-300', card: 'border-orange-700', glow: 'hover:border-orange-500' },
    tags: ['Shopify','Salesforce Commerce Cloud','Magento / Adobe Commerce','SAP Commerce','Stripe / Braintree','PayPal','Klarna / BNPL','AWS','Azure','GCP','Product Information Manager (PIM)','Order Management System (OMS)','Warehouse Management (WMS)','CRM / Loyalty Platform','Google Analytics / GA4','CDN / Akamai / Cloudflare','Search / Elasticsearch / Algolia','REST / GraphQL API','Kafka / Event Bus'],
    promptContext: `Domain: Retail and eCommerce.\nKey platforms: Shopify, Salesforce Commerce Cloud, Magento, Stripe, PayPal, PIM, OMS, WMS, CRM, loyalty platforms, analytics.\nTypical personas: Shopper, Store Associate, Merchandiser, Fulfilment Ops, Customer Service, Marketing Analyst.\nCommon initiatives: Checkout conversion, cart abandonment, order visibility, catalog management, loyalty/rewards, returns, payment methods, personalisation, inventory sync.\nRegulatory: PCI-DSS for payments, GDPR/CCPA for customer data, WCAG for storefronts.`,
    archetypes: '"Customer Discovery & Onboarding","Browse & Search Experience","Cart & Checkout Flow","Payments & Fraud Prevention","Order Management & Fulfilment","Returns & Refunds","Loyalty & Promotions","Inventory & Catalog Management"',
    examples: [
      { label: 'Epic', text: 'Build a Buy Online, Pick Up In Store (BOPIS) capability so customers can reserve items online and collect them at their nearest store within 2 hours.' },
      { label: 'Feature', text: 'Allow customers to apply a loyalty points balance at checkout to reduce the amount charged to their payment card, with a clear breakdown of points used and remaining balance.' },
      { label: 'Discovery', text: 'We need to improve conversion at checkout.' },
    ],
  },
  healthcare: {
    id: 'healthcare', label: 'Healthcare', icon: '\uD83C\uDFE5',
    tagline: 'EHR, Patient Engagement, Clinical Workflow, Compliance',
    color: { pill: 'bg-sky-950 border-sky-600 text-sky-300', card: 'border-sky-700', glow: 'hover:border-sky-500' },
    tags: ['Epic (EHR)','Cerner / Oracle Health','HL7 / FHIR API','MyChart / Patient Portal','Salesforce Health Cloud','AWS HealthLake','Microsoft Azure Health APIs','PACS / Medical Imaging','Laboratory Information System (LIS)','Pharmacy System','Telehealth / Video Platform','Prior Auth / Payer Gateway','Revenue Cycle Management (RCM)','SSO / Identity (Okta)','HIPAA-compliant Storage','REST / FHIR R4 API'],
    promptContext: `Domain: Healthcare.\nKey platforms: Epic, Cerner/Oracle Health, HL7/FHIR, MyChart, Salesforce Health Cloud, AWS HealthLake, PACS, LIS, RCM, payer/prior-auth gateways.\nTypical personas: Patient, Clinician (Physician/Nurse/NP), Care Coordinator, Scheduler, Billing Specialist, Compliance Officer, Health IT Admin.\nCommon initiatives: Patient portal, appointment scheduling, clinical decision support, care gap closure, prior auth automation, referral management, FHIR exchange, revenue cycle, telehealth.\nCRITICAL: HIPAA compliance is mandatory. Every story touching PHI must include explicit data-handling and access-control NFRs. Compliance is never optional.`,
    archetypes: '"Patient Access & Scheduling","Clinical Workflow & Documentation","Patient Engagement & Portal","Care Coordination & Referrals","Revenue Cycle & Prior Auth","Interoperability & Data Exchange","Compliance & Regulatory","Telehealth & Remote Care"',
    examples: [
      { label: 'Epic', text: 'Build a patient self-service portal so patients can schedule appointments, view health records, request prescription refills, and message their care team securely without calling the front desk.' },
      { label: 'Feature', text: 'Allow a care coordinator to submit a prior authorisation request directly from the patient chart in Epic, with real-time status tracking from the payer, without leaving the EHR.' },
      { label: 'Discovery', text: 'We need to reduce no-show rates.' },
    ],
  },
};
const HISTORY_KEY = 'prescope-history-v3';
const RESOURCES_KEY = 'prescope-resource-copies-v1';
const VERSION = 'v1.0';
const VERSION_DATE = 'July 2026';
const IS_DEPLOYED = typeof window !== 'undefined' && !window.location.hostname.includes('claude.ai') && window.location.hostname !== 'localhost' && window.location.hostname !== '';

const STATUSES = ['Not Started','Generated','Selected','In Review','Approved','Needs More Detail'];
const STATUS_STYLE = {
  'Not Started':       { bg:'bg-slate-800',  text:'text-slate-400',   border:'border-slate-700'  },
  'Generated':         { bg:'bg-sky-950',    text:'text-sky-300',     border:'border-sky-700'    },
  'Selected':          { bg:'bg-teal-950',   text:'text-teal-300',    border:'border-teal-700'   },
  'In Review':         { bg:'bg-violet-950', text:'text-violet-300',  border:'border-violet-700' },
  'Approved':          { bg:'bg-emerald-950',text:'text-emerald-300', border:'border-emerald-700'},
  'Needs More Detail': { bg:'bg-amber-950',  text:'text-amber-300',   border:'border-amber-700'  },
};

function StatusBadge({ status, onChange }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE['Not Started'];
  if (!onChange) return <span className={`mono text-[10px] px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>{status || 'Not Started'}</span>;
  return (
    <select value={status || 'Not Started'} onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className={`mono text-[10px] px-2 py-0.5 rounded-full border cursor-pointer ${s.bg} ${s.text} ${s.border} appearance-none`}
      style={{ WebkitAppearance: 'none' }}>
      {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
    </select>
  );
}
const THINKING_FRAMEWORK = {
  id: 'thinking-framework', title: 'Agile BA Thinking Framework', type: 'framework',
  subtitle: 'The Master Agile Thinking Pattern — 8 Domains from Discovery to Measurement',
  domains: [
    { id:'d1', name:'Discover', goal:'Understand WHY something exists.', fields:[
      {key:'epicName',label:'Initiative / Epic Name',multiline:false},
      {key:'businessProblem',label:'Business Problem (in one sentence)',multiline:true},
      {key:'whoExperiencesIt',label:'Who Experiences This Problem',multiline:true},
      {key:'evidence',label:'Evidence / Data Supporting the Problem',multiline:true},
      {key:'impactIfNothing',label:'Impact if Nothing Changes',multiline:true},
      {key:'businessNeed',label:'Proposed Business Need',multiline:true},
      {key:'successMetrics',label:"Success Metrics (how we'll know it worked)",multiline:true},
      {key:'sponsor',label:'Sponsor / Requesting Stakeholder',multiline:false},
    ]},
    { id:'d2', name:'Understand Current State', goal:"Understand today's environment before discussing tomorrow's solution.", fields:[
      {key:'processBeingAssessed',label:'Process / Workflow Being Assessed',multiline:false},
      {key:'currentWorkflow',label:'Step-by-Step Current Workflow',multiline:true},
      {key:'systemsInvolved',label:'Systems / Applications Involved',multiline:true},
      {key:'existingIntegrations',label:'Existing Integrations',multiline:true},
      {key:'manualWorkarounds',label:'Manual Workarounds',multiline:true},
      {key:'painPoints',label:'Pain Points & Bottlenecks',multiline:true},
      {key:'policies',label:'Relevant Policies / Constraints',multiline:true},
      {key:'stakeholdersConsulted',label:'Stakeholders Consulted',multiline:false},
    ]},
    { id:'d3', name:'Define Future State', goal:'Create the desired business outcome.', fields:[
      {key:'processBeingRedesigned',label:'Process / Workflow Being Redesigned',multiline:false},
      {key:'futureWorkflow',label:'Desired Future Workflow (step-by-step)',multiline:true},
      {key:'whatChanges',label:'What Changes From Today',multiline:true},
      {key:'whatStays',label:'What Stays the Same',multiline:true},
      {key:'whatAutomated',label:'What Becomes Automated',multiline:true},
      {key:'decisionsChange',label:'Decisions That Change',multiline:true},
      {key:'supportingArtifacts',label:'Supporting Artifacts (wireframes / journey map?)',multiline:false},
    ]},
    { id:'d4', name:'Translate Business into Requirements', goal:'Convert business flow into system behavior, business rules, functional requirements, acceptance criteria, and test cases.', fields:[
      {key:'processStep',label:'Process Step Being Analyzed',multiline:false},
      {key:'trigger',label:'Trigger',multiline:false},
      {key:'dataEntering',label:'Data Entering This Step',multiline:true},
      {key:'validationRules',label:'Validation Rules',multiline:true},
      {key:'businessRules',label:'Business Rules',multiline:true},
      {key:'approvalsRequired',label:'Approvals Required',multiline:false},
      {key:'notifications',label:'Notifications Triggered',multiline:true},
      {key:'exceptions',label:'Exceptions / Edge Cases',multiline:true},
      {key:'functionalRequirements',label:'Resulting Functional Requirement(s)',multiline:true},
      {key:'acceptanceCriteria',label:'Acceptance Criteria (Given / When / Then)',multiline:true},
    ]},
    { id:'d5', name:'Break Work Down', goal:'Decompose Business Need → Epic → Initiative → Feature → Story → Task.', fields:[
      {key:'epic',label:'Epic',multiline:false},
      {key:'relatedInitiative',label:'Related Initiative',multiline:false},
      {key:'features',label:'Feature(s)',multiline:true},
      {key:'story',label:'Story',multiline:true},
      {key:'fitsInSprint',label:'Story fits in one sprint? (Y/N)',multiline:false},
      {key:'canBeEstimated',label:'Story can be estimated? (Y/N)',multiline:false},
      {key:'oneOwner',label:'Story owned by one person? (Y/N)',multiline:false},
      {key:'oneOutcome',label:'Story has one clear outcome? (Y/N)',multiline:false},
      {key:'howToSplit',label:'If any answer is "No" — how will this be split?',multiline:true},
      {key:'resultingTasks',label:'Resulting Tasks',multiline:true},
    ]},
    { id:'d6', name:'Prioritize', goal:'Determine value and sequence once the work is understood — priority comes last, not first.', fields:[
      {key:'itemBeingPrioritized',label:'Item Being Prioritized (Epic / Feature / Story)',multiline:false},
      {key:'moscowCategory',label:"MoSCoW Category (Must / Should / Could / Won't)",multiline:false},
      {key:'businessValue',label:'Business Value (1–10)',multiline:false},
      {key:'risk',label:'Risk (1–10)',multiline:false},
      {key:'effort',label:'Effort (1–10)',multiline:false},
      {key:'dependencies',label:'Dependencies',multiline:true},
      {key:'regulatoryImpact',label:'Regulatory / Compliance Impact',multiline:false},
      {key:'customerImpact',label:'Customer Impact',multiline:true},
      {key:'prioritizationMethod',label:'Prioritization Method Used',multiline:false},
      {key:'finalPriority',label:'Final Priority / Rank',multiline:false},
    ]},
    { id:'d7', name:'Validate', goal:'Confirm the requirement is correct, testable, and approved before it moves forward.', fields:[
      {key:'requirementBeingValidated',label:'Requirement / Story Being Validated',multiline:false},
      {key:'testable',label:'Testable? (Y/N — explain)',multiline:true},
      {key:'measurable',label:'Measurable? (Y/N — explain)',multiline:true},
      {key:'traceable',label:'Traceable to Business Need? (Y/N — explain)',multiline:true},
      {key:'understandable',label:'Understandable to all stakeholders? (Y/N)',multiline:false},
      {key:'complete',label:"Complete? (Y/N — what's missing if not)",multiline:true},
      {key:'validatorsRequired',label:'Validators Required (Business / Compliance / Legal / Architecture / Ops / Support / QA)',multiline:true},
      {key:'approvalStatus',label:'Approval Status & Sign-Off Date',multiline:false},
    ]},
    { id:'d8', name:'Measure', goal:'Confirm whether the original problem was actually solved.', fields:[
      {key:'epicBeingMeasured',label:'Initiative / Epic Being Measured',multiline:false},
      {key:'originalMetrics',label:'Original Success Metric(s) (from Discover)',multiline:true},
      {key:'actualResult',label:'Actual Result',multiline:true},
      {key:'problemSolved',label:'Did We Solve the Problem? (Y/N — explain)',multiline:true},
      {key:'businessValueDelivered',label:'Business Value Delivered',multiline:true},
      {key:'roi',label:'ROI (if calculable)',multiline:false},
      {key:'customerSatisfaction',label:'Customer Satisfaction Signal',multiline:true},
      {key:'lessonsLearned',label:'Lessons Learned',multiline:true},
    ]},
  ],
};

const BA_TOOLKIT = {
  id:'ba-toolkit', title:'Agile BA Toolkit', type:'toolkit',
  subtitle:'A working companion to the Agile BA Thinking Framework — 6 live templates',
  sheets:[
    {id:'breakdown',name:'Breakdown Tracker',domain:'Domain 5 — Break Work Down',description:'Track Epic → Feature → Story → Task with the 4-question split test.',
     columns:['Epic','Feature','Story','Fits in 1 Sprint? (Y/N)','Can Be Estimated? (Y/N)','One Owner? (Y/N)','One Outcome? (Y/N)','Split Needed?','Resulting Tasks'],
     sampleRows:[['Customer Self-Service Portal','Account Management','As a customer, I can update my mailing address','Y','Y','Y','Y','No','Update address form; Validate address; Save & confirm']],emptyRows:10},
    {id:'moscow',name:'MoSCoW Prioritization',domain:'Domain 6 — Prioritize',description:"Classify backlog items as Must / Should / Could / Won't Have.",
     columns:['Item (Epic/Feature/Story)','Description','Category','Business Value (1-10)','Risk (1-10)','Customer Impact','Notes'],
     sampleRows:[['Address update self-service','Let customers update mailing address online','Must Have','9','3','High','Currently requires a phone call'],['Dark mode UI','Optional visual theme','Could Have','3','1','Low','Frequently requested but non-critical']],emptyRows:8},
    {id:'wsjf',name:'WSJF Calculator',domain:'Domain 6 — Prioritize',description:'Weighted Shortest Job First scoring — score = (Business Value + Time Criticality + Risk Reduction) / Job Size.',
     columns:['Item','Business Value (1-10)','Time Criticality (1-10)','Risk Reduction / Opp. Enablement (1-10)','Job Size (1-10)','WSJF Score','Rank'],
     sampleRows:[['Address update self-service','8','6','4','3','',''],['Dark mode UI','3','2','1','5','',''],['Fraud alert automation','9','9','8','6','','']],emptyRows:7},
    {id:'traceability',name:'Traceability Matrix',domain:'Domain 7 — Validate',description:'Trace Business Need → Requirement → Test Case → Status.',
     columns:['Business Need / Epic','Requirement ID','Requirement Description','Acceptance Criteria','Test Case ID','Test Status','Approved By'],
     sampleRows:[['Reduce call center volume','REQ-101','Customer can update mailing address in portal','Given logged-in customer, when they submit new address, then it is validated and saved','TC-101','Passed','Jane Doe (Business)']],emptyRows:9},
    {id:'benefits',name:'Benefits Realization',domain:'Domain 8 — Measure',description:'Track success metrics, actual results, and lessons learned.',
     columns:['Initiative / Epic','Success Metric (from Discover)','Target','Actual Result','Problem Solved? (Y/N)','Business Value Delivered','Lessons Learned'],
     sampleRows:[['Customer Self-Service Portal','Reduce address-change calls to support','-30%','-42%','Y','Reduced support cost; faster customer resolution','Rollout comms drove faster adoption than expected']],emptyRows:7},
    {id:'ceremony',name:'Ceremony Map',domain:'Quick Reference',description:'Which ceremony maps to which thinking domain and output.',
     columns:['Ceremony','Primary Thinking','Key Outputs'],
     sampleRows:[['Idea Intake','Discover Problem','Business Need, Opportunity'],['Epic Workshop','Understand + Future State','Epic, Objectives'],['Discovery Workshop','Current State + Future State','Process Maps, Personas'],['Backlog Refinement','Clarify + Split + Prioritize','Ready Stories'],['Sprint Planning','Commit + Estimate','Sprint Goal'],['Daily Scrum','Execute + Remove Blockers','Updated Plan'],['Story Grooming','Clarify Details','Acceptance Criteria'],['Design Review','Validate Solution','Wireframes, Technical Decisions'],['UAT','Validate Business Outcome','Accepted Stories'],['Sprint Review','Demonstrate Value','Stakeholder Feedback'],['Retrospective','Improve Process','Improvement Actions'],['PI Planning','Strategic Prioritization','Features, Objectives'],['Quarterly Planning','Portfolio Decisions','Roadmap']],emptyRows:0},
  ],
};
function classificationPrompt(domainCtx=''){return['You are a senior Business Analyst and Product Owner.',domainCtx,'','Analyze the request and classify into exactly one of: "Epic","High-Level Initiative","Initiative / Feature Group","Feature","User Story","Discovery Needed".','Guidance: Epic=spans full lifecycle or multiple independent workflows. High-Level Initiative=substantial bounded outcome needing feature breakdown. Initiative/Feature Group=cluster of related features. Feature=single bounded capability ready for stories. User Story=specific user need ready for validation. Discovery Needed=too vague to classify.','Do not generate user stories. Respond with ONLY valid JSON, no commentary, no markdown:','{"classification":"Epic|High-Level Initiative|Initiative / Feature Group|Feature|User Story|Discovery Needed","confidence":"High|Medium|Low","reason":"string","businessNeed":"string","recommendedNextStep":"string","discoveryQuestions":["string"]}','Only populate discoveryQuestions (2-4 questions) when Discovery Needed; otherwise return [].'].filter(Boolean).join('\n');}

function epicPrompt(domainCtx=''){return['You are a senior Business Analyst and Product Owner.',domainCtx,'','The request is classified as an Epic. Generate 4-6 high-level initiatives covering the full scope. Do not generate features or stories yet. Be concrete and specific to this epic.','Respond with ONLY valid JSON:','{"initiatives":[{"id":"init-1","title":"string","description":"string","businessNeed":"string"}]}'].filter(Boolean).join('\n');}

function initiativePrompt(domainCtx=''){return['You are a senior Business Analyst and Product Owner.',domainCtx,'','The user selected the initiative below. Generate features needed to deliver it. Do not generate stories yet. Each feature must be a single bounded capability.','Respond with ONLY valid JSON:','{"features":[{"id":"feat-1","title":"string","description":"string","businessValue":"string"}]}'].filter(Boolean).join('\n');}

function featurePrompt(domainCtx=''){return['You are a senior Business Analyst and Product Owner.',domainCtx,'','The user selected the feature below. Generate 2-4 user stories to fully deliver it. Each story needs Given/When/Then acceptance criteria plus assumptions, dependencies, and open questions (empty arrays are fine).','Respond with ONLY valid JSON:','{"stories":[{"id":"story-1","title":"string","storyText":"As a ... I want ... so that ...","acceptanceCriteria":["string"],"assumptions":["string"],"dependencies":["string"],"openQuestions":["string"]}]}'].filter(Boolean).join('\n');}

function storyRefinePrompt(domainCtx=''){return['You are a senior Business Analyst and Product Owner.',domainCtx,'','The user provided a user story. Validate it, improve the wording, add/improve acceptance criteria (Given/When/Then), flag missing info, and confirm if it is ready for refinement.','Respond with ONLY valid JSON:','{"stories":[{"id":"story-1","title":"string","storyText":"As a ... I want ... so that ... (improved)","acceptanceCriteria":["string"],"assumptions":["string"],"dependencies":["string"],"openQuestions":["string"],"readyForRefinement":true,"improvementNotes":"string"}]}'].filter(Boolean).join('\n');}

function flowDiagramPrompt(domainCtx=''){return['You are a senior Business Analyst modeling the OPERATIONAL runtime process based on a feature and its user stories.',domainCtx,'','CRITICAL: NOT an implementation plan. Every step must be part of the live running process. Derive steps from Given/When/Then acceptance criteria.','Produce 5-9 steps. Each: id, type (start/process/decision/end), label (3-6 words), description (under 15 words). Decision steps include "branches" array of {label,toStepId}.','Also produce businessRules (operational rules the system enforces) and dataRules (field-level validation, mapping, required fields).','Respond with ONLY valid JSON:','{"steps":[{"id":"s1","type":"start|process|decision|end","label":"string","description":"string","branches":[{"label":"string","toStepId":"string"}]}],"businessRules":["string"],"dataRules":["string"]}'].filter(Boolean).join('\n');}
async function callClaude(
  systemPrompt,
  userContent,
  maxTokens = 4096,
  model = 'claude-sonnet-4-6'
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    if (!window.Clerk) {
      throw new Error('AUTH_REQUIRED');
    }

    await window.Clerk.load();

    if (!window.Clerk.session) {
      throw new Error('AUTH_REQUIRED');
    }

    const token = await window.Clerk.session.getToken();

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userContent
          }
        ]
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || 'API_ERROR');
    }

    if (data.stop_reason === 'max_tokens') {
      throw new Error('TRUNCATED');
    }

    const text = (data.content || [])
      .map(block => block.text || '')
      .join('');

    if (!text.trim()) {
      throw new Error('EMPTY_RESULT');
    }

    let cleaned = text
      .replace(/```json|```/g, '')
      .trim();

    const match = cleaned.match(/\{[\s\S]*\}/);

    if (match) {
      cleaned = match[0];
    }

    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error('PARSE_FAILED');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('TIMEOUT');
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function errorMessage(e){
  if(e.message==='TIMEOUT')return 'That took longer than 45 seconds. Usually temporary \u2014 try again.';
  if(e.message==='TRUNCATED')return 'The response ran out of room. Try a narrower selection.';
  if(e.message==='PARSE_FAILED')return 'The response came back in an unexpected format. Usually transient \u2014 try again.';
  if(e.message==='EMPTY_RESULT')return 'No output came back \u2014 tap the item again to retry.';
  return `Could not complete that step${e?.message?` (${e.message})`:''}.  Try again or rephrase the request.`;
}

const uid=(p)=>`${p}-${Date.now()}-${Math.floor(Math.random()*1000)}`;

// ── Auth helpers ──────────────────────────────────────────────────────────
const FREE_LIMIT = 2;

async function verifySession(token) {
  try {
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionToken: token }) });
    return res.ok ? await res.json() : null;
  } catch (e) { return null; }
}

async function checkUsage(userId) {
  try {
    const res = await fetch('/api/usage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, action: 'check' }) });
    return res.ok ? await res.json() : { allowed: true, remaining: FREE_LIMIT };
  } catch (e) { return { allowed: true, remaining: FREE_LIMIT }; }
}

async function incrementUsage(userId) {
  try {
    const res = await fetch('/api/usage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, action: 'increment' }) });
    return res.ok ? await res.json() : { allowed: true, remaining: FREE_LIMIT - 1 };
  } catch (e) { return { allowed: true, remaining: FREE_LIMIT - 1 }; }
}

function useGuestUsage() {
  const currentMonth = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}`; };
  const [usage, setUsage] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bc-guest-usage') || '{"count":0,"month":""}'); }
    catch (e) { return { count: 0, month: '' }; }
  });
  const month = currentMonth();
  const used = usage.month === month ? usage.count : 0;
  const remaining = Math.max(0, FREE_LIMIT - used);
  function increment() {
    const next = { count: (usage.month === month ? usage.count : 0) + 1, month };
    setUsage(next);
    try { localStorage.setItem('bc-guest-usage', JSON.stringify(next)); } catch (e) {}
    return Math.max(0, FREE_LIMIT - next.count);
  }
  return { remaining, increment };
}

// ── Login Screen ─────────────────────────────────────────────────────────
function LoginScreen({ onSignIn, onContinueAsGuest, guestRemaining }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-semibold text-slate-50 mb-1">Prescope™</div>
          <p className="text-sm text-slate-400">Sign in to save your work and track generations.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <button
            onClick={async () => { setLoading(true); await onSignIn(); setLoading(false); }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm px-4 py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin"/> :
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            }
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>
          <div className="flex items-center gap-3 text-xs text-slate-600"><div className="flex-1 h-px bg-slate-800"/><span>or</span><div className="flex-1 h-px bg-slate-800"/></div>
          <button onClick={onContinueAsGuest} className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 px-4 py-3 rounded-xl transition-colors">
            Continue as guest
            {IS_DEPLOYED && <span className="mono text-[10px] text-slate-600">· {guestRemaining} generation{guestRemaining !== 1 ? 's' : ''} remaining</span>}
          </button>
        </div>
        <div className="mt-4 text-center text-xs text-slate-600 leading-relaxed">
          By continuing you agree to our <a href="/terms.html" className="text-slate-500 hover:text-teal-400">Terms of Service</a> and <a href="/privacy.html" className="text-slate-500 hover:text-teal-400">Privacy Policy</a>.
        </div>
        {!IS_DEPLOYED && (
          <div className="mt-4 text-center mono text-[10px] text-slate-700 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
            Preview mode — Google login available on the deployed app
          </div>
        )}
      </div>
    </div>
  );
}

// ── User Menu ────────────────────────────────────────────────────────────
function UserMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const t = setTimeout(() => window.addEventListener('click', close), 0);
    return () => { clearTimeout(t); window.removeEventListener('click', close); };
  }, [open]);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 text-sm border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 transition-colors">
        <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-slate-950">
          {(user?.email?.[0] || 'U').toUpperCase()}
        </div>
        <span className="text-slate-300 max-w-[120px] truncate text-xs hidden sm:block">{user?.email || 'Account'}</span>
        <ChevronDown size={14} className="text-slate-500"/>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden w-56">
          <div className="px-4 py-3 border-b border-slate-800">
            <div className="text-xs text-slate-500 mb-0.5">Signed in as</div>
            <div className="text-sm text-slate-200 truncate">{user?.email}</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              {user?.plan === 'paid'
                ? <span className="mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300">✓ Paid plan</span>
                : <>
                    <span className="mono text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">Free tier</span>
                    <span className="mono text-[10px] text-slate-500">{user?.remaining ?? FREE_LIMIT} gen remaining</span>
                  </>
              }
            </div>
          </div>
          {user?.plan !== 'paid' && (
            <a href="/signup.html" className="flex items-center gap-2 px-4 py-3 text-sm text-teal-300 hover:bg-slate-800 border-b border-slate-800">
              <Sparkles size={14}/> Upgrade to full access →
            </a>
          )}
          <button onClick={() => { setOpen(false); onSignOut(); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-left">
            <X size={14}/> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

// ── Upgrade Prompt ────────────────────────────────────────────────────────
function UpgradePrompt({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-5">
      <div className="bg-slate-900 border border-teal-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className="text-3xl mb-3">⚡</div>
        <h2 className="text-lg font-bold mb-2">Free tier limit reached</h2>
        <p className="text-sm text-slate-400 mb-5">You've used your 2 free generations this month. Upgrade to unlock unlimited generations, process flows, Word export, and the full BA Toolkit.</p>
        <a href="/signup.html" className="block w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm py-3 rounded-xl mb-3 transition-colors">
          Upgrade — $19/month or $190/year →
        </a>
        {IS_DEPLOYED && <button onClick={onDismiss} className="text-xs text-slate-500 hover:text-slate-300">Maybe later</button>}
        {!IS_DEPLOYED && <p className="text-xs text-slate-600 mono">Limit not enforced in preview mode</p>}
      </div>
    </div>
  );
}

function AppInner({ authStatus='guest', user=null, canGenerate=true, generationsRemaining=FREE_LIMIT, isPaid=false, onSignIn, onSignOut, onGenerate }) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [productType,setProductType]=useState(null);
  const domain=()=>productType?DOMAIN_CONFIG[productType]:null;
  const domainCtx=()=>domain()?.promptContext||'';
  const [requestText,setRequestText]=useState('');
  const [tags,setTags]=useState([]);
  const [loading,setLoading]=useState('');
  const [error,setError]=useState('');
  const [classification,setClassification]=useState(null);
  const [epic,setEpic]=useState(null);
  const [standaloneInitiative,setStandaloneInitiative]=useState(null);
  const [standaloneFeatures,setStandaloneFeatures]=useState(null);
  const [standaloneStories,setStandaloneStories]=useState(null);
  const [view,setView]=useState('productSelect');
  const [activeInitiativeId,setActiveInitiativeId]=useState(null);
  const [activeFeatureId,setActiveFeatureId]=useState(null);
  const [editingFeatureId,setEditingFeatureId]=useState(null);
  const [featureDraft,setFeatureDraft]=useState(null);
  const [editingStoryId,setEditingStoryId]=useState(null);
  const [storyDraft,setStoryDraft]=useState(null);
  const [confirmDelete,setConfirmDelete]=useState(null);
  const [confirmNewRequest,setConfirmNewRequest]=useState(false);
  const [currentHistoryId,setCurrentHistoryId]=useState(null);
  const [addingFeature,setAddingFeature]=useState(false);
  const [addingStory,setAddingStory]=useState(false);
  const [newFeatureDraft,setNewFeatureDraft]=useState({title:'',description:'',businessValue:''});
  const [newStoryDraft,setNewStoryDraft]=useState({title:'',storyText:'',acceptanceCriteria:'',assumptions:'',dependencies:'',openQuestions:''});
  const [resumePrompt,setResumePrompt]=useState(null);
  const [expandedStory,setExpandedStory]=useState({});
  const [copiedKey,setCopiedKey]=useState('');
  const [history,setHistory]=useState([]);
  const [historyOpen,setHistoryOpen]=useState(false);
  const [storageReady,setStorageReady]=useState(true);
  const [elapsedSeconds,setElapsedSeconds]=useState(0);
  const [showResources,setShowResources]=useState(false);
  const [resourceCopies,setResourceCopies]=useState([]);
  const [activeResource,setActiveResource]=useState(null);
  const [resourceActiveSheet,setResourceActiveSheet]=useState(0);
  const [namingCopy,setNamingCopy]=useState(null);
  const [copyNameInput,setCopyNameInput]=useState('');
  const [exportContent,setExportContent]=useState(null);
  const [exportCopied,setExportCopied]=useState(false);
  const [exportMenuOpen,setExportMenuOpen]=useState(false);
  const hasExportableContent=!!(epic||standaloneInitiative||standaloneFeatures||standaloneStories);

  useEffect(()=>{
    (async()=>{try{const r=await window.storage.get(HISTORY_KEY,false);if(r&&r.value){const saved=JSON.parse(r.value);setHistory(saved);const latest=saved[0];if(latest&&(latest.epic||latest.standaloneInitiative||latest.standaloneFeatures||latest.standaloneStories)){setResumePrompt(latest);}}}catch(e){}})();
    (async()=>{try{const r=await window.storage.get(RESOURCES_KEY,false);if(r&&r.value)setResourceCopies(JSON.parse(r.value));}catch(e){}})();
  },[]);

  useEffect(()=>{if(!loading){setElapsedSeconds(0);return;}setElapsedSeconds(0);const i=setInterval(()=>setElapsedSeconds(s=>s+1),1000);return()=>clearInterval(i);},[loading]);

  function loadingMessage(){if(elapsedSeconds<5)return'Working on it\u2026';if(elapsedSeconds<15)return'Still working \u2014 this is normal for detailed requests.';if(elapsedSeconds<30)return'Larger requests can take a little longer. Still going.';return'Almost there \u2014 complex requests can take up to 45 seconds.';}

  useEffect(()=>{
    if(!currentHistoryId||!classification)return;
    const entry={id:currentHistoryId,timestamp:new Date().toISOString(),requestText,tags:[...tags],classification,productType,epic,standaloneInitiative,standaloneFeatures,standaloneStories};
    setHistory(prev=>{const next=[entry,...prev.filter(h=>h.id!==currentHistoryId)].slice(0,20);window.storage.set(HISTORY_KEY,JSON.stringify(next),false).catch(()=>setStorageReady(false));return next;});
  },[currentHistoryId,classification,epic,standaloneInitiative,standaloneFeatures,standaloneStories]);

  useEffect(()=>{if(!exportMenuOpen)return;const close=()=>setExportMenuOpen(false);const t=setTimeout(()=>window.addEventListener('click',close),0);return()=>{clearTimeout(t);window.removeEventListener('click',close);};},[exportMenuOpen]);

  async function persistHistory(next){setHistory(next);try{await window.storage.set(HISTORY_KEY,JSON.stringify(next),false);}catch(e){setStorageReady(false);}}

  function resetAll(){setRequestText('');setTags([]);setError('');setClassification(null);setEpic(null);setStandaloneInitiative(null);setStandaloneFeatures(null);setStandaloneStories(null);setView('productSelect');setActiveInitiativeId(null);setActiveFeatureId(null);setExpandedStory({});setCurrentHistoryId(null);setProductType(null);}

  const toLines=(arr)=>(arr||[]).join('\n');
  const fromLines=(text)=>text.split('\n').map(l=>l.trim()).filter(Boolean);
  function tagContext(){return tags.length?`\nSelected technical dependencies: ${tags.join(', ')}`:'';};
  function currentTags(){return domain()?.tags||[];};
  function toggleTag(tag){setTags(prev=>prev.includes(tag)?prev.filter(t=>t!==tag):[...prev,tag]);};

  async function classify(){
    if(!requestText.trim()){setError('Describe the request first.');return;}
    if(!canGenerate){setShowUpgrade(true);return;}
    const allowed = await onGenerate();
    if(!allowed){setShowUpgrade(true);return;}
    setLoading('classify');setError('');
    try{const result=await callClaude(classificationPrompt(domainCtx()),`Request: ${requestText}${tagContext()}`,1200,'claude-haiku-4-5-20251001');setClassification(result);setView('classification');setCurrentHistoryId(uid('hist'));}
    catch(e){setError(errorMessage(e));}finally{setLoading('');}
  }

  async function retryGeneration(){
    if(!classification)return;setLoading('generating');setError('');
    try{const cl=classification;
      if(cl.classification==='Epic')await loadEpicInitiatives(cl);
      else if(cl.classification==='High-Level Initiative')await loadStandaloneInitiativeFeatures(cl);
      else if(cl.classification==='Initiative / Feature Group')await loadStandaloneFeatures(cl);
      else if(cl.classification==='Feature')await loadStoriesForText(requestText,cl,featurePrompt);
      else if(cl.classification==='User Story')await loadStoriesForText(requestText,cl,storyRefinePrompt);
    }catch(e){setError(errorMessage(e));}finally{setLoading('');}
  }

  async function loadEpicInitiatives(cls){
    const r=await callClaude(epicPrompt(domainCtx()),`Epic: ${requestText}\nBusiness need: ${cls.businessNeed}${tagContext()}`,3000);
    const initiatives=(r.initiatives||[]).map(i=>({...i,id:i.id||uid('init'),status:'Generated',features:null}));
    setEpic({id:uid('epic'),title:requestText.length>80?requestText.slice(0,80)+'\u2026':requestText,businessNeed:cls.businessNeed,initiatives});setView('epicView');
  }

  async function selectInitiative(initiativeId){
    setActiveInitiativeId(initiativeId);const init=epic.initiatives.find(i=>i.id===initiativeId);if(init.features){setView('initiativeView');return;}
    setLoading('features');setError('');
    try{const r=await callClaude(initiativePrompt(domainCtx()),`Parent epic: ${epic.title}\nInitiative: ${init.title}\nDescription: ${init.description}\nBusiness need: ${init.businessNeed}${tagContext()}`,2500);
      const features=(r.features||[]).map(f=>({...f,id:f.id||uid('feat'),status:'Generated',stories:null}));
      setEpic(prev=>({...prev,initiatives:prev.initiatives.map(i=>i.id===initiativeId?{...i,features,status:'Selected'}:i)}));setView('initiativeView');
    }catch(e){setError(errorMessage(e));}finally{setLoading('');}
  }

  async function selectFeatureInEpic(featureId){
    setActiveFeatureId(featureId);const init=epic.initiatives.find(i=>i.id===activeInitiativeId);const feat=init.features.find(f=>f.id===featureId);if(feat.stories){setView('featureView');return;}
    setLoading('stories');setError('');
    try{const r=await callClaude(featurePrompt(domainCtx()),`Parent epic: ${epic.title}\nParent initiative: ${init.title}\nFeature: ${feat.title}\nDescription: ${feat.description}\nBusiness value: ${feat.businessValue}${tagContext()}`,8192);
      const stories=(r.stories||[]).map(s=>({...s,id:s.id||uid('story'),status:'Not Started'}));if(stories.length===0)throw new Error('EMPTY_RESULT');
      setEpic(prev=>({...prev,initiatives:prev.initiatives.map(i=>i.id===activeInitiativeId?{...i,features:i.features.map(f=>f.id===featureId?{...f,stories,status:'Selected'}:f)}:i)}));setView('featureView');
    }catch(e){setError(errorMessage(e));}finally{setLoading('');}
  }

  async function loadStandaloneInitiativeFeatures(cls){
    const r=await callClaude(initiativePrompt(domainCtx()),`Initiative: ${requestText}\nBusiness need: ${cls.businessNeed}${tagContext()}`,2500);
    const features=(r.features||[]).map(f=>({...f,id:f.id||uid('feat'),status:'Generated',stories:null}));
    setStandaloneInitiative({title:requestText,businessNeed:cls.businessNeed,features});setView('initiativeView');
  }

  async function selectFeatureStandalone(featureId){
    setActiveFeatureId(featureId);const feat=standaloneInitiative.features.find(f=>f.id===featureId);if(feat.stories){setView('featureView');return;}
    setLoading('stories');setError('');
    try{const r=await callClaude(featurePrompt(domainCtx()),`Parent initiative: ${standaloneInitiative.title}\nFeature: ${feat.title}\nDescription: ${feat.description}\nBusiness value: ${feat.businessValue}${tagContext()}`,8192);
      const stories=(r.stories||[]).map(s=>({...s,id:s.id||uid('story'),status:'Not Started'}));if(stories.length===0)throw new Error('EMPTY_RESULT');
      setStandaloneInitiative(prev=>({...prev,features:prev.features.map(f=>f.id===featureId?{...f,stories}:f)}));setView('featureView');
    }catch(e){setError(errorMessage(e));}finally{setLoading('');}
  }

  async function loadStandaloneFeatures(cls){
    const r=await callClaude(initiativePrompt(domainCtx()),`Feature group: ${requestText}\nBusiness need: ${cls.businessNeed}${tagContext()}`,2500);
    const features=(r.features||[]).map(f=>({...f,id:f.id||uid('feat'),status:'Generated',stories:null}));
    setStandaloneFeatures({title:requestText,features});setView('initiativeView');
  }

  async function selectFeatureGroup(featureId){
    setActiveFeatureId(featureId);const feat=standaloneFeatures.features.find(f=>f.id===featureId);if(feat.stories){setView('featureView');return;}
    setLoading('stories');setError('');
    try{const r=await callClaude(featurePrompt(domainCtx()),`Feature: ${feat.title}\nDescription: ${feat.description}\nBusiness value: ${feat.businessValue}${tagContext()}`,8192);
      const stories=(r.stories||[]).map(s=>({...s,id:s.id||uid('story'),status:'Not Started'}));if(stories.length===0)throw new Error('EMPTY_RESULT');
      setStandaloneFeatures(prev=>({...prev,features:prev.features.map(f=>f.id===featureId?{...f,stories}:f)}));setView('featureView');
    }catch(e){setError(errorMessage(e));}finally{setLoading('');}
  }

  async function loadStoriesForText(text,cls,promptFn){
    const r=await callClaude(promptFn(domainCtx()),`Request: ${text}\nBusiness need: ${cls.businessNeed||''}${tagContext()}`,8192);
    const stories=(r.stories||[]).map(s=>({...s,id:s.id||uid('story'),status:'Not Started'}));if(stories.length===0)throw new Error('EMPTY_RESULT');
    setStandaloneStories({title:text,stories});setView('featureView');
  }

  function backToEpic(){setActiveInitiativeId(null);setActiveFeatureId(null);setView('epicView');}
  function backToInitiative(){setActiveFeatureId(null);setView('initiativeView');}

  function currentFeatureList(){
    if(epic&&activeInitiativeId)return epic.initiatives.find(i=>i.id===activeInitiativeId)?.features||[];
    if(standaloneInitiative)return standaloneInitiative.features;
    if(standaloneFeatures)return standaloneFeatures.features;
    return[];
  }
  function currentStories(){
    if(epic&&activeInitiativeId&&activeFeatureId){const init=epic.initiatives.find(i=>i.id===activeInitiativeId);return init?.features.find(f=>f.id===activeFeatureId)?.stories||[];}
    if((standaloneInitiative||standaloneFeatures)&&activeFeatureId)return currentFeatureList().find(f=>f.id===activeFeatureId)?.stories||[];
    if(standaloneStories)return standaloneStories.stories;
    return[];
  }
  function currentFeatureTitle(){if(activeFeatureId){const f=currentFeatureList().find(x=>x.id===activeFeatureId);if(f)return f.title;}return standaloneStories?null:'';}
  function selectFeature(featureId){if(epic)return selectFeatureInEpic(featureId);if(standaloneInitiative)return selectFeatureStandalone(featureId);if(standaloneFeatures)return selectFeatureGroup(featureId);}

  function updateFeatureList(updater){
    if(epic&&activeInitiativeId)setEpic(p=>({...p,initiatives:p.initiatives.map(i=>i.id===activeInitiativeId?{...i,features:updater(i.features)}:i)}));
    else if(standaloneInitiative)setStandaloneInitiative(p=>({...p,features:updater(p.features)}));
    else if(standaloneFeatures)setStandaloneFeatures(p=>({...p,features:updater(p.features)}));
  }
  function removeFeature(id){updateFeatureList(fs=>fs.filter(f=>f.id!==id));}
  function saveFeatureEdit(id,updates){updateFeatureList(fs=>fs.map(f=>f.id===id?{...f,...updates}:f));}
  function updateFeatureStatus(id,status){updateFeatureList(fs=>fs.map(f=>f.id===id?{...f,status}:f));}
  function addFeature(nf){updateFeatureList(fs=>[...(fs||[]),{...nf,id:uid('feat'),status:'Not Started',stories:null,flow:null}]);}

  function updateStoriesList(updater){
    if(epic&&activeInitiativeId&&activeFeatureId)setEpic(p=>({...p,initiatives:p.initiatives.map(i=>i.id===activeInitiativeId?{...i,features:i.features.map(f=>f.id===activeFeatureId?{...f,stories:updater(f.stories)}:f)}:i)}));
    else if((standaloneInitiative||standaloneFeatures)&&activeFeatureId){const setter=standaloneInitiative?setStandaloneInitiative:setStandaloneFeatures;setter(p=>({...p,features:p.features.map(f=>f.id===activeFeatureId?{...f,stories:updater(f.stories)}:f)}));}
    else if(standaloneStories)setStandaloneStories(p=>({...p,stories:updater(p.stories)}));
  }
  function removeStory(id){updateStoriesList(ss=>ss.filter(s=>s.id!==id));}
  function saveStoryEdit(id,updates){updateStoriesList(ss=>ss.map(s=>s.id===id?{...s,...updates}:s));}
  function updateStoryStatus(id,status){updateStoriesList(ss=>ss.map(s=>s.id===id?{...s,status}:s));}
  function addStory(ns){updateStoriesList(ss=>[...(ss||[]),{id:uid('story'),status:'Not Started',title:ns.title||'',storyText:ns.storyText||'',acceptanceCriteria:fromLines(ns.acceptanceCriteria||''),assumptions:fromLines(ns.assumptions||''),dependencies:fromLines(ns.dependencies||''),openQuestions:fromLines(ns.openQuestions||'')}]);}

  function startEditFeature(feat){setEditingFeatureId(feat.id);setFeatureDraft({title:feat.title||'',description:feat.description||'',businessValue:feat.businessValue||''});}
  function cancelEditFeature(){setEditingFeatureId(null);setFeatureDraft(null);}
  function confirmEditFeature(id){saveFeatureEdit(id,{...featureDraft});setEditingFeatureId(null);setFeatureDraft(null);}
  function startEditStory(s){setEditingStoryId(s.id);setStoryDraft({title:s.title||'',storyText:s.storyText||'',acceptanceCriteria:toLines(s.acceptanceCriteria),assumptions:toLines(s.assumptions),dependencies:toLines(s.dependencies),openQuestions:toLines(s.openQuestions)});}
  function cancelEditStory(){setEditingStoryId(null);setStoryDraft(null);}
  function confirmEditStory(id){saveStoryEdit(id,{title:storyDraft.title,storyText:storyDraft.storyText,acceptanceCriteria:fromLines(storyDraft.acceptanceCriteria),assumptions:fromLines(storyDraft.assumptions),dependencies:fromLines(storyDraft.dependencies),openQuestions:fromLines(storyDraft.openQuestions)});setEditingStoryId(null);setStoryDraft(null);}

  function loadFromHistory(entry){
    setRequestText(entry.requestText||'');setTags(entry.tags||[]);setError('');setClassification(entry.classification||null);
    setEpic(entry.epic||null);setStandaloneInitiative(entry.standaloneInitiative||null);setStandaloneFeatures(entry.standaloneFeatures||null);setStandaloneStories(entry.standaloneStories||null);
    setActiveInitiativeId(null);setActiveFeatureId(null);setExpandedStory({});setCurrentHistoryId(entry.id);
    if(entry.productType)setProductType(entry.productType);
    if(entry.epic)setView('mapView');
    else if(entry.standaloneInitiative||entry.standaloneFeatures)setView('initiativeView');
    else if(entry.standaloneStories)setView('featureView');
    else setView('classification');
    setHistoryOpen(false);
  }
  async function clearHistory(){await persistHistory([]);}

  function currentFlow(){
    if(epic&&activeInitiativeId&&activeFeatureId){const init=epic.initiatives.find(i=>i.id===activeInitiativeId);return init?.features.find(f=>f.id===activeFeatureId)?.flow||null;}
    if((standaloneInitiative||standaloneFeatures)&&activeFeatureId)return currentFeatureList().find(f=>f.id===activeFeatureId)?.flow||null;
    if(standaloneStories)return standaloneStories.flow||null;
    return null;
  }
  function setCurrentFlowData(flow){
    if(epic&&activeInitiativeId&&activeFeatureId)setEpic(p=>({...p,initiatives:p.initiatives.map(i=>i.id===activeInitiativeId?{...i,features:i.features.map(f=>f.id===activeFeatureId?{...f,flow}:f)}:i)}));
    else if((standaloneInitiative||standaloneFeatures)&&activeFeatureId){const setter=standaloneInitiative?setStandaloneInitiative:setStandaloneFeatures;setter(p=>({...p,features:p.features.map(f=>f.id===activeFeatureId?{...f,flow}:f)}));}
    else if(standaloneStories)setStandaloneStories(p=>({...p,flow}));
  }
  function isFlowStale(){const flow=currentFlow();if(!flow)return false;return JSON.stringify(currentStories())!==flow.storiesSnapshot;}

  async function generateFlow(){
    const stories=currentStories();if(!stories||stories.length===0)return;
    const title=standaloneStories?standaloneStories.title:currentFeatureTitle();
    setLoading('flow');setError('');
    try{
      const ctx=stories.map(s=>`- ${s.title}: ${s.storyText}\n  AC: ${(s.acceptanceCriteria||[]).join('; ')}`).join('\n');
      const r=await callClaude(flowDiagramPrompt(domainCtx()),`Feature: ${title}\n\nUser stories:\n${ctx}${tagContext()}`,4096);
      setCurrentFlowData({steps:r.steps||[],businessRules:r.businessRules||[],dataRules:r.dataRules||[],generatedAt:new Date().toISOString(),storiesSnapshot:JSON.stringify(stories)});
    }catch(e){setError(errorMessage(e));}finally{setLoading('');}
  }

  function flowGeometry(flow){
    const steps=flow.steps||[];const rowH=130,boxW=280,boxH=76,cx=160;
    const idIndex={};steps.forEach((s,i)=>{idIndex[s.id]=i;});
    const nodes=steps.map((s,i)=>({...s,idx:i,x:cx-boxW/2,y:i*rowH+30,w:boxW,h:boxH,midX:cx,midY:i*rowH+30+boxH/2}));
    const edges=[];
    steps.forEach((s,i)=>{
      if(s.type==='decision'&&s.branches?.length){let cs=0;s.branches.forEach(b=>{const ti=idIndex[b.toStepId];if(ti===undefined)return;if(ti===i+1)edges.push({type:'straight',from:i,to:ti,label:b.label});else{edges.push({type:'curve',from:i,to:ti,label:b.label,side:cs%2===0?1:-1});cs++;}});}
      else if(i<steps.length-1)edges.push({type:'straight',from:i,to:i+1,label:null});
    });
    return{nodes,edges,totalHeight:steps.length*rowH+50,boxW,boxH,cx};
  }

  function buildExportPayload(){return{requestText,classification,epic,standaloneInitiative,standaloneFeatures,standaloneStories,exportedAt:new Date().toISOString()};}

  async function tryDownload(text,filename,mimeType){
    try{const blob=new Blob([text],{type:mimeType});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);return true;}
    catch(e){return false;}
  }

  function exportMarkdown(){
    try{
      const p=buildExportPayload();
      let md=`# Backlog Export\n\n**Request:** ${p.requestText}\n\n`;
      if(p.classification){const cl=typeof p.classification==='string'?{classification:p.classification}:p.classification;md+=`**Classification:** ${cl.classification||''} (${cl.confidence||''} confidence)\n\n`;if(cl.businessNeed)md+=`**Business Need:** ${cl.businessNeed}\n\n`;}
      md+=`*Exported: ${new Date(p.exportedAt).toLocaleString()}*\n\n---\n\n`;
      const renderFlow=flow=>{if(!flow)return'';let s=`### Process Flow\n\n`;(flow.steps||[]).forEach((step,i)=>{s+=`${i+1}. **[${(step.type||'').toUpperCase()}]** ${step.label} \u2014 ${step.description}\n`;(step.branches||[]).forEach(b=>{s+=`   - Branch: *${b.label}* \u2192 Step ${b.toStepId}\n`;});});if(flow.businessRules?.length)s+=`\n**Business Rules:**\n${flow.businessRules.map(r=>`- ${r}`).join('\n')}\n`;if(flow.dataRules?.length)s+=`\n**Data Rules:**\n${flow.dataRules.map(r=>`- ${r}`).join('\n')}\n`;return s+'\n';};
      const renderStory=(story,idx)=>{let s=`#### Story ${idx+1}: ${story.title||'Untitled'}\n\n${story.storyText||''}\n\n`;if(story.status)s+=`*Status: ${story.status}*\n\n`;if(story.acceptanceCriteria?.length)s+=`**Acceptance Criteria:**\n${story.acceptanceCriteria.map(c=>`- ${c}`).join('\n')}\n\n`;if(story.assumptions?.length)s+=`**Assumptions:**\n${story.assumptions.map(c=>`- ${c}`).join('\n')}\n\n`;if(story.dependencies?.length)s+=`**Dependencies:**\n${story.dependencies.map(c=>`- ${c}`).join('\n')}\n\n`;if(story.openQuestions?.length)s+=`**Open Questions:**\n${story.openQuestions.map(c=>`- ${c}`).join('\n')}\n\n`;return s;};
      const renderFeature=(feat,fi)=>{let s=`### Feature ${fi+1}: ${feat.title||'Untitled'}\n\n`;if(feat.status)s+=`*Status: ${feat.status}*\n\n`;if(feat.description)s+=`${feat.description}\n\n`;if(feat.businessValue)s+=`**Business Value:** ${feat.businessValue}\n\n`;if(feat.stories?.length){s+=`**User Stories:**\n\n`;feat.stories.forEach((story,si)=>{s+=renderStory(story,si);});}if(feat.flow)s+=renderFlow(feat.flow);return s;};
      if(p.epic){md+=`## Epic\n\n${p.epic.title}\n\n`;if(p.epic.businessNeed)md+=`**Business Need:** ${p.epic.businessNeed}\n\n`;(p.epic.initiatives||[]).forEach((init,ii)=>{md+=`## Initiative ${ii+1}: ${init.title}\n\n`;if(init.businessNeed)md+=`**Business Need:** ${init.businessNeed}\n\n`;(init.features||[]).forEach((feat,fi)=>{md+=renderFeature(feat,fi);});md+='\n---\n\n';});}
      else if(p.standaloneInitiative){md+=`## Initiative: ${p.standaloneInitiative.title}\n\n`;(p.standaloneInitiative.features||[]).forEach((feat,fi)=>{md+=renderFeature(feat,fi);});}
      else if(p.standaloneFeatures){md+=`## Feature Group: ${p.standaloneFeatures.title}\n\n`;(p.standaloneFeatures.features||[]).forEach((feat,fi)=>{md+=renderFeature(feat,fi);});}
      else if(p.standaloneStories){md+=`## Feature: ${p.standaloneStories.title}\n\n`;(p.standaloneStories.stories||[]).forEach((story,si)=>{md+=renderStory(story,si);});if(p.standaloneStories.flow)md+=renderFlow(p.standaloneStories.flow);}
      const filename=`prescope-export-${Date.now()}.md`;
      tryDownload(md,filename,'text/markdown').then(ok=>{if(!ok)setExportContent({text:md,filename});});
    }catch(e){setError(`Export failed: ${e.message}`);}
  }

  async function exportWord(){
    if(!IS_DEPLOYED){setError('Word export requires the deployed app. Use Markdown export here, then paste into Word.');return;}
    setLoading('export');setError('');
    try{const res=await fetch('/api/export-docx',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(buildExportPayload())});if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(err.error||`Server error ${res.status}`);}const ab=await res.arrayBuffer();const ok=await tryDownload(new Uint8Array(ab),`prescope-export-${Date.now()}.docx`,'application/vnd.openxmlformats-officedocument.wordprocessingml.document');if(!ok)setError('Download blocked. Use Markdown export instead.');}
    catch(e){setError(`Word export: ${e.message}`);}finally{setLoading('');}
  }

  function freshFrameworkContent(){const c={};THINKING_FRAMEWORK.domains.forEach(d=>{c[d.id]={};d.fields.forEach(f=>{c[d.id][f.key]='';});});return c;}
  function freshToolkitContent(){const c={};BA_TOOLKIT.sheets.forEach(s=>{c[s.id]=[...s.sampleRows.map(r=>[...r]),...Array.from({length:s.emptyRows},()=>Array(s.columns.length).fill(''))];});return c;}
  async function saveResourceCopies(next){setResourceCopies(next);try{await window.storage.set(RESOURCES_KEY,JSON.stringify(next),false);}catch(e){}}
  function createResourceCopy(templateId,name){
    const template=templateId===THINKING_FRAMEWORK.id?THINKING_FRAMEWORK:BA_TOOLKIT;
    const content=templateId===THINKING_FRAMEWORK.id?freshFrameworkContent():freshToolkitContent();
    const copy={id:uid('res'),templateId,name,content,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    saveResourceCopies([copy,...resourceCopies]);
    setActiveResource({type:'copy',template,copyId:copy.id,content,name});setResourceActiveSheet(0);setNamingCopy(null);
  }
  function updateCopyContent(copyId,content){const next=resourceCopies.map(c=>c.id===copyId?{...c,content,updatedAt:new Date().toISOString()}:c);saveResourceCopies(next);setActiveResource(prev=>prev?{...prev,content}:prev);}
  function deleteResourceCopy(copyId){const next=resourceCopies.filter(c=>c.id!==copyId);saveResourceCopies(next);if(activeResource?.copyId===copyId)setActiveResource(null);}
  function downloadFrameworkCopy(content,name){
    let md=`# ${name}\n\n*Based on: Agile BA Thinking Framework*\n*Saved: ${new Date().toLocaleString()}*\n\n---\n\n`;
    THINKING_FRAMEWORK.domains.forEach((d,i)=>{md+=`## Domain ${i+1} \u2014 ${d.name}\n\n*${d.goal}*\n\n`;d.fields.forEach(f=>{md+=`**${f.label}:**\n${content?.[d.id]?.[f.key]||'(not filled in)'}\n\n`;});md+='---\n\n';});
    tryDownload(md,`${name.replace(/\s+/g,'-')}.md`,'text/markdown').then(ok=>{if(!ok)setExportContent({text:md,filename:`${name}.md`});});
  }
  function downloadToolkitCopy(content,name){
    if(!IS_DEPLOYED){setExportContent({text:`# ${name}\n\nToolkit export requires the deployed app. Your data is saved and accessible when you deploy.`,filename:`${name}.txt`});return;}
    let csv=`# ${name} \u2014 Agile BA Toolkit\n\n`;
    BA_TOOLKIT.sheets.forEach(s=>{csv+=`## ${s.name}\n${s.columns.join('\t')}\n`;const rows=content?.[s.id]||s.sampleRows;rows.forEach(r=>{csv+=r.join('\t')+'\n';});csv+='\n';});
    tryDownload(csv,`${name.replace(/\s+/g,'-')}.txt`,'text/plain').then(ok=>{if(!ok)setExportContent({text:csv,filename:`${name}.txt`});});
  }
  function computeWsjfRow(row){const[,bv,tc,rr,,js]=row;if(!js||isNaN(Number(js))||Number(js)===0)return'';const score=(Number(bv||0)+Number(tc||0)+Number(rr||0))/Number(js);return isNaN(score)?'':score.toFixed(2);}
  function computeWsjfRanks(rows){const scores=rows.map((r,i)=>({i,score:parseFloat(computeWsjfRow(r))||0})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);const m={};scores.forEach((x,rank)=>{m[x.i]=rank+1;});return m;}
  function storyToMarkdown(s){let md=`### ${s.title||'Untitled'}\n\n${s.storyText||''}\n\n`;if(s.acceptanceCriteria?.length)md+=`**Acceptance Criteria**\n${s.acceptanceCriteria.map(x=>`- ${x}`).join('\n')}\n\n`;if(s.assumptions?.length)md+=`**Assumptions**\n${s.assumptions.map(x=>`- ${x}`).join('\n')}\n\n`;if(s.dependencies?.length)md+=`**Dependencies**\n${s.dependencies.map(x=>`- ${x}`).join('\n')}\n\n`;if(s.openQuestions?.length)md+=`**Open Questions**\n${s.openQuestions.map(x=>`- ${x}`).join('\n')}\n\n`;return md;}
  async function copyStory(s,key){try{await navigator.clipboard.writeText(storyToMarkdown(s));setCopiedKey(key);setTimeout(()=>setCopiedKey(''),1500);}catch(e){setError('Could not copy to clipboard.');}}

  const CT={WebkitTouchCallout:'none',WebkitUserSelect:'none',touchAction:'manipulation'};

  return (
    <div className="min-h-full w-full bg-slate-950 text-slate-100" style={{fontFamily:"'Inter',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .mono{font-family:'JetBrains Mono',monospace;}
        ::-webkit-scrollbar{width:8px;}::-webkit-scrollbar-thumb{background:#334155;border-radius:4px;}
        @keyframes loadbar{0%{transform:translateX(-100%)}50%{transform:translateX(10%)}100%{transform:translateX(100%)}}
        .progress-bar-track{position:fixed;top:0;left:0;right:0;height:3px;background:#1e293b;z-index:60;overflow:hidden;}
        .progress-bar-fill{position:absolute;top:0;bottom:0;width:40%;background:linear-gradient(90deg,transparent,#2dd4bf,transparent);animation:loadbar 1.4s ease-in-out infinite;}
      `}</style>

      {loading&&<div className="progress-bar-track"><div className="progress-bar-fill"/></div>}

      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-slate-50">Prescope™</h1>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <p className="text-sm text-slate-400">Structure work. Start building. \u2014 step by step.</p>
              {domain()&&<button onClick={()=>setView('productSelect')} className={`mono text-[10px] px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${domain().color.pill} hover:opacity-80`}>{domain().icon} {domain().label} <span className="text-slate-500">\u00b7 change</span></button>}
            </div>
          </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {(requestText||classification)&&<button onClick={()=>setConfirmNewRequest(true)} className="flex items-center gap-1.5 text-sm text-slate-300 border border-slate-700 rounded-lg px-3 py-2 hover:border-red-500 hover:text-red-300 transition-colors"><Plus size={15}/> New</button>}
            {hasExportableContent&&(
              <div className="relative">
                <button onClick={()=>setExportMenuOpen(o=>!o)} className="flex items-center gap-1.5 text-sm text-slate-300 border border-slate-700 rounded-lg px-3 py-2 hover:border-emerald-500 hover:text-emerald-300 transition-colors"><Download size={15}/> Export</button>
                {exportMenuOpen&&(
                  <div className="absolute right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-30 overflow-hidden w-56">
                    <button onClick={()=>{exportMarkdown();setExportMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 border-b border-slate-800 text-left">
                      <Download size={14} className="text-teal-400 flex-shrink-0"/><div><div className="font-medium">Markdown (.md)</div><div className="text-xs text-slate-500">Copy to clipboard \u2014 works everywhere</div></div>
                    </button>
                    {IS_DEPLOYED
                      ?<button onClick={()=>{exportWord();setExportMenuOpen(false);}} disabled={loading==='export'} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 text-left disabled:opacity-50">
                        {loading==='export'?<Loader2 size={14} className="animate-spin text-emerald-400 flex-shrink-0"/>:<Download size={14} className="text-emerald-400 flex-shrink-0"/>}
                        <div><div className="font-medium">Word (.docx)</div><div className="text-xs text-slate-500">Formatted document download</div></div>
                      </button>
                      :<div className="flex items-start gap-3 px-4 py-3 opacity-50 cursor-not-allowed">
                        <Download size={14} className="text-slate-600 flex-shrink-0 mt-0.5"/><div><div className="text-sm font-medium text-slate-500">Word (.docx)</div><div className="text-xs text-slate-600">Available on the deployed app</div></div>
                      </div>
                    }
                  </div>
                )}
              </div>
            )}
            <button onClick={()=>{setShowResources(true);setActiveResource(null);}} className="flex items-center gap-1.5 text-sm text-slate-300 border border-slate-700 rounded-lg px-3 py-2 hover:border-violet-500 hover:text-violet-300 transition-colors"><BookOpen size={15}/> Resources</button>
            <button onClick={()=>setHistoryOpen(true)} className="flex items-center gap-1.5 text-sm text-slate-300 border border-slate-700 rounded-lg px-3 py-2 hover:border-teal-500 hover:text-teal-300 transition-colors"><History size={15}/> History</button>
            {authStatus==='authed' && user
              ? <UserMenu user={user} onSignOut={onSignOut}/>
              : <button onClick={onSignIn} className="flex items-center gap-1.5 text-xs font-medium bg-teal-500 hover:bg-teal-400 text-slate-950 px-3 py-2 rounded-lg transition-colors">Sign in</button>
            }
            {authStatus==='guest' && IS_DEPLOYED && generationsRemaining <= FREE_LIMIT && (
              <div className="mono text-[10px] px-2 py-1 rounded-full border border-slate-700 text-slate-500">
                {generationsRemaining}/{FREE_LIMIT} free
              </div>
            )}
          </div>
        </div>

        {loading&&<div className="flex items-center gap-3 bg-teal-950 border border-teal-800 rounded-xl px-4 py-3 mb-6"><Loader2 size={18} className="animate-spin text-teal-400 flex-shrink-0"/><div className="flex-1"><div className="text-sm text-teal-200">{loadingMessage()}</div><div className="text-xs text-teal-500 mono mt-0.5">{elapsedSeconds}s elapsed</div></div></div>}

        {confirmNewRequest&&<div className="flex items-center justify-between gap-3 bg-red-950 border border-red-800 rounded-xl px-4 py-3 mb-6 flex-wrap"><span className="text-sm text-red-200">Clear the current request and all generated content?</span><div className="flex gap-2 flex-shrink-0"><button onClick={()=>{resetAll();setConfirmNewRequest(false);}} className="text-xs font-medium text-red-100 bg-red-800 hover:bg-red-700 px-3 py-1.5 rounded-lg">Clear & start new</button><button onClick={()=>setConfirmNewRequest(false)} className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5">Cancel</button></div></div>}

        {(epic||standaloneInitiative||standaloneFeatures||standaloneStories)&&(
          <div className="flex items-center gap-2 mb-4 text-xs flex-wrap">
            <button onClick={()=>setView('classification')} className="mono px-2.5 py-1 rounded-md border border-slate-700 text-slate-400 hover:text-teal-300 hover:border-teal-500">Classification</button>
            {epic&&<><ChevronRight size={12} className="text-slate-600"/><button onClick={backToEpic} className={`mono px-2.5 py-1 rounded-md border ${view==='epicView'?'border-teal-500 text-teal-300':'border-slate-700 text-slate-400 hover:text-teal-300 hover:border-teal-500'}`}>Epic</button></>}
            {(activeInitiativeId||standaloneInitiative||standaloneFeatures)&&<><ChevronRight size={12} className="text-slate-600"/><button onClick={backToInitiative} className={`mono px-2.5 py-1 rounded-md border ${view==='initiativeView'?'border-teal-500 text-teal-300':'border-slate-700 text-slate-400 hover:text-teal-300 hover:border-teal-500'}`}>Features</button></>}
            {(activeFeatureId||standaloneStories)&&<><ChevronRight size={12} className="text-slate-600"/><button onClick={()=>setView('featureView')} className={`mono px-2.5 py-1 rounded-md border ${view==='featureView'?'border-violet-500 text-violet-200':'border-violet-700 text-violet-300 hover:border-violet-500'}`}>Stories</button></>}
            {epic&&<button onClick={()=>setView('mapView')} className="ml-auto flex items-center gap-1 mono px-2.5 py-1 rounded-md border border-slate-700 text-slate-400 hover:text-violet-300 hover:border-violet-500"><MapIcon size={12}/> Map</button>}
          </div>
        )}

        {/* PRODUCT SELECT */}
        {view==='productSelect'&&(
          <div>
            <div className="text-center mb-8 mt-2">
              <h2 className="text-lg font-semibold text-slate-100 mb-2">What are you building for?</h2>
              <p className="text-sm text-slate-400">Pick your domain so the AI uses the right vocabulary, personas, and context.</p>
            </div>
            <div className="space-y-3">
              {Object.values(DOMAIN_CONFIG).map(d=>(
                <button key={d.id} onClick={()=>{setProductType(d.id);setTags([]);setView('input');}} className={`w-full text-left bg-slate-900 border rounded-xl p-5 transition-all select-none ${d.color.glow} hover:bg-slate-800/50`} style={CT}>
                  <div className="flex items-center gap-3 mb-2"><span className="text-2xl">{d.icon}</span><div className="flex-1"><div className="text-base font-semibold text-slate-100">{d.label}</div><div className="text-xs text-slate-500">{d.tagline}</div></div><ChevronRight size={18} className="text-slate-600 flex-shrink-0"/></div>
                  <div className="flex flex-wrap gap-1.5 mt-3">{d.tags.slice(0,6).map(t=><span key={t} className={`mono text-[10px] px-2 py-0.5 rounded-full border ${d.color.pill} opacity-70`}>{t}</span>)}{d.tags.length>6&&<span className="mono text-[10px] text-slate-600">+{d.tags.length-6} more</span>}</div>
                </button>
              ))}
            </div>
            {history.length>0&&<button onClick={()=>setHistoryOpen(true)} className="w-full text-center text-xs text-slate-500 hover:text-teal-300 mt-6">Or resume a previous session from History</button>}
          </div>
        )}

        {/* INPUT VIEW */}
        {view==='input'&&(
          <div>
            {resumePrompt&&<div className="flex items-center justify-between gap-3 bg-teal-950 border border-teal-700 rounded-xl px-4 py-3 mb-6 flex-wrap"><div className="min-w-0"><div className="text-xs text-teal-400 mb-0.5">You were working on something \u2014 want to continue?</div><div className="text-sm text-slate-200 truncate">{resumePrompt.requestText}</div></div><div className="flex gap-2 flex-shrink-0"><button onClick={()=>{loadFromHistory(resumePrompt);setResumePrompt(null);}} className="text-xs font-medium bg-teal-500 hover:bg-teal-400 text-slate-950 px-3 py-1.5 rounded-lg">Resume</button><button onClick={()=>setResumePrompt(null)} className="text-xs text-slate-500 hover:text-slate-300 px-2">Dismiss</button></div></div>}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
              <label className="text-xs uppercase tracking-wide text-slate-500 mb-2 block">What do you need to build?</label>
              <textarea value={requestText} onChange={e=>setRequestText(e.target.value)} placeholder={domain()?.examples[0]?.text||'Describe your business need or request\u2026'} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" rows={4}/>
              <div className="mt-4"><div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Technical dependencies (optional)</div><div className="flex flex-wrap gap-2">{currentTags().map(tag=><button key={tag} onClick={()=>toggleTag(tag)} className={`mono text-xs px-2.5 py-1 rounded-md border transition-colors ${tags.includes(tag)?'bg-sky-950 border-sky-500 text-sky-300':'border-slate-700 text-slate-400 hover:border-slate-500'}`}>{tag}</button>)}</div></div>
              {error&&<div className="mt-4 flex items-start gap-2 text-sm text-amber-300 bg-amber-950 border border-amber-700 rounded-lg p-3"><AlertTriangle size={16} className="mt-0.5 flex-shrink-0"/><span>{error}</span></div>}
              <div className="mt-4"><button onClick={classify} disabled={!!loading} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-medium text-sm px-4 py-2 rounded-lg transition-colors">{loading==='classify'?<Loader2 size={16} className="animate-spin"/>:<Sparkles size={16}/>}{loading==='classify'?'Analyzing\u2026':'Analyze request'}</button></div>
            </div>
            {!classification&&(
              <div>
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-3">{domain()?`Example ${domain().label} requests`:'Try an example'}</div>
                  <div className="space-y-2">
                    {(domain()?.examples||DOMAIN_CONFIG.saas.examples).map(ex=>(
                      <button key={ex.label} onClick={()=>setRequestText(ex.text)} className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl p-3 transition-colors group" style={CT}>
                        <div className="flex items-center gap-2 mb-1"><span className={`mono text-[10px] px-2 py-0.5 rounded-full border ${ex.label==='Epic'?'border-violet-700 text-violet-300 bg-violet-950':ex.label==='Discovery'?'border-amber-700 text-amber-300 bg-amber-950':'border-sky-700 text-sky-300 bg-sky-950'}`}>{ex.label}</span><span className="text-xs text-slate-500 group-hover:text-slate-400">tap to use</span></div>
                        <p className="text-xs text-slate-400 line-clamp-2">{ex.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-3">How it works</div>
                  <div className="space-y-2.5">
                    {[{step:'1',label:'Describe your need',desc:'Type anything \u2014 a vague idea, a scoped feature, or a full lifecycle request.'},{step:'2',label:'See the classification',desc:'Epic, Initiative, Feature, User Story, or Discovery Needed \u2014 with reasoning, before anything is generated.'},{step:'3',label:'Decompose step by step',desc:'Epics break into initiatives \u2192 features \u2192 stories. You choose what to expand next.'},{step:'4',label:'Edit, approve, export',desc:'Each item has a status, can be edited or added to manually, and exports to Markdown or Word.'}].map(h=>(
                      <div key={h.step} className="flex gap-3"><div className="mono text-xs w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center flex-shrink-0">{h.step}</div><div><div className="text-xs font-medium text-slate-300">{h.label}</div><div className="text-xs text-slate-500">{h.desc}</div></div></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CLASSIFICATION VIEW */}
        {view==='classification'&&classification&&(
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-sm text-slate-400 mb-3">{requestText}</div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="mono text-xs px-3 py-1.5 rounded-full bg-violet-950 border border-violet-700 text-violet-300">{classification.classification}</span>
                <span className={`mono text-xs px-2.5 py-1 rounded-full border ${classification.confidence==='High'?'border-emerald-600 text-emerald-300':classification.confidence==='Medium'?'border-amber-600 text-amber-300':'border-slate-600 text-slate-400'}`}>{classification.confidence} confidence</span>
              </div>
              <p className="text-sm text-slate-300 mb-2"><span className="text-slate-500">Why: </span>{classification.reason}</p>
              {classification.businessNeed&&<p className="text-sm text-slate-300 mb-2"><span className="text-slate-500">Business need: </span>{classification.businessNeed}</p>}
              <p className="text-sm text-teal-300 mb-3">{classification.recommendedNextStep}</p>
              {classification.classification!=='Discovery Needed'&&!epic&&!standaloneInitiative&&!standaloneFeatures&&!standaloneStories&&(
                <button onClick={retryGeneration} disabled={loading==='generating'} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-medium text-sm px-4 py-2 rounded-lg transition-colors">
                  {loading==='generating'?<Loader2 size={16} className="animate-spin"/>:<Sparkles size={16}/>}
                  {loading==='generating'?'Generating\u2026':classification.classification==='Epic'?'Generate initiatives':classification.classification==='User Story'?'Validate & refine story':classification.classification==='Feature'?'Generate user stories':'Generate features'}
                </button>
              )}
            </div>
            {classification.classification==='Discovery Needed'&&(
              <div className="bg-amber-950 border border-amber-700 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-300 mb-3"><HelpCircle size={16}/><span className="text-sm font-medium">A few things to clarify first</span></div>
                <ul className="space-y-2 mb-4">{(classification.discoveryQuestions||[]).map((q,i)=><li key={i} className="text-sm text-amber-100 flex gap-2"><span className="text-amber-500">{i+1}.</span><span>{q}</span></li>)}</ul>
                <textarea value={requestText} onChange={e=>setRequestText(e.target.value)} className="w-full bg-slate-950 border border-amber-800 rounded-lg p-3 text-sm text-slate-100 resize-none mb-3" rows={4}/>
                <button onClick={classify} disabled={loading==='classify'} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 text-slate-950 font-medium text-sm px-4 py-2 rounded-lg">{loading==='classify'?<Loader2 size={16} className="animate-spin"/>:<Sparkles size={16}/>} Re-analyze</button>
              </div>
            )}
            {loading&&loading!=='classify'&&<div className="flex items-center gap-2 text-sm text-slate-400"><Loader2 size={16} className="animate-spin"/> Generating\u2026</div>}
            {error&&<div className="bg-amber-950 border border-amber-700 rounded-lg p-3"><div className="flex items-start gap-2 text-sm text-amber-300 mb-3"><AlertTriangle size={16} className="mt-0.5 flex-shrink-0"/><span>{error}</span></div><button onClick={retryGeneration} disabled={loading==='generating'} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 text-slate-950 font-medium text-xs px-3 py-1.5 rounded-lg">{loading==='generating'?<Loader2 size={14} className="animate-spin"/>:<Sparkles size={14}/>} Retry</button></div>}
          </div>
        )}

        {/* EPIC VIEW */}
        {view==='epicView'&&epic&&(
          <div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4"><div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Epic</div><p className="text-sm text-slate-200">{epic.title}</p>{epic.businessNeed&&<p className="text-xs text-slate-500 mt-1">{epic.businessNeed}</p>}</div>
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Select an initiative to break down into features</div>
            <div className="space-y-3">
              {epic.initiatives.map(init=>(
                <button key={init.id} onClick={()=>selectInitiative(init.id)} disabled={loading==='features'} className="w-full text-left bg-slate-900 border border-slate-800 hover:border-teal-500 rounded-xl p-4 transition-colors select-none" style={CT}>
                  <div className="flex items-start justify-between gap-3 mb-1"><span className="text-sm font-medium text-slate-100">{init.title}</span>{init.features?<Check size={15} className="text-teal-400 flex-shrink-0 mt-0.5"/>:<ChevronRight size={15} className="text-slate-600 flex-shrink-0 mt-0.5"/>}</div>
                  <p className="text-xs text-slate-400 mb-1">{init.description}</p><p className="text-xs text-slate-500"><span className="text-slate-600">Business need: </span>{init.businessNeed}</p>
                </button>
              ))}
            </div>
            {loading==='features'&&<div className="flex items-center gap-2 text-sm text-slate-400 mt-3"><Loader2 size={16} className="animate-spin"/> Generating features\u2026</div>}
            {error&&<div className="mt-3 flex items-start gap-2 text-sm text-amber-300 bg-amber-950 border border-amber-700 rounded-lg p-3"><AlertTriangle size={16} className="mt-0.5 flex-shrink-0"/><span>{error}</span></div>}
          </div>
        )}

        {/* INITIATIVE VIEW */}
        {view==='initiativeView'&&(
          <div>
            {epic&&<button onClick={backToEpic} className="flex items-center gap-1 text-xs text-slate-400 hover:text-teal-300 mb-4"><ArrowLeft size={13}/> Back to initiatives</button>}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{epic?'Initiative':standaloneInitiative?'Initiative':'Feature Group'}</div>
              <p className="text-sm text-slate-200">{epic?epic.initiatives.find(i=>i.id===activeInitiativeId)?.title:(standaloneInitiative||standaloneFeatures)?.title}</p>
            </div>
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Select a feature to generate user stories</div>
            <div className="space-y-3">
              {currentFeatureList().map(feat=>(
                <div key={feat.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  {editingFeatureId===feat.id?(
                    <div className="p-4 space-y-2">
                      <input value={featureDraft.title} onChange={e=>setFeatureDraft(d=>({...d,title:e.target.value}))} placeholder="Title" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"/>
                      <textarea value={featureDraft.description} onChange={e=>setFeatureDraft(d=>({...d,description:e.target.value}))} placeholder="Description" rows={2} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 resize-none"/>
                      <textarea value={featureDraft.businessValue} onChange={e=>setFeatureDraft(d=>({...d,businessValue:e.target.value}))} placeholder="Business value" rows={2} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 resize-none"/>
                      <div className="flex gap-2 pt-1"><button onClick={()=>confirmEditFeature(feat.id)} className="flex items-center gap-1 text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 font-medium px-3 py-1.5 rounded-lg"><Save size={13}/> Save</button><button onClick={cancelEditFeature} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"><XCircle size={13}/> Cancel</button></div>
                    </div>
                  ):(
                    <>
                      <div className="relative">
                        <button onClick={()=>selectFeature(feat.id)} disabled={loading==='stories'} className="w-full text-left p-4 pr-20 hover:bg-slate-800/40 transition-colors select-none" style={CT}>
                          <div className="flex items-center gap-2 mb-1 flex-wrap"><span className="text-sm font-medium text-slate-100">{feat.title}</span><StatusBadge status={feat.status||'Generated'} onChange={s=>updateFeatureStatus(feat.id,s)}/>{!feat.stories&&<ChevronRight size={15} className="text-slate-600 flex-shrink-0 ml-auto"/>}</div>
                          <p className="text-xs text-slate-400 mb-1">{feat.description}</p>{feat.businessValue&&<p className="text-xs text-slate-500"><span className="text-slate-600">Business value: </span>{feat.businessValue}</p>}
                        </button>
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <button onClick={e=>{e.stopPropagation();startEditFeature(feat);}} className="p-1.5 rounded-md text-slate-500 hover:text-teal-300 hover:bg-slate-800"><Pencil size={14}/></button>
                          <button onClick={e=>{e.stopPropagation();setConfirmDelete({type:'feature',id:feat.id});}} className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-800"><Trash2 size={14}/></button>
                        </div>
                      </div>
                      {feat.stories&&<button onClick={()=>{setActiveFeatureId(feat.id);setView('featureView');}} className="w-full flex items-center justify-center gap-2 text-xs font-medium text-teal-300 bg-teal-950 border-t border-teal-800 py-2.5 hover:bg-teal-900 transition-colors select-none" style={CT}><Check size={13}/> Stories ({feat.stories.length}) \u2014 tap to view</button>}
                      {confirmDelete?.type==='feature'&&confirmDelete.id===feat.id&&<div className="flex items-center justify-between gap-2 bg-red-950 border-t border-red-800 px-4 py-2.5"><span className="text-xs text-red-300">Remove this feature{feat.stories?' and its stories':''}?</span><div className="flex gap-2"><button onClick={()=>{removeFeature(feat.id);setConfirmDelete(null);if(activeFeatureId===feat.id)setActiveFeatureId(null);}} className="text-xs font-medium text-red-200 bg-red-900 hover:bg-red-800 px-2.5 py-1 rounded-md">Remove</button><button onClick={()=>setConfirmDelete(null)} className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1">Cancel</button></div></div>}
                    </>
                  )}
                </div>
              ))}
              {addingFeature?(
                <div className="bg-slate-900 border border-teal-700 rounded-xl p-4 space-y-2">
                  <div className="text-xs uppercase tracking-wide text-teal-400 mb-2">New Feature</div>
                  <input value={newFeatureDraft.title} onChange={e=>setNewFeatureDraft(d=>({...d,title:e.target.value}))} placeholder="Feature title *" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"/>
                  <textarea value={newFeatureDraft.description} onChange={e=>setNewFeatureDraft(d=>({...d,description:e.target.value}))} placeholder="Description" rows={2} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 resize-none"/>
                  <textarea value={newFeatureDraft.businessValue} onChange={e=>setNewFeatureDraft(d=>({...d,businessValue:e.target.value}))} placeholder="Business value" rows={2} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 resize-none"/>
                  <div className="flex gap-2 pt-1"><button onClick={()=>{if(newFeatureDraft.title.trim()){addFeature(newFeatureDraft);setNewFeatureDraft({title:'',description:'',businessValue:''});setAddingFeature(false);}}} className="flex items-center gap-1 text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 font-medium px-3 py-1.5 rounded-lg"><Save size={13}/> Add feature</button><button onClick={()=>{setAddingFeature(false);setNewFeatureDraft({title:'',description:'',businessValue:''});}} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"><XCircle size={13}/> Cancel</button></div>
                </div>
              ):<button onClick={()=>setAddingFeature(true)} className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-teal-300 border border-dashed border-slate-700 hover:border-teal-700 rounded-xl py-2.5 transition-colors"><Plus size={14}/> Add feature manually</button>}
            </div>
            {loading==='stories'&&<div className="flex items-center gap-2 text-sm text-slate-400 mt-3"><Loader2 size={16} className="animate-spin"/> Generating stories\u2026</div>}
            {error&&<div className="mt-3 flex items-start gap-2 text-sm text-amber-300 bg-amber-950 border border-amber-700 rounded-lg p-3"><AlertTriangle size={16} className="mt-0.5 flex-shrink-0"/><span>{error}</span></div>}
          </div>
        )}

        {/* FEATURE / STORY VIEW */}
        {view==='featureView'&&(
          <div>
            {!standaloneStories&&<button onClick={backToInitiative} className="flex items-center gap-1 text-xs text-slate-400 hover:text-teal-300 mb-4"><ArrowLeft size={13}/> Back to features</button>}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4"><div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{standaloneStories?(classification?.classification==='User Story'?'Refined User Story':'Feature'):'Feature'}</div><p className="text-sm text-slate-200">{standaloneStories?standaloneStories.title:currentFeatureTitle()}</p></div>
            {currentStories().length>0&&(
              <div className="mb-5">
                {!currentFlow()
                  ?<button onClick={generateFlow} disabled={loading==='flow'} className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors">{loading==='flow'?<Loader2 size={16} className="animate-spin"/>:<GitBranch size={16}/>}{loading==='flow'?'Generating process flow\u2026':'Generate process flow diagram'}</button>
                  :<div className="bg-slate-900 border border-violet-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-violet-900"><div className="flex items-center gap-2 text-sm font-medium text-violet-300"><GitBranch size={15}/> Process Flow, Business & Data Rules</div><button onClick={generateFlow} disabled={loading==='flow'} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-300">{loading==='flow'?<Loader2 size={13} className="animate-spin"/>:<RefreshCw size={13}/>} Regenerate</button></div>
                    {isFlowStale()&&<div className="flex items-center gap-2 bg-amber-950 border-b border-amber-800 px-4 py-2.5 text-xs text-amber-300"><AlertTriangle size={14} className="flex-shrink-0"/><span className="flex-1">Stories changed since this was generated \u2014 diagram may be out of date.</span><button onClick={generateFlow} disabled={loading==='flow'} className="flex items-center gap-1 font-medium bg-amber-800 hover:bg-amber-700 text-amber-100 px-2.5 py-1 rounded-md flex-shrink-0"><RefreshCw size={12}/> Refresh</button></div>}
                    <div className="p-4">
                      <div className="mb-5 overflow-x-auto">
                        {(()=>{
                          const geo=flowGeometry(currentFlow());const viewW=geo.cx*2+160;
                          return(
                            <svg width="100%" viewBox={`0 0 ${viewW} ${geo.totalHeight}`} style={{minWidth:320,maxWidth:480}}>
                              <defs><marker id="flowArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
                              {geo.edges.map((e,ei)=>{const from=geo.nodes[e.from],to=geo.nodes[e.to];if(e.type==='straight')return<g key={ei}><line x1={geo.cx} y1={from.y+from.h} x2={geo.cx} y2={to.y} stroke="#475569" strokeWidth="1.6" markerEnd="url(#flowArrow)"/>{e.label&&<text x={geo.cx+8} y={(from.y+from.h+to.y)/2+3} fontSize="10" fill="#fbbf24" fontFamily="JetBrains Mono,monospace">{e.label}</text>}</g>;const bulge=90*e.side,sx=geo.cx+(from.w/2)*Math.sign(e.side||1),sy=from.midY,ex=geo.cx+(to.w/2)*Math.sign(e.side||1),ey=to.midY;return<g key={ei}><path d={`M ${sx} ${sy} C ${sx+bulge} ${sy}, ${ex+bulge} ${ey}, ${ex} ${ey}`} fill="none" stroke="#d97706" strokeWidth="1.6" strokeDasharray="4 3" markerEnd="url(#flowArrow)"/><rect x={geo.cx+bulge*0.9-26} y={(sy+ey)/2-9} width="52" height="16" rx="4" fill="#1e1308" stroke="#92400e"/><text x={geo.cx+bulge*0.9} y={(sy+ey)/2+3} fontSize="9" fill="#fbbf24" fontFamily="JetBrains Mono,monospace" textAnchor="middle">{e.label}</text></g>;})}
                              {geo.nodes.map(n=>{const pal=n.type==='start'?{stroke:'#059669',fill:'#022c22',text:'#6ee7b7'}:n.type==='end'?{stroke:'#7c3aed',fill:'#2e1065',text:'#c4b5fd'}:n.type==='decision'?{stroke:'#d97706',fill:'#451a03',text:'#fcd34d'}:{stroke:'#0284c7',fill:'#082f49',text:'#7dd3fc'};return<g key={n.id||n.idx}>{n.type==='decision'?<polygon points={`${n.midX},${n.y} ${n.x+n.w},${n.midY} ${n.midX},${n.y+n.h} ${n.x},${n.midY}`} fill={pal.fill} stroke={pal.stroke} strokeWidth="1.6"/>:n.type==='start'||n.type==='end'?<rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.h/2} fill={pal.fill} stroke={pal.stroke} strokeWidth="1.6"/>:<rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" fill={pal.fill} stroke={pal.stroke} strokeWidth="1.6"/>}<foreignObject x={n.type==='decision'?n.x+n.w*0.18:n.x+10} y={n.y+6} width={n.type==='decision'?n.w*0.64:n.w-20} height={n.h-12}><div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100%',textAlign:'center',fontFamily:'Inter,sans-serif'}}><div style={{fontSize:11,fontWeight:600,color:pal.text,lineHeight:1.2}}>{n.label}</div><div style={{fontSize:9,color:'#94a3b8',lineHeight:1.25,marginTop:2,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{n.description}</div></div></foreignObject></g>;})}
                            </svg>
                          );
                        })()}
                      </div>
                      {currentFlow().businessRules?.length>0&&<div className="border-l-2 border-teal-500 pl-3 mb-4"><div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Business Rules</div><ul className="text-sm text-slate-300 space-y-1">{currentFlow().businessRules.map((r,ri)=><li key={ri} className="flex gap-2"><span className="text-slate-600">\u2013</span><span>{r}</span></li>)}</ul></div>}
                      {currentFlow().dataRules?.length>0&&<div className="border-l-2 border-sky-500 pl-3"><div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Data Rules</div><ul className="text-sm text-slate-300 space-y-1">{currentFlow().dataRules.map((r,ri)=><li key={ri} className="flex gap-2"><span className="text-slate-600">\u2013</span><span>{r}</span></li>)}</ul></div>}
                    </div>
                  </div>
                }
              </div>
            )}
            <div className="space-y-4">
              {currentStories().map((s,i)=>{
                const key=`story-${i}`;const open=expandedStory[key]!==false;const isEditing=editingStoryId===s.id;
                return(
                  <div key={s.id||i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    {isEditing?(
                      <div className="p-4 space-y-2">
                        <input value={storyDraft.title} onChange={e=>setStoryDraft(d=>({...d,title:e.target.value}))} placeholder="Title" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"/>
                        <textarea value={storyDraft.storyText} onChange={e=>setStoryDraft(d=>({...d,storyText:e.target.value}))} placeholder="As a... I want... so that..." rows={2} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 resize-none"/>
                        <div><label className="text-xs text-slate-500 mb-1 block">Acceptance criteria (one per line)</label><textarea value={storyDraft.acceptanceCriteria} onChange={e=>setStoryDraft(d=>({...d,acceptanceCriteria:e.target.value}))} rows={3} className="w-full bg-slate-950 border border-teal-800 rounded-lg p-2 text-xs text-slate-300 resize-none"/></div>
                        <div><label className="text-xs text-slate-500 mb-1 block">Assumptions</label><textarea value={storyDraft.assumptions} onChange={e=>setStoryDraft(d=>({...d,assumptions:e.target.value}))} rows={2} className="w-full bg-slate-950 border border-amber-800 rounded-lg p-2 text-xs text-slate-300 resize-none"/></div>
                        <div><label className="text-xs text-slate-500 mb-1 block">Dependencies</label><textarea value={storyDraft.dependencies} onChange={e=>setStoryDraft(d=>({...d,dependencies:e.target.value}))} rows={2} className="w-full bg-slate-950 border border-sky-800 rounded-lg p-2 text-xs text-slate-300 resize-none"/></div>
                        <div><label className="text-xs text-slate-500 mb-1 block">Open questions</label><textarea value={storyDraft.openQuestions} onChange={e=>setStoryDraft(d=>({...d,openQuestions:e.target.value}))} rows={2} className="w-full bg-slate-950 border border-violet-800 rounded-lg p-2 text-xs text-slate-300 resize-none"/></div>
                        <div className="flex gap-2 pt-1"><button onClick={()=>confirmEditStory(s.id)} className="flex items-center gap-1 text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 font-medium px-3 py-1.5 rounded-lg"><Save size={13}/> Save</button><button onClick={cancelEditStory} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"><XCircle size={13}/> Cancel</button></div>
                      </div>
                    ):(
                      <>
                        <div className="w-full flex items-center justify-between p-4 gap-2 flex-wrap">
                          <button onClick={()=>setExpandedStory(p=>({...p,[key]:!open}))} className="flex items-center gap-2 flex-1 text-left min-w-0"><span className="font-medium text-sm text-slate-100 truncate">{s.title}</span></button>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <StatusBadge status={s.status||'Generated'} onChange={st=>updateStoryStatus(s.id,st)}/>
                            <button onClick={()=>startEditStory(s)} className="p-1.5 rounded-md text-slate-500 hover:text-teal-300 hover:bg-slate-800"><Pencil size={14}/></button>
                            <button onClick={()=>setConfirmDelete({type:'story',id:s.id})} className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-800"><Trash2 size={14}/></button>
                            <button onClick={()=>setExpandedStory(p=>({...p,[key]:!open}))} className="p-1.5">{open?<ChevronUp size={18} className="text-slate-500"/>:<ChevronDown size={18} className="text-slate-500"/>}</button>
                          </div>
                        </div>
                        {confirmDelete?.type==='story'&&confirmDelete.id===s.id&&<div className="flex items-center justify-between gap-2 bg-red-950 border-t border-red-800 px-4 py-2.5"><span className="text-xs text-red-300">Remove this story?</span><div className="flex gap-2"><button onClick={()=>{removeStory(s.id);setConfirmDelete(null);}} className="text-xs font-medium text-red-200 bg-red-900 hover:bg-red-800 px-2.5 py-1 rounded-md">Remove</button><button onClick={()=>setConfirmDelete(null)} className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1">Cancel</button></div></div>}
                        {open&&<div className="px-4 pb-4 border-t border-slate-800">
                          <p className="text-sm text-slate-300 italic mt-3 mb-4">{s.storyText}</p>
                          {s.readyForRefinement!==undefined&&<div className={`mono text-xs inline-block px-2.5 py-1 rounded-full border mb-3 ${s.readyForRefinement?'border-emerald-600 text-emerald-300':'border-amber-600 text-amber-300'}`}>{s.readyForRefinement?'Ready for refinement':'Needs more detail'}</div>}
                          {s.improvementNotes&&<p className="text-xs text-slate-400 mb-3">{s.improvementNotes}</p>}
                          {s.acceptanceCriteria?.length>0&&<div className="border-l-2 border-teal-500 pl-3 mb-3"><div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Acceptance Criteria</div><ul className="text-sm text-slate-300 space-y-1">{s.acceptanceCriteria.map((c,ci)=><li key={ci} className="flex gap-2"><span className="text-slate-600">\u2013</span><span>{c}</span></li>)}</ul></div>}
                          {s.assumptions?.length>0&&<div className="border-l-2 border-amber-500 pl-3 mb-3"><div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Assumptions</div><ul className="text-sm text-slate-300 space-y-1">{s.assumptions.map((c,ci)=><li key={ci} className="flex gap-2"><span className="text-slate-600">\u2013</span><span>{c}</span></li>)}</ul></div>}
                          {s.dependencies?.length>0&&<div className="border-l-2 border-sky-500 pl-3 mb-3"><div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Dependencies</div><ul className="text-sm text-slate-300 space-y-1">{s.dependencies.map((c,ci)=><li key={ci} className="flex gap-2"><span className="text-slate-600">\u2013</span><span>{c}</span></li>)}</ul></div>}
                          {s.openQuestions?.length>0&&<div className="border-l-2 border-violet-500 pl-3 mb-3"><div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Open Questions</div><ul className="text-sm text-slate-300 space-y-1">{s.openQuestions.map((c,ci)=><li key={ci} className="flex gap-2"><span className="text-slate-600">\u2013</span><span>{c}</span></li>)}</ul></div>}
                          <button onClick={()=>copyStory(s,key)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-teal-300 mt-2">{copiedKey===key?<Check size={14}/>:<Copy size={14}/>} {copiedKey===key?'Copied':'Copy as markdown'}</button>
                        </div>}
                      </>
                    )}
                  </div>
                );
              })}
              {addingStory?(
                <div className="bg-slate-900 border border-violet-700 rounded-xl p-4 space-y-2">
                  <div className="text-xs uppercase tracking-wide text-violet-400 mb-2">New Story</div>
                  <input value={newStoryDraft.title} onChange={e=>setNewStoryDraft(d=>({...d,title:e.target.value}))} placeholder="Story title *" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-100"/>
                  <textarea value={newStoryDraft.storyText} onChange={e=>setNewStoryDraft(d=>({...d,storyText:e.target.value}))} placeholder="As a... I want... so that... *" rows={2} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 resize-none"/>
                  <div><label className="text-xs text-slate-500 mb-1 block">Acceptance criteria</label><textarea value={newStoryDraft.acceptanceCriteria} onChange={e=>setNewStoryDraft(d=>({...d,acceptanceCriteria:e.target.value}))} rows={3} className="w-full bg-slate-950 border border-teal-800 rounded-lg p-2 text-xs text-slate-300 resize-none"/></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Assumptions</label><textarea value={newStoryDraft.assumptions} onChange={e=>setNewStoryDraft(d=>({...d,assumptions:e.target.value}))} rows={2} className="w-full bg-slate-950 border border-amber-800 rounded-lg p-2 text-xs text-slate-300 resize-none"/></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Dependencies</label><textarea value={newStoryDraft.dependencies} onChange={e=>setNewStoryDraft(d=>({...d,dependencies:e.target.value}))} rows={2} className="w-full bg-slate-950 border border-sky-800 rounded-lg p-2 text-xs text-slate-300 resize-none"/></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Open questions</label><textarea value={newStoryDraft.openQuestions} onChange={e=>setNewStoryDraft(d=>({...d,openQuestions:e.target.value}))} rows={2} className="w-full bg-slate-950 border border-violet-800 rounded-lg p-2 text-xs text-slate-300 resize-none"/></div>
                  <div className="flex gap-2 pt-1"><button onClick={()=>{if(newStoryDraft.title.trim()){addStory(newStoryDraft);setNewStoryDraft({title:'',storyText:'',acceptanceCriteria:'',assumptions:'',dependencies:'',openQuestions:''});setAddingStory(false);}}} className="flex items-center gap-1 text-xs bg-violet-600 hover:bg-violet-500 text-white font-medium px-3 py-1.5 rounded-lg"><Save size={13}/> Add story</button><button onClick={()=>{setAddingStory(false);setNewStoryDraft({title:'',storyText:'',acceptanceCriteria:'',assumptions:'',dependencies:'',openQuestions:''});}} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"><XCircle size={13}/> Cancel</button></div>
                </div>
              ):<button onClick={()=>setAddingStory(true)} className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-violet-300 border border-dashed border-slate-700 hover:border-violet-700 rounded-xl py-2.5 transition-colors mt-2"><Plus size={14}/> Add story manually</button>}
            </div>
          </div>
        )}

        {/* MAP VIEW */}
        {view==='mapView'&&epic&&(
          <div>
            <button onClick={backToEpic} className="flex items-center gap-1 text-xs text-slate-400 hover:text-teal-300 mb-4"><ArrowLeft size={13}/> Back</button>
            <div className="bg-slate-900 border border-violet-800 rounded-xl p-4 mb-3"><div className="mono text-xs text-violet-400 mb-1">EPIC</div><p className="text-sm text-slate-100 font-medium">{epic.title}</p></div>
            <div className="pl-4 border-l border-slate-800 space-y-3">
              {epic.initiatives.map(init=>(
                <div key={init.id}>
                  <button onClick={()=>{setActiveInitiativeId(init.id);setView('initiativeView');}} className="text-left w-full bg-slate-900 border border-slate-800 hover:border-teal-500 rounded-lg p-3 select-none" style={CT}><div className="mono text-xs text-teal-400 mb-1">INITIATIVE</div><p className="text-sm text-slate-200">{init.title}</p></button>
                  {init.features&&<div className="pl-4 border-l border-slate-800 mt-2 space-y-2">
                    {init.features.map(feat=>(
                      <div key={feat.id}>
                        <button onClick={()=>{setActiveInitiativeId(init.id);setActiveFeatureId(feat.id);setView('initiativeView');}} className="text-left w-full bg-slate-900 border border-slate-800 hover:border-sky-500 rounded-lg p-2.5 select-none" style={CT}><div className="mono text-xs text-sky-400 mb-1">FEATURE</div><p className="text-sm text-slate-300">{feat.title}</p></button>
                        {feat.stories&&<div className="pl-4 border-l border-slate-800 mt-2 space-y-1.5">{feat.stories.map(st=><button key={st.id} onClick={()=>{setActiveInitiativeId(init.id);setActiveFeatureId(feat.id);setView('featureView');}} className="text-left w-full bg-slate-950 border border-slate-800 hover:border-violet-500 rounded-lg p-2 select-none" style={CT}><div className="mono text-xs text-violet-400 mb-0.5">STORY</div><p className="text-xs text-slate-400">{st.title}</p></button>)}</div>}
                      </div>
                    ))}
                  </div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VERSION FOOTER */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-800/50">
          <div className="mono text-xs text-slate-700">Prescope {VERSION} &middot; {VERSION_DATE}</div>
          <div>{IS_DEPLOYED?<span className="mono text-[10px] px-2 py-0.5 rounded-full border border-emerald-800 text-emerald-600">&#10003; Deployed</span>:<span className="mono text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-600">Preview mode</span>}</div>
        </div>
      </div>

      {/* RESOURCES OVERLAY */}
      {showResources&&(
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              {activeResource&&<button onClick={()=>setActiveResource(null)} className="text-slate-500 hover:text-slate-200 flex items-center gap-1 text-xs"><ArrowLeft size={14}/> Back</button>}
              <div><div className="text-sm font-semibold text-slate-100">{activeResource?activeResource.name:'Resources & Guidelines'}</div><div className="text-xs text-slate-500">{activeResource?(activeResource.type==='original'?'Original template \u2014 read only':'Working copy \u2014 editable'):'2 templates \u00b7 your working copies'}</div></div>
            </div>
            <div className="flex items-center gap-2">
              {activeResource?.type==='copy'&&(<>
                {activeResource.template.type==='framework'&&<button onClick={()=>downloadFrameworkCopy(activeResource.content,activeResource.name)} className="flex items-center gap-1.5 text-xs text-emerald-300 border border-emerald-700 hover:bg-emerald-950 rounded-lg px-3 py-1.5"><Download size={14}/> Download .md</button>}
                {activeResource.template.type==='toolkit'&&(IS_DEPLOYED?<button onClick={()=>downloadToolkitCopy(activeResource.content,activeResource.name)} className="flex items-center gap-1.5 text-xs text-emerald-300 border border-emerald-700 hover:bg-emerald-950 rounded-lg px-3 py-1.5"><Download size={14}/> Download .xlsx</button>:<div className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-700 rounded-lg px-3 py-1.5 cursor-not-allowed" title="Available on deployed app"><Download size={14}/> .xlsx \u2014 deploy to download</div>)}
              </>)}
              <button onClick={()=>{setShowResources(false);setActiveResource(null);}} className="text-slate-500 hover:text-slate-200"><X size={20}/></button>
            </div>
          </div>
          {!activeResource&&(
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 mb-3">Original Templates \u2014 read only</div>
                <div className="space-y-3">
                  {[THINKING_FRAMEWORK,BA_TOOLKIT].map(t=>(
                    <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div><div className="text-sm font-medium text-slate-100">{t.title}</div><div className="text-xs text-slate-500 mt-0.5">{t.subtitle}</div><div className="mono text-xs text-slate-600 mt-1">{t.type==='framework'?`${t.domains.length} domains \u00b7 fillable text templates`:`${t.sheets.length} sheets \u00b7 editable tables`}</div></div>
                        <div className="flex flex-col gap-2 flex-shrink-0"><button onClick={()=>{setActiveResource({type:'original',template:t,name:t.title,content:null});setResourceActiveSheet(0);}} className="text-xs text-slate-300 border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5">View</button><button onClick={()=>{setNamingCopy({templateId:t.id});setCopyNameInput(`${t.title} \u2014 Copy`);}} className="text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-lg px-3 py-1.5">+ Working copy</button></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {resourceCopies.length>0&&<div><div className="text-xs uppercase tracking-wide text-slate-500 mb-3">Your Working Copies</div><div className="space-y-2">{resourceCopies.map(c=>{const t=c.templateId===THINKING_FRAMEWORK.id?THINKING_FRAMEWORK:BA_TOOLKIT;return(<div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3"><div className="min-w-0"><div className="text-sm text-slate-200 truncate">{c.name}</div><div className="text-xs text-slate-600 mt-0.5">{t.title} \u00b7 saved {new Date(c.updatedAt).toLocaleDateString()}</div></div><div className="flex items-center gap-2 flex-shrink-0"><button onClick={()=>{setActiveResource({type:'copy',template:t,copyId:c.id,content:c.content,name:c.name});setResourceActiveSheet(0);}} className="text-xs font-medium text-teal-300 border border-teal-700 hover:bg-teal-950 rounded-lg px-3 py-1.5">Open</button><button onClick={()=>deleteResourceCopy(c.id)} className="p-1.5 text-slate-600 hover:text-red-400"><Trash2 size={14}/></button></div></div>);})}</div></div>}
              {resourceCopies.length===0&&<div className="text-center py-6 text-slate-600 text-xs"><BookOpen size={24} className="mx-auto mb-2 text-slate-700"/>Create a working copy to start filling it in. The original is always preserved.</div>}
            </div>
          )}
          {activeResource&&activeResource.template.type==='framework'&&(
            <div className="flex-1 overflow-y-auto p-5">
              {THINKING_FRAMEWORK.domains.map((d,di)=>(
                <div key={d.id} className="mb-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-800 bg-slate-950"><div className="text-xs mono text-violet-400 mb-0.5">Domain {di+1}</div><div className="text-sm font-semibold text-slate-100">{d.name}</div><div className="text-xs text-slate-500">{d.goal}</div></div>
                  <div className="p-4 space-y-3">{d.fields.map(f=>{const val=activeResource.content?.[d.id]?.[f.key]??'';const isEdit=activeResource.type==='copy';return(<div key={f.key}><label className="text-xs text-slate-500 mb-1 block">{f.label}</label>{f.multiline?<textarea readOnly={!isEdit} value={val} onChange={e=>{if(!isEdit)return;const next={...activeResource.content,[d.id]:{...activeResource.content[d.id],[f.key]:e.target.value}};updateCopyContent(activeResource.copyId,next);}} rows={3} placeholder={isEdit?'Fill in\u2026':''} className={`w-full rounded-lg p-2 text-xs text-slate-200 resize-none ${isEdit?'bg-slate-950 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500':'bg-transparent border border-slate-800 text-slate-500'}`}/>:<input readOnly={!isEdit} value={val} onChange={e=>{if(!isEdit)return;const next={...activeResource.content,[d.id]:{...activeResource.content[d.id],[f.key]:e.target.value}};updateCopyContent(activeResource.copyId,next);}} placeholder={isEdit?'Fill in\u2026':''} className={`w-full rounded-lg p-2 text-xs text-slate-200 ${isEdit?'bg-slate-950 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500':'bg-transparent border border-slate-800 text-slate-500'}`}/>}</div>);})}</div>
                </div>
              ))}
            </div>
          )}
          {activeResource&&activeResource.template.type==='toolkit'&&(
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex overflow-x-auto border-b border-slate-800 flex-shrink-0 bg-slate-900">{BA_TOOLKIT.sheets.map((s,si)=><button key={s.id} onClick={()=>setResourceActiveSheet(si)} className={`flex-shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${resourceActiveSheet===si?'border-violet-500 text-violet-300 bg-slate-950':'border-transparent text-slate-500 hover:text-slate-300'}`}>{s.name}</button>)}</div>
              {(()=>{const sheet=BA_TOOLKIT.sheets[resourceActiveSheet];const isEdit=activeResource.type==='copy';const rows=activeResource.content?.[sheet.id]||sheet.sampleRows;const isWsjf=sheet.id==='wsjf';const rankMap=isWsjf?computeWsjfRanks(rows):{};return(<div className="flex-1 overflow-auto p-4"><div className="text-xs text-slate-400 mb-1 font-medium">{sheet.domain}</div><div className="text-xs text-slate-600 mb-3">{sheet.description}</div><div className="overflow-x-auto"><table className="w-full text-xs" style={{minWidth:sheet.columns.length*140}}><thead><tr><th className="text-left text-slate-500 px-2 py-1.5 border-b border-slate-800 w-8">#</th>{sheet.columns.map((col,ci)=><th key={ci} className="text-left text-slate-400 font-medium px-2 py-1.5 border-b border-slate-800 whitespace-nowrap">{col}</th>)}</tr></thead><tbody>{rows.map((row,ri)=>(<tr key={ri} className={ri%2===0?'bg-slate-950':'bg-slate-900'}><td className="text-slate-600 px-2 py-1 text-center">{ri+1}</td>{sheet.columns.map((col,ci)=>{const isComputed=isWsjf&&(ci===5||ci===6);const cellVal=isWsjf&&ci===5?computeWsjfRow(row):isWsjf&&ci===6?(rankMap[ri]||''):(row[ci]??'');return(<td key={ci} className="px-1 py-0.5">{isComputed?<div className={`px-2 py-1 text-xs rounded ${cellVal?'text-emerald-300 font-medium':'text-slate-700'}`}>{cellVal||'\u2014'}</div>:isEdit?<input value={row[ci]??''} onChange={e=>{const nr=rows.map((r,ri2)=>ri2===ri?r.map((c,ci2)=>ci2===ci?e.target.value:c):r);const next={...activeResource.content,[sheet.id]:nr};updateCopyContent(activeResource.copyId,next);}} className="w-full bg-transparent border border-transparent hover:border-slate-700 focus:border-violet-600 focus:outline-none rounded px-1.5 py-0.5 text-xs text-slate-300 min-w-24"/>:<div className="px-1.5 py-0.5 text-slate-400">{row[ci]??''}</div>}</td>);})}</tr>))}{isEdit&&sheet.id!=='ceremony'&&<tr><td colSpan={sheet.columns.length+1} className="py-2"><button onClick={()=>{const nr=[...rows,Array(sheet.columns.length).fill('')];const next={...activeResource.content,[sheet.id]:nr};updateCopyContent(activeResource.copyId,next);}} className="text-slate-600 hover:text-violet-300 text-xs flex items-center gap-1 px-3 py-1"><Plus size={13}/> Add row</button></td></tr>}</tbody></table></div></div>);})()}
            </div>
          )}
        </div>
      )}

      {namingCopy&&(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 p-5">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-full max-w-sm">
            <div className="text-sm font-semibold text-slate-100 mb-1">Name your working copy</div>
            <div className="text-xs text-slate-500 mb-4">The original template is always preserved. Give this copy a name for your project.</div>
            <input value={copyNameInput} onChange={e=>setCopyNameInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&copyNameInput.trim())createResourceCopy(namingCopy.templateId,copyNameInput.trim());}} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4" placeholder="e.g. Patient Portal Epic \u2014 Q3 2026" autoFocus/>
            <div className="flex gap-2">
              <button onClick={()=>{if(copyNameInput.trim()){createResourceCopy(namingCopy.templateId,copyNameInput.trim());setShowResources(true);}}} disabled={!copyNameInput.trim()} className="flex items-center gap-1.5 text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded-lg"><Plus size={15}/> Create copy</button>
              <button onClick={()=>setNamingCopy(null)} className="text-sm text-slate-400 hover:text-slate-200 px-4 py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {exportContent&&(
        <div className="fixed inset-0 bg-black/80 flex flex-col z-50">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
            <div><div className="text-sm font-medium text-slate-100">Export ready</div><div className="text-xs text-slate-500">{exportContent.filename} \u2014 copy everything below</div></div>
            <div className="flex items-center gap-3">
              <button onClick={async()=>{try{await navigator.clipboard.writeText(exportContent.text);setExportCopied(true);setTimeout(()=>setExportCopied(false),2000);}catch(e){setError('Could not copy \u2014 select all and copy manually.');}}} className="flex items-center gap-2 text-sm font-medium bg-teal-500 hover:bg-teal-400 text-slate-950 px-3 py-1.5 rounded-lg">{exportCopied?<Check size={15}/>:<Copy size={15}/>} {exportCopied?'Copied!':'Copy all'}</button>
              <button onClick={()=>setExportContent(null)} className="text-slate-500 hover:text-slate-200"><X size={20}/></button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-4"><textarea readOnly value={exportContent.text} className="w-full h-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono resize-none focus:outline-none" onClick={e=>e.target.select()}/></div>
          <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-500 flex-shrink-0">Paste into Notion, Confluence, or a text editor. To open in Word: paste and use Home \u2192 Paste Special \u2192 Unformatted Text.</div>
        </div>
      )}

      {historyOpen&&(
        <div className="fixed inset-0 bg-black/60 flex justify-end z-50" onClick={()=>setHistoryOpen(false)}>
          <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-5" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-slate-100">History</h2><button onClick={()=>setHistoryOpen(false)} className="text-slate-500 hover:text-slate-200"><X size={20}/></button></div>
            {!storageReady&&<p className="text-xs text-amber-400 mb-3">History couldn't be saved \u2014 it'll only last this session.</p>}
            {history.length===0?<p className="text-sm text-slate-500">Nothing analyzed yet.</p>:(
              <div className="space-y-3">
                {history.map(h=>(
                  <div key={h.id} className="relative bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg overflow-hidden group">
                    <button onClick={()=>loadFromHistory(h)} className="w-full text-left p-3 pr-10 select-none" style={CT}>
                      <div className="mono text-xs text-violet-400 mb-1">{h.classification?.classification||h.classification}</div>
                      <div className="text-sm text-slate-300 truncate">{h.requestText}</div>
                      <div className="text-xs text-slate-600 mt-1">{new Date(h.timestamp).toLocaleString()}</div>
                      {(h.epic||h.standaloneInitiative||h.standaloneFeatures||h.standaloneStories)&&<div className="text-xs text-teal-500 mt-1">Has generated content \u2014 tap to view</div>}
                    </button>
                    <button
                      onClick={async(e)=>{e.stopPropagation();await persistHistory(history.filter(x=>x.id!==h.id));}}
                      className="absolute top-2 right-2 p-1.5 rounded-md text-slate-700 hover:text-red-400 hover:bg-red-950 transition-colors"
                      title="Delete this entry"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                ))}
                <button onClick={clearHistory} className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 mt-2"><Trash2 size={14}/> Clear all history</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showUpgrade && <UpgradePrompt onDismiss={() => setShowUpgrade(false)} />}
    </div>
  );
}

// ── Root export with auth gate ────────────────────────────────────────────
function Prescope() {
  const [authStatus, setAuthStatus] = useState('checking');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const { remaining: guestRemaining, increment: guestIncrement } = useGuestUsage();

    useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!window.Clerk) {
          throw new Error('Clerk did not load');
        }

        await window.Clerk.load();

        const session = window.Clerk.session;

        if (!session) {
          if (!cancelled) {
            setUser(null);
            setAuthStatus('guest');
          }
          return;
        }

        const token = await session.getToken();
        const userData = await verifySession(token);

        if (!userData) {
          if (!cancelled) {
            setUser(null);
            setAuthStatus('guest');
          }
          return;
        }

        const usage = await checkUsage(userData.userId);

        if (!cancelled) {
          setUser({
            ...userData,
            remaining: usage.remaining ?? FREE_LIMIT
          });
          setAuthStatus('authed');
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);

        if (!cancelled) {
          setUser(null);
          setAuthStatus('guest');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignIn() {
    if (!IS_DEPLOYED) {
      // Preview mode: simulate a free user
      setUser({ userId: 'preview-user', email: 'preview@example.com', plan: 'free', remaining: FREE_LIMIT });
      setAuthStatus('authed');
      setShowLogin(false);
      return;
    }
    // Production: redirect to Clerk hosted sign-in
    window.location.href = `https://accounts.${window.location.hostname.split('.').slice(-2).join('.')}/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`;
  }

   async function handleSignOut() {
    try {
      if (window.Clerk) {
        await window.Clerk.signOut();
      }
    } finally {
      setUser(null);
      setAuthStatus('guest');
      setShowLogin(false);
      window.location.href = '/';
    }
  }

  async function handleGenerate() {
    if (authStatus === 'authed') {
      if (user?.plan === 'paid') return true;
      const result = await incrementUsage(user.userId);
      setUser(u => ({ ...u, remaining: result.remaining ?? 0 }));
      return result.allowed !== false;
    }
    // Guest
    if (!IS_DEPLOYED) return true; // unlimited in preview
    if (guestRemaining <= 0) return false;
    guestIncrement();
    return true;
  }

  const canGenerate = authStatus === 'authed'
    ? (user?.plan === 'paid' || (user?.remaining ?? FREE_LIMIT) > 0)
    : (!IS_DEPLOYED || guestRemaining > 0);

  const generationsRemaining = authStatus === 'authed'
    ? (user?.plan === 'paid' ? Infinity : (user?.remaining ?? FREE_LIMIT))
    : guestRemaining;

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 size={20} className="animate-spin text-teal-400"/>
      </div>
    );
  }

  if (showLogin) {
    return <LoginScreen onSignIn={handleSignIn} onContinueAsGuest={() => setShowLogin(false)} guestRemaining={guestRemaining}/>;
  }

  return (
    <AppInner
      authStatus={authStatus}
      user={user}
      canGenerate={canGenerate}
      generationsRemaining={generationsRemaining}
      isPaid={authStatus === 'authed' && user?.plan === 'paid'}
      onSignIn={() => setShowLogin(true)}
      onSignOut={handleSignOut}
      onGenerate={handleGenerate}
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Prescope />);
