import type { Metadata } from 'next';
import { Brain, Database, Gauge, ShieldCheck, Waypoints, Wrench } from 'lucide-react';
import { expertise, topologies } from '@/lib/data';
import { briefHref } from '@/lib/site';
import { ButtonLink, PageHeader, Section, TagList } from '@/components/ui';
import { CtaBand, DiagramFigure } from '@/components/blocks';
import { AgentConsole } from '@/components/agents/AgentConsole';
import { Reveal } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Agentic AI & LLMOps',
  description:
    'AI agents that plan, call tools over MCP, ground answers in your data and stop for human approval. Private LLM gateways, memory, guardrails and evals, built and run end to end.',
  alternates: { canonical: '/agents' },
};

const layers = [
  {
    icon: Waypoints,
    title: 'LLM gateway',
    body: 'One private entry point for every model: routing, fallback, per-team token budgets and cost attribution. Your prompts never hit a public multi-tenant endpoint unless you choose it.',
  },
  {
    icon: Wrench,
    title: 'MCP tool bus',
    body: 'Agents act through typed tools (databases, twins, ticketing, IaC) exposed over the Model Context Protocol, each with its own auth and scope.',
  },
  {
    icon: Database,
    title: 'Memory & retrieval',
    body: 'Exact operational facts, episodic history and hybrid vector search, so agents answer from your data with citations instead of guessing.',
  },
  {
    icon: ShieldCheck,
    title: 'Guardrails & approval',
    body: 'Read-only by default. Anything that changes production, money or customers stops at a human approval gate, and every step is logged.',
  },
  {
    icon: Gauge,
    title: 'Evals & observability',
    body: 'Traces for every run, regression evals before each change, and latency and cost tracked per tool call.',
  },
  {
    icon: Brain,
    title: 'Private inference',
    body: 'Open-weight models on your own GPUs when data cannot leave, with quantization tuned for throughput.',
  },
];

export default function AgentsPage() {
  const ai = expertise.find((e) => e.id === 'ai');
  const loop = topologies.find((t) => t.id === 'sovereign-ai-mcp-bus');

  return (
    <>
      <PageHeader
        eyebrow="Agentic AI & LLMOps"
        title={
          <>
            Agents that <em className="italic text-ai">do the work</em>, and know when to ask.
          </>
        }
        intro="I build AI agents that plan, call tools against your real systems, reason over live data and digital twins, and stop for a person before anything risky. Then I run them in production, on infrastructure you control."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={briefHref('ai')}>Brief me on your agent idea</ButtonLink>
          <ButtonLink href="#console" variant="secondary">
            Try the console
          </ButtonLink>
        </div>
      </PageHeader>

      <Section
        id="console"
        index="01"
        eyebrow="Live walkthrough"
        title="Four problems, four agents"
        intro="Pick a problem and watch the full trace: the plan, every tool call and its result, the guardrail, and the outcome. Each one is drawn from delivered work."
      >
        <AgentConsole />
      </Section>

      <Section
        id="how"
        index="02"
        eyebrow="Architecture"
        title="What sits under a production agent"
        intro="A demo agent is a prompt and an API key. A production agent needs six more layers. I design, build and operate all of them."
        tone="surface"
      >
        <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {layers.map((l, i) => (
            <li key={l.title} className="bg-surface p-6">
              <Reveal delay={i * 60}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-ai/10 text-ai">
                  <l.icon aria-hidden className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 font-medium text-ink">{l.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{l.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        {loop && (
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <DiagramFigure topology={loop} />
            </div>
            <div className="lg:col-span-4">
              <h3 className="font-serif text-2xl leading-snug text-ink">{loop.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{loop.description}</p>
              <dl className="mt-5 divide-y divide-line border-y border-line">
                {loop.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 py-2.5 text-sm">
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="text-right font-medium text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </Section>

      {ai && (
        <Section
          id="depth"
          index="03"
          eyebrow="In production"
          title="What I have built and run"
          intro={ai.summary}
        >
          <div className="mb-8">
            <TagList label="AI technologies" items={ai.technologies} />
          </div>
          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
            {ai.topics.map((topic) => (
              <article key={topic.title} className="bg-paper p-6 sm:p-7">
                <h3 className="font-medium text-ink">{topic.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{topic.description}</p>
                {topic.points.length > 0 && (
                  <details className="group mt-4">
                    <summary className="inline-flex min-h-11 cursor-pointer list-none items-center text-sm text-ai [&::-webkit-details-marker]:hidden">
                      <span className="group-open:hidden">Show detail ({topic.points.length})</span>
                      <span className="hidden group-open:inline">Hide detail</span>
                    </summary>
                    <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-ink-2 marker:text-line-strong">
                      {topic.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            ))}
          </div>
        </Section>
      )}

      <CtaBand title="Have a workflow an agent should be doing?" />
    </>
  );
}
