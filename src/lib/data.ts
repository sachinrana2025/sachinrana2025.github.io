// Typed, curated view of portfolioData.json. Import only from Server Components so the
// raw JSON never ships to the browser; client components receive plain props.
import raw from './portfolioData.json';
// Engagement offers (names, starting prices, scope) for /engage and /twins.
import shared from './offers.json';

export interface Metric {
  id: string;
  metric: string;
  label: string;
  description: string;
}

export interface ComplianceItem {
  id: string;
  framework: string;
  category: string;
  governing_body: string;
  status: string;
  summary: string;
  controls: string[];
  architectural_evidence: string;
}

export interface Topology {
  id: string;
  title: string;
  domain: string;
  description: string;
  specs: { label: string; value: string }[];
  subsystems: { name: string; details: string }[];
  diagram: { src: string; alt: string; width: number; height: number };
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  challenge: string;
  approach: string[];
  outcome: string;
  metrics: string[];
  domain: string;
  hue: Hue;
}

export type Hue = 'ai' | 'cloud' | 'iiot' | 'twin';

export interface ExpertiseTopic {
  title: string;
  description: string;
  points: string[];
}

export interface ExpertiseArea {
  id: 'cloud' | 'ai' | 'iiot' | 'twins';
  title: string;
  summary: string;
  technologies: string[];
  topics: ExpertiseTopic[];
}

export interface Twin {
  id: string;
  name: string;
  scale: string;
  model: string;
  kpis: string[];
}

export interface Role {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  technologies: string[];
}

export interface Engagement {
  name: string;
  price: string;
  cadence: string;
  commitment: string;
  scope: string[];
  idealFor: string;
}

export interface Sprint {
  name: string;
  price: string;
  turnaround: string;
  deliverables: string[];
}

const tabs = raw.tabs;

const titleCase = (key: string) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// "Tier 1: Strategic Advisory" -> "Strategic Advisory"
const stripPrefix = (s: string) => s.replace(/^(Tier|Sprint)\s*\d+:\s*/i, '');

// "$15,000 – $18,000 / month" -> "$15k"
const fromPrice = (s: string) => {
  const m = s.match(/\$([\d,]+)/);
  if (!m) return s;
  const n = Number(m[1].replace(/,/g, ''));
  return n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
};

export const profile = {
  summary: raw.personal.executive_summary,
  education: raw.personal.education.map((e) => ({
    degree: e.degree,
    field: e.field_of_study,
    institution: e.institution,
    period: e.period,
  })),
  heroHeadline: tabs.tab_1_executive_overview.hero_headline,
  heroSub: tabs.tab_1_executive_overview.hero_subheadline,
};

export const metrics: Metric[] = raw.impact_metrics.map((m) => ({
  id: m.id,
  metric: m.metric,
  label: m.label,
  description: m.description,
}));

export const headlineMetrics = [
  { value: '85%', label: 'Cloud spend removed through bare-metal repatriation' },
  { value: '99.999%', label: 'Reliability on mission-critical SCADA telemetry' },
  { value: '9', label: 'Production physics-informed digital twins' },
  { value: '10+', label: 'Years shipping production systems' },
];

export const tenets = tabs.tab_1_executive_overview.architectural_philosophy.map((p) => ({
  title: p.pillar,
  tagline: p.tagline,
  body: p.concept,
}));

export const targetRoles = tabs.tab_1_executive_overview.target_roles;

export const trackRecord = tabs.tab_1_executive_overview.quantified_track_record.map((t) => ({
  title: t.title,
  metrics: t.metrics,
  details: t.details,
}));

export const compliance: ComplianceItem[] = raw.compliance_matrix.map((c) => ({
  id: c.id,
  framework: c.framework,
  category: c.category,
  governing_body: c.governing_body,
  status: c.status,
  summary: c.summary,
  controls: c.controls,
  architectural_evidence: c.architectural_evidence,
}));

