import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { expertise, techStack, topologies } from '@/lib/data';
import type { ExpertiseArea } from '@/lib/data';
import { Container, Eyebrow, PageHeader, TagList } from '@/components/ui';
import { CtaBand, DiagramFigure } from '@/components/blocks';

export const metadata: Metadata = {
  title: 'Expertise: cloud, infrastructure & industrial IoT',
  description:
    'Enterprise cloud landing zones, Terraform, Kubernetes, bare-metal virtualisation and zero-trust networking, plus high-throughput industrial telemetry on MQTT and ClickHouse.',
  alternates: { canonical: '/expertise' },
};

const diagramFor: Record<string, string> = {
  cloud: 'multi-cloud-transit-hub',
  iiot: 'sub-50ms-telemetry-lakehouse',
};

function AreaSection({ area, index }: { area: ExpertiseArea; index: number }) {
  const topology = topologies.find((t) => t.id === diagramFor[area.id]);
  const hue = area.id === 'iiot' ? 'text-iiot' : 'text-cloud';
  return (
    <section id={area.id} aria-labelledby={`${area.id}-title`} className="scroll-mt-32 border-t border-line py-16 sm:py-20">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Eyebrow index={String(index + 1).padStart(2, '0')}>
            <span className={hue}>Discipline</span>
          </Eyebrow>
          <h2 id={`${area.id}-title`} className="mt-4 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            {area.title}
          </h2>
        </div>
        <div className="lg:col-span-7 lg:pt-8">
          <p className="text-lg leading-relaxed text-muted">{area.summary}</p>
          <div className="mt-5">
            <TagList label={`${area.title} technologies`} items={area.technologies} />
          </div>
        </div>
      </div>

      {topology && (
        <div className="mt-12">
          <DiagramFigure topology={topology} />
        </div>
      )}

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
        {area.topics.map((topic) => (
          <article key={topic.title} className="bg-paper p-6 sm:p-7">
            <h3 className="font-medium text-ink">{topic.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{topic.description}</p>
            {topic.points.length > 0 && (
              <details className="group mt-4">
                <summary className="inline-flex min-h-11 cursor-pointer list-none items-center text-sm text-accent [&::-webkit-details-marker]:hidden">
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
    </section>
  );
}

export default function ExpertisePage() {
  const areas = expertise.filter((a) => a.id === 'cloud' || a.id === 'iiot');
  const stackByCategory = techStack.reduce<Record<string, typeof techStack>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        eyebrow="Expertise"
        title="The foundations agents and twins run on"
        intro="Edge telemetry feeds the data platform. The data platform feeds the twins and the agents. All of it runs on infrastructure the client owns and can audit."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            { href: '/agents', title: 'Agentic AI & LLMOps', body: 'Agents, gateways, MCP tools, guardrails', cls: 'before:bg-ai' },
            { href: '/twins', title: 'Digital Twins', body: 'Live demos and nine production twins', cls: 'before:bg-twin' },
          ].map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className={`group relative flex items-start justify-between gap-4 overflow-hidden rounded-lg border border-line bg-surface p-5 before:absolute before:inset-y-0 before:left-0 before:w-0.5 hover:bg-sunken ${c.cls}`}
              >
                <span>
                  <span className="block font-medium text-ink">{c.title}</span>
                  <span className="mt-1 block text-sm text-muted">{c.body}</span>
                </span>
                <ArrowUpRight aria-hidden className="h-5 w-5 shrink-0 text-muted group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </PageHeader>

      <nav
        aria-label="Disciplines"
        className="sticky top-16 z-30 border-y border-line bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75"
      >
        <Container className="flex gap-6 overflow-x-auto py-1 text-sm [scrollbar-width:none]">
          {areas.map((a) => (
            <a key={a.id} href={`#${a.id}`} className="inline-flex min-h-11 shrink-0 items-center text-muted hover:text-ink">
              {a.title}
            </a>
          ))}
          <a href="#stack" className="inline-flex min-h-11 shrink-0 items-center text-muted hover:text-ink">
            Technology stack
          </a>
        </Container>
      </nav>

      <Container>
        {areas.map((area, i) => (
          <AreaSection key={area.id} area={area} index={i} />
        ))}

        <section id="stack" aria-labelledby="stack-title" className="scroll-mt-32 border-t border-line py-16 sm:py-20">
          <Eyebrow index="03">Reference</Eyebrow>
          <h2 id="stack-title" className="mt-4 font-serif text-3xl tracking-tight text-ink sm:text-4xl">
            Technology stack
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {Object.entries(stackByCategory).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{category}</h3>
                <dl className="mt-3 divide-y divide-line border-y border-line">
                  {items.map((t) => (
                    <div key={t.technology} className="py-3">
                      <dt className="flex items-baseline justify-between gap-4 text-sm">
                        <span className="font-medium text-ink">{t.technology}</span>
                        <span className="shrink-0 font-mono text-xs text-muted">
                          {t.proficiency} · {t.years} yrs
                        </span>
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-muted">{t.useCase}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      </Container>

      <CtaBand />
    </>
  );
}
