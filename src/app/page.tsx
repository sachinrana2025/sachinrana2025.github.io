import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies, compliance, expertise, headlineMetrics, techStack } from '@/lib/data';
import type { Hue } from '@/lib/data';
import { site } from '@/lib/site';
import { ButtonLink, Container, Eyebrow, Section, TagList } from '@/components/ui';
import { CaseStudyCard, ComplianceStrip, CtaBand } from '@/components/blocks';
import { SystemCanvas } from '@/components/SystemCanvas';
import { AgentConsole } from '@/components/agents/AgentConsole';
import { TwinValue } from '@/components/twins/TwinValue';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { Marquee } from '@/components/motion/Marquee';

export const metadata = {
  alternates: { canonical: '/' },
};

const areas: { id: string; href: string; hue: Hue; label: string }[] = [
  { id: 'ai', href: '/agents', hue: 'ai', label: 'Agents that reason, call tools and ask before they act.' },
  { id: 'twins', href: '/twins', hue: 'twin', label: 'Live models of real plant that find faults on their own.' },
  { id: 'iiot', href: '/expertise#iiot', hue: 'iiot', label: 'Field data captured without loss and queried in milliseconds.' },
  { id: 'cloud', href: '/expertise#cloud', hue: 'cloud', label: 'Platforms you own, secured and costed like a CFO would want.' },
];

const hueTop: Record<Hue, string> = {
  ai: 'before:bg-ai',
  twin: 'before:bg-twin',
  iiot: 'before:bg-iiot',
  cloud: 'before:bg-cloud',
};

export default function HomePage() {
  const featured = caseStudies.slice(0, 3);
  const stack = Array.from(new Set(techStack.map((t) => t.technology.replace(/\s*\(.*\)$/, ''))));

  return (
    <>
      <header className="relative overflow-hidden">
        <div aria-hidden className="blueprint absolute inset-0 [mask-image:linear-gradient(to_bottom,black_30%,transparent)]" />
        <Container className="relative grid gap-12 pb-14 pt-14 sm:pt-20 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <Eyebrow>{site.role}</Eyebrow>
            <h1 className="mt-6 font-serif text-[2.6rem] leading-[1.03] tracking-tight text-ink sm:text-6xl">
              AI agents that <em className="italic text-ai">solve real problems</em>, on systems you own.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              I design and ship agentic AI systems end to end: the agents, the data pipelines that feed them, the
              digital twins they reason over, and the infrastructure they run on. One accountable architect, from
              sensor to decision.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={site.brief}>Send a project brief</ButtonLink>
              <ButtonLink href="#agent-demo" variant="secondary">
                Try the agent demo
              </ButtonLink>
            </div>
            <div className="mt-8 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/profile/sachin_rana.webp"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-line object-cover object-top"
              />
              <p className="text-sm leading-snug text-muted">
                <span className="block font-medium text-ink">{site.name}</span>
                {site.current.role} at {site.current.company} · {site.location}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <SystemCanvas />
          </div>
        </Container>

        <Container className="relative pb-4">
          <dl className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
            {headlineMetrics.map((m, i) => (
              <div
                key={m.label}
                className={[
                  'px-1 py-7 sm:px-6',
                  i % 2 === 1 ? 'border-l border-line' : '',
                  i >= 2 ? 'border-t border-line lg:border-t-0' : '',
                  i === 2 ? 'lg:border-l' : '',
                ].join(' ')}
              >
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="block font-serif text-4xl tracking-tight text-ink sm:text-5xl">
                    <CountUp value={m.value} />
                  </span>
                  <span className="mt-2 block max-w-[16rem] text-sm leading-snug text-muted">{m.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </header>

      <Section
        id="agent-demo"
        index="01"
        eyebrow="Agentic AI"
        title={
          <>
            Pick a problem. <span className="text-ai">Watch the agent work it.</span>
          </>
        }
        intro="This is how my agent systems reason through a real request: plan, call tools against live data, stop at a guardrail for a person to approve, then act. Each walkthrough maps to delivered work."
      >
        <Reveal>
          <AgentConsole />
        </Reveal>
        <div className="mt-6">
          <ButtonLink href="/agents" variant="text">
            How I build agents: gateway, tools, memory, guardrails
          </ButtonLink>
        </div>
      </Section>

      <Section
        id="digital-twins"
        index="02"
        eyebrow="Digital twins"
        title={
          <>
            Not a dashboard. <span className="text-twin">A model that finds faults.</span>
          </>
        }
        intro="A physics-informed twin judges every reading against a healthy plant, blames each fault on its own component and prices the energy lost. Each one is built for, and owned by, the client."
        tone="surface"
      >
        <TwinValue />
        <div className="mt-6">
          <ButtonLink href="/twins" variant="text">
            How a twin engagement runs, and the nine in production
          </ButtonLink>
        </div>
      </Section>

      <Section
        id="work"
        index="03"
        eyebrow="Selected work"
        title="Outcomes clients paid for"
        intro="Client names are withheld under NDA. Figures describe the delivered production systems."
      >
        <div>
          {featured.map((s, i) => (
            <Reveal key={s.id}>
              <CaseStudyCard study={s} index={i} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/work" variant="text">
            All case studies and animated reference architectures
          </ButtonLink>
        </div>
      </Section>

      <Section
        id="disciplines"
        index="04"
        eyebrow="End to end"
        title="Four disciplines, one accountable architect"
        intro="Clients come in for one and stay because they connect. Telemetry feeds the twins, the twins feed the agents, and all of it runs on infrastructure you control."
        tone="surface"
      >
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {areas.map((a) => {
            const area = expertise.find((e) => e.id === a.id);
            if (!area) return null;
            return (
              <Link
                key={a.id}
                href={a.href}
                className={`group relative flex flex-col bg-surface p-7 transition-colors before:absolute before:inset-x-0 before:top-0 before:h-0.5 hover:bg-sunken ${hueTop[a.hue]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-2xl text-ink">{area.title}</h3>
                  <ArrowUpRight aria-hidden className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </div>
                <p className="mt-2 text-[15px] font-medium text-ink-2">{a.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{area.summary}</p>
                <div className="mt-6">
                  <TagList label={`${area.title} technologies`} items={area.technologies.slice(0, 6)} />
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <Marquee label="Technologies in production use" items={stack} />

      <Section
        id="compliance"
        index="05"
        eyebrow="Governance"
        title="Built to pass audit, not just demo"
        intro="Agents and platforms are designed against twelve regulatory and security frameworks, from SOC 2 and HIPAA to IEC 62443 and the EU AI Act. Each maps to concrete controls."
      >
        <ComplianceStrip items={compliance} />
        <div className="mt-8">
          <ButtonLink href="/work#compliance" variant="text">
            See the control evidence for each framework
          </ButtonLink>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