const diagrams: Record<string, Topology['diagram']> = {
  'multi-cloud-transit-hub': {
    src: '/diagrams/hub-spoke-cloud-architecture-v5.svg',
    alt: 'Hub-and-spoke multi-cloud topology: a transit hub connecting production, data and telemetry spokes with an on-premises edge over an encrypted mesh.',
    width: 1200,
    height: 800,
  },
  'sovereign-ai-mcp-bus': {
    src: '/diagrams/autonomous-mcp-agent-loop-v5.svg',
    alt: 'Sovereign AI loop: agents call tools through an MCP bus, routed by an LLM gateway to private GPU inference with memory and guardrails.',
    width: 1300,
    height: 820,
  },
  'sub-50ms-telemetry-lakehouse': {
    src: '/diagrams/iot-clickhouse-pipeline-v5.svg',
    alt: 'Industrial telemetry pipeline: field devices and gateways publish over MQTT to EMQX, which streams into ClickHouse for sub-50ms analytics.',
    width: 1350,
    height: 780,
  },
  'physics-digital-twins': {
    src: '/diagrams/digital-twin-physics-loop-v5.svg',
    alt: 'Digital twin loop: physical assets feed filtered telemetry into a physics simulator; discrepancies drive analysis and closed-loop control.',
    width: 1350,
    height: 820,
  },
};

export const topologies: Topology[] = raw.architecture_showcase.topologies.map((t) => ({
  id: t.id,
  title: t.title,
  domain: t.domain,
  description: t.description,
  specs: Object.entries(t.specs as Record<string, string | undefined>)
    .filter((e): e is [string, string] => typeof e[1] === 'string')
    .map(([k, v]) => ({ label: titleCase(k), value: v })),
  subsystems: t.subsystems,
  diagram: diagrams[t.id],
}));

const cloud = tabs.tab_2_enterprise_cloud_devops.subsections;
const ai = tabs.tab_3_autonomous_ai_llmops.subsections;
const iiot = tabs.tab_4_high_throughput_iiot_telemetry.subsections;

export const caseStudies: CaseStudy[] = [
  ...raw.architecture_showcase.case_studies.map((c) => ({
    id: c.id,
    title: c.title,
    client: c.client_profile,
    challenge: c.challenge,
    approach: [c.solution],
    outcome: c.outcome,
    metrics: c.metrics.split('·').map((s) => s.trim()),
    domain: c.id.startsWith('cloud')
      ? 'Cloud cost'
      : c.id.startsWith('multi')
        ? 'Cloud security'
        : 'Industrial telemetry',
    hue: (c.id.startsWith('iiot') ? 'iiot' : 'cloud') as Hue,
  })),
  {
    id: 'sql-migration-case-study',
    title: cloud.case_study_sql_migration.title.replace(/^Case Study:\s*/, ''),
    client: cloud.case_study_sql_migration.client_profile,
    challenge: cloud.case_study_sql_migration.challenge,
    approach: cloud.case_study_sql_migration.solution_architecture,
    outcome: cloud.case_study_sql_migration.outcome,
    metrics: ['1 TB migrated', 'Zero data loss', 'In-window cutover'],
    domain: 'Data migration',
    hue: 'cloud',
  },
  {
    id: 'fmcg-condition-monitoring-case-study',
    title: iiot.case_study_fmcg_cms.title.replace(/^Case Study:\s*/, ''),
    client: iiot.case_study_fmcg_cms.client,
    challenge: iiot.case_study_fmcg_cms.objective,
    approach: iiot.case_study_fmcg_cms.solution_architecture,
    outcome: iiot.case_study_fmcg_cms.outcome,
    metrics: ['Edge-to-cloud', 'Predictive maintenance', 'Lead architect'],
    domain: 'Manufacturing IIoT',
    hue: 'iiot',
  },
];

const capability = (i: number) => tabs.tab_1_executive_overview.core_capabilities_matrix[i];

