// Scripted walkthroughs for the Agent Console. They show how my agent systems reason
// (plan → tools → guardrail → decision); they are not a live model. Outcome figures
// come from the matching case study on /work, or are marked illustrative.

export type BriefArea = 'ai' | 'cloud' | 'twin' | 'iiot' | 'compliance' | 'cto';

export type AgentStep =
  | { kind: 'plan'; title: string; detail: string[] }
  | { kind: 'tool'; title: string; tool: string; args: string; result: string; ms: number }
  | { kind: 'guardrail'; title: string; detail: string; approver: string }
  | { kind: 'decision'; title: string; detail: string };

export interface AgentScenario {
  id: string;
  area: BriefArea;
  problem: string;
  goal: string;
  steps: AgentStep[];
  outcome: {
    headline: string;
    metrics: string[];
    source: string;
    link: { href: string; label: string };
  };
}

export const agentScenarios: AgentScenario[] = [
  {
    id: 'cloud-bill',
    area: 'cloud',
    problem: 'Our cloud bill doubled',
    goal: 'Find what is driving spend and propose a cut that keeps latency and security intact.',
    steps: [
      {
        kind: 'plan',
        title: 'Plan',
        detail: [
          'Break spend down by service and workload',
          'Correlate cost with actual utilization',
          'Model a hybrid bare-metal option against current SLOs',
        ],
      },
      {
        kind: 'tool',
        title: 'Pull 90 days of billing',
        tool: 'billing.query',
        args: '{ period: "90d", group_by: ["service", "tag:workload"] }',
        result: 'Managed DBs, vector search and LLM API tokens make up most of the bill',
        ms: 840,
      },
      {
        kind: 'tool',
        title: 'Check real utilization',
        tool: 'clickhouse.query',
        args: 'SELECT workload, avg(cpu), p95(latency_ms) FROM usage GROUP BY workload',
        result: 'Analytical store runs hot and steady; query latency above 350 ms',
        ms: 46,
      },
      {
        kind: 'tool',
        title: 'Size a bare-metal alternative',
        tool: 'capacity.model',
        args: '{ workloads: ["analytics", "inference"], target: "NVMe + GPU nodes" }',
        result: 'Steady workloads fit on owned NVMe and GPU nodes; burst stays in cloud',
        ms: 1200,
      },
      {
        kind: 'guardrail',
        title: 'Change review',
        detail: 'Migration plan touches production data paths. Requires sign-off before any change.',
        approver: 'CTO approves migration plan',
      },
      {
        kind: 'decision',
        title: 'Decision',
        detail: 'Repatriate analytics and inference to bare metal over an encrypted mesh; keep cloud for burst.',
      },
    ],
    outcome: {
      headline: 'Recurring cloud spend cut by 85%',
      metrics: ['85% lower spend', '350 ms → <45 ms', '0 unencrypted paths'],
      source: 'From the cloud repatriation case study',
      link: { href: '/work#cloud-repatriation-case-study', label: 'Read the case study' },
    },
  },
  {
    id: 'chiller',
    area: 'twin',
    problem: 'The chiller is losing efficiency',
    goal: 'Find which component is degrading, how much energy it costs, and what to do about it.',
    steps: [
      {
        kind: 'plan',
        title: 'Plan',
        detail: [
          'Read live chiller points from the gateway',
          'Compare against a healthy model at the same load and water temperatures',
          'Blame the fault on one component and price the energy lost',
        ],
      },
      {
        kind: 'tool',
        title: 'Read live points',
        tool: 'gateway.read',
        args: '{ unit: "chiller-1", points: ["cond_bar_g", "tower_in_c", "kw"] }',
        result: 'Condenser pressure and approach above expected for this load',
        ms: 120,
      },
      {
        kind: 'tool',
        title: 'Ask the digital twin',
        tool: 'twin.health',
        args: '{ unit: "chiller-1", window: "15m" }',
        result: 'Condenser: DEGRADED (approach high). Tower water normal for wet-bulb',
        ms: 64,
      },
      {
        kind: 'tool',
        title: 'Look up the procedure',
        tool: 'kb.search',
        args: '"condenser approach high tube fouling cleaning procedure"',
        result: 'Matched OEM tube-cleaning procedure and last service record',
        ms: 210,
      },
      {
        kind: 'guardrail',
        title: 'Read-only check',
        detail: 'The agent never writes setpoints. It drafts a work order for a person to approve.',
        approver: 'Facilities lead approves work order',
      },
      {
        kind: 'decision',
        title: 'Decision',
        detail: 'Raise a condenser tube-cleaning work order, with the energy lost against a healthy chiller attached.',
      },
    ],
    outcome: {
      headline: 'Fault found and priced before it became a breakdown',
      metrics: ['Blamed on one component', 'Energy lost vs healthy', 'Work order drafted'],
      source: 'Illustrative pattern, based on the twin health checks I build for clients',
      link: { href: '/twins', label: 'How I build twins' },
    },
  },
  {
    id: 'soc2',
    area: 'compliance',
    problem: 'We must pass SOC 2',
    goal: 'Close the infrastructure gaps an auditor will find, and make the fixes repeatable.',
    steps: [
      {
        kind: 'plan',
        title: 'Plan',
        detail: [
          'Scan accounts for shared credentials and public exposure',
          'Map findings to SOC 2 Trust Services Criteria',
          'Fix through code, not console clicks',
        ],
      },
      {
        kind: 'tool',
        title: 'Scan IAM and network',
        tool: 'cloud.scan',
        args: '{ accounts: "all", checks: ["iam.shared_keys", "net.public_ip", "net.segmentation"] }',
        result: 'Shared credentials, flat network, public IPs on internal services',
        ms: 1600,
      },
      {
        kind: 'tool',
        title: 'Draft guardrails as code',
        tool: 'terraform.plan',
        args: 'module "landing_zone" { scp_guardrails = true, hub_spoke = true }',
        result: 'Plan: multi-account landing zone, SCP boundaries, hub-spoke transit',
        ms: 2300,
      },
      {
        kind: 'tool',
        title: 'Check policy',
        tool: 'policy.check',
        args: '{ framework: "soc2", plan: "landing_zone.tfplan" }',
        result: 'All mapped controls satisfied by the plan',
        ms: 380,
      },
      {
        kind: 'guardrail',
        title: 'Pull request review',
        detail: 'Infrastructure changes land as a pull request. Nothing applies without review.',
        approver: 'Platform lead approves PR',
      },
      {
        kind: 'decision',
        title: 'Decision',
        detail: 'Apply the landing zone in stages, rotate credentials, and remove every public IP.',
      },
    ],
    outcome: {
      headline: 'SOC 2 Type II passed with zero findings',
      metrics: ['SOC 2 pass', '100% automated IaC', 'Zero public ingress'],
      source: 'From the zero-trust migration case study',
      link: { href: '/work#multi-cloud-landing-zone-case-study', label: 'Read the case study' },
    },
  },
  {
    id: 'support',
    area: 'ai',
    problem: 'Support team is drowning in tickets',
    goal: 'Answer repeat questions automatically, and hand anything risky to a person.',
    steps: [
      {
        kind: 'plan',
        title: 'Plan',
        detail: [
          'Cluster recent tickets to find the repeat questions',
          'Ground answers in the knowledge base, with citations',
          'Route low-confidence or account-changing requests to a human',
        ],
      },
      {
        kind: 'tool',
        title: 'Cluster recent tickets',
        tool: 'tickets.cluster',
        args: '{ period: "30d", min_cluster: 20 }',
        result: 'A handful of topics cover most of the volume',
        ms: 950,
      },
      {
        kind: 'tool',
        title: 'Retrieve grounded answers',
        tool: 'rag.search',
        args: '{ index: "kb", query: ticket.body, top_k: 5, rerank: true }',
        result: 'Cited passages found for the top topics',
        ms: 140,
      },
      {
        kind: 'tool',
        title: 'Draft replies on a private model',
        tool: 'llm.complete',
        args: '{ model: "private-gateway", max_tokens: 400, cite: true }',
        result: 'Replies drafted with sources; confidence scored per ticket',
        ms: 620,
      },
      {
        kind: 'guardrail',
        title: 'Human in the loop',
        detail: 'Low-confidence answers, refunds and account changes go to an agent queue, never auto-sent.',
        approver: 'Support lead reviews queue',
      },
      {
        kind: 'decision',
        title: 'Decision',
        detail: 'Auto-answer high-confidence repeats with citations; queue the rest with a suggested reply.',
      },
    ],
    outcome: {
      headline: 'Repeat tickets answered, risky ones kept human',
      metrics: ['Grounded with citations', 'Private model', 'Human approval gate'],
      source: 'Illustrative pattern; scoped per client',
      link: { href: '/agents#how', label: 'How I build agents' },
    },
  },
];