export const expertise: ExpertiseArea[] = [
  {
    id: 'cloud',
    title: 'Cloud & Infrastructure',
    summary: tabs.tab_2_enterprise_cloud_devops.overview,
    technologies: capability(1).key_technologies,
    topics: [
      cloud.cloud_landing_zones,
      cloud.terraform_iac_automation,
      cloud.container_orchestration,
      cloud.bare_metal_virtualization,
      cloud.zero_trust_mesh_networking,
    ].map((s) => ({ title: s.title, description: s.description, points: s.architectural_highlights })),
  },
  {
    id: 'ai',
    title: 'Agentic AI & LLMOps',
    summary: tabs.tab_3_autonomous_ai_llmops.overview,
    technologies: capability(0).key_technologies,
    topics: [
      {
        title: ai.sovereign_local_inference.title,
        description: ai.sovereign_local_inference.description,
        points: ai.sovereign_local_inference.quantization_mastery,
      },
      {
        title: ai.litellm_gateway_proxy.title,
        description: ai.litellm_gateway_proxy.description,
        points: ai.litellm_gateway_proxy.architectural_highlights,
      },
      {
        title: ai.mcp_server_ecosystem.title,
        description: ai.mcp_server_ecosystem.description,
        points: ai.mcp_server_ecosystem.deployed_servers.map((s) => `${s.name}: ${s.capabilities}`),
      },
      {
        title: ai.autonomous_multi_agent_teams.title,
        description: ai.autonomous_multi_agent_teams.description,
        points: ai.autonomous_multi_agent_teams.architectural_highlights,
      },
      {
        title: ai.persistent_memory_rag.title,
        description: ai.persistent_memory_rag.description,
        points: ai.persistent_memory_rag.memory_layers.map((l) => `${l.layer} (${l.technology}): ${l.role}`),
      },
    ],
  },
  {
    id: 'iiot',
    title: 'Industrial IoT & Telemetry',
    summary: tabs.tab_4_high_throughput_iiot_telemetry.overview,
    technologies: capability(2).key_technologies,
    topics: [
      {
        title: iiot.clickhouse_architecture.title,
        description: iiot.clickhouse_architecture.primary_tables
          .map((t) => {
            const r = t as Record<string, string | undefined>;
            const facts = [r.scale, r.query_latency].filter(Boolean).join(', ');
            return facts ? `${r.engine}: ${facts}` : '';
          })
          .filter(Boolean)
          .join(' · '),
        points: iiot.clickhouse_architecture.architectural_highlights,
      },
      {
        title: iiot.forensic_energy_standards.title,
        description: iiot.forensic_energy_standards.core_rule,
        points: iiot.forensic_energy_standards.five_core_forensic_kpis.map(
          (k) => `${k.kpi} (${k.unit}): ${k.forensic_role}`,
        ),
      },
      {
        title: iiot.industrial_protocols_fieldbus.title,
        description: 'Field protocols integrated end to end, from physical layer to analytics.',
        points: iiot.industrial_protocols_fieldbus.supported_protocols.map(
          (p) => `${p.protocol}: ${p.use_case}`,
        ),
      },
      {
        title: iiot.messaging_backbone_emqx.title,
        description: iiot.messaging_backbone_emqx.deployment,
        points: iiot.messaging_backbone_emqx.direct_rule_engine,
      },
      {
        title: iiot.custom_iot_gateway_design.title,
        description: iiot.custom_iot_gateway_design.hardware_architecture,
        points: iiot.custom_iot_gateway_design.firmware_engineering,
      },
    ],
  },
  {
    id: 'twins',
    title: 'Digital Twins',
    summary: tabs.tab_5_industrial_digital_twins.overview,
    technologies: capability(3).key_technologies,
    topics: [
      {
        title: 'Platform architecture',
        description: capability(3).summary,
        points: tabs.tab_5_industrial_digital_twins.tech_stack_highlights,
      },
    ],
  },
];

const TWIN_META = new Set(['id', 'name', 'route', 'scale', 'interactive_controls']);

export const twins: Twin[] = tabs.tab_5_industrial_digital_twins.twins_inventory.map((entry) => {
  const t = entry as Record<string, unknown>;
  const model = Object.entries(t).find(
    ([k, v]) => !TWIN_META.has(k) && typeof v === 'string',
  )?.[1] as string | undefined;
  const kpiSource = (t.live_kpis ?? t.utility_kpis ?? []) as unknown[];
  const kpis = kpiSource.slice(0, 3).map((k) => {
    if (typeof k === 'string') return k;
    const o = k as Record<string, string>;
    const value = o.current_sim ?? o.value ?? o.metric ?? o.target ?? '';
    return value ? `${o.kpi}: ${value}` : o.kpi;
  });
  return {
    id: String(t.id),
    name: String(t.name),
    scale: String(t.scale),
    model: model ?? '',
    kpis,
  };
});


export const techStack = tabs.tab_8_interactive_terminal_tech_stack.tech_stack_matrix.map((t) => ({
  category: t.category,
  technology: t.technology,
  proficiency: t.proficiency,
  years: String(t.experience_years),
  useCase: t.production_use_case,
}));

export const career = {
  overview: tabs.tab_6_career_timeline.overview,
  roles: tabs.tab_6_career_timeline.timeline_roles.map(
    (r): Role => ({
      company: r.company,
      role: r.role,
      period: r.period,
      location: r.location,
      highlights: r.core_responsibilities,
      technologies: r.key_technologies,
    }),
  ),
  projects: tabs.tab_6_career_timeline.notable_standalone_projects.map((p) => ({
    name: p.project_name,
    objective: p.objective,
    role: p.role,
  })),
};

const fees = tabs.tab_7_commercials_advisory_rates.fee_structure;

const sharedEngagement = (id: string) => {
  const e = shared.engagements.find((x) => x.id === id);
  if (!e) throw new Error(`offers.json: no engagement "${id}"`);
  return e;
};
const sharedPrice = (id: string) => `From ${fromPrice(`$${sharedEngagement(id).from}`)}`;

// The retainer tiers in portfolioData, in order, and the shared engagement each one is priced from.
const retainerIds = ['fractional-cto', 'embedded'];
// Sprints priced from the shared list where the company site sells the same thing.
const sprintIds: (string | null)[] = ['sprint', null, 'twin-pilot'];

const advisor = sharedEngagement('advisor');

// The digital-twin service as the company site sells it: steps and starting price.
const pilot = sharedEngagement('twin-pilot');
export const twinPilot = {
  name: pilot.name,
  price: sharedPrice('twin-pilot'),
  duration: pilot.duration,
  summary: pilot.summary,
  steps: pilot.includes,
};

export const engagements: Engagement[] = [
  {
    name: advisor.name,
    price: sharedPrice('advisor'),
    cadence: 'per month',
    commitment: advisor.duration.charAt(0).toUpperCase() + advisor.duration.slice(1),
    scope: advisor.includes,
    idealFor: advisor.summary,
  },
  ...fees.monthly_retainers.map((r, i) => ({
    name: stripPrefix(r.tier_name),
    price: retainerIds[i] ? sharedPrice(retainerIds[i]) : `From ${fromPrice(r.monthly_rate)}`,
    cadence: 'per month',
    commitment: r.hours_commitment,
    scope: r.scope_of_work,
    idealFor: r.ideal_for,
  })),
];

export const sprints: Sprint[] = fees.fixed_scope_sprints.map((s, i) => ({
  name: stripPrefix(s.sprint_name),
  price: sprintIds[i] ? sharedPrice(sprintIds[i]) : `From ${fromPrice(s.price_range)}`,
  turnaround: s.turnaround,
  deliverables: s.deliverables,
}));

const terms = tabs.tab_7_commercials_advisory_rates.engagement_terms;

export const engagementTerms = [
  {
    label: 'Consulting only',
    value:
      'I do not build, sell or license products that compete with my clients’ products, and I will put that in the contract.',
  },
  { label: 'Contract vehicles', value: terms.contractual_vehicles },
  { label: 'Intellectual property', value: terms.ip_assignment },
  { label: 'Confidentiality', value: terms.confidentiality },
  { label: 'Availability', value: terms.availability },
];
