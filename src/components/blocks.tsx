import type { CaseStudy, ComplianceItem, Hue, Topology } from '@/lib/data';

export const hueText: Record<Hue, string> = { ai: 'text-ai', cloud: 'text-cloud', iiot: 'text-iiot', twin: 'text-twin' };
export const hueBorder: Record<Hue, string> = {
  ai: 'border-ai',
  cloud: 'border-cloud',
  iiot: 'border-iiot',
  twin: 'border-twin',
};
import Link from 'next/link';
import { mailto, site } from '@/lib/site';
import { ButtonLink, Container, TagList } from './ui';

export function MetricStrip({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
      {items.map((m, i) => (
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
            <span className="block font-serif text-4xl tracking-tight text-ink sm:text-5xl">{m.value}</span>
            <span className="mt-2 block max-w-[16rem] text-sm leading-snug text-muted">{m.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseStudyCard({ study, index, full = false }: { study: CaseStudy; index: number; full?: boolean }) {
  return (
    <article
      id={study.id}
      className="scroll-mt-24 grid gap-8 border-t border-line py-10 first:border-t-0 first:pt-0 lg:grid-cols-12"
    >
      <div className="lg:col-span-4">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
          <span className={hueText[study.hue]}>{String(index + 1).padStart(2, '0')}</span> ·{' '}
          <span className={hueText[study.hue]}>{study.domain}</span>
        </p>
        <h3 className="mt-3 font-serif text-2xl leading-snug text-ink">{study.title}</h3>
        <p className="mt-3 text-sm text-muted">{study.client}</p>
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2" aria-label="Key results">
          {study.metrics.map((m) => (
            <li key={m} className={`border-l-2 ${hueBorder[study.hue]} pl-2 text-sm font-medium text-ink`}>
              {m}
            </li>
          ))}
        </ul>
      </div>
      <dl className="grid gap-6 text-[15px] leading-relaxed sm:grid-cols-3 lg:col-span-8">
        <div>
          <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Challenge</dt>
          <dd className="mt-2 text-ink-2">{study.challenge}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Approach</dt>
          <dd className="mt-2 text-ink-2">
            {full && study.approach.length > 1 ? (
              <ul className="space-y-2">
                {study.approach.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            ) : (
              study.approach[0]
            )}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Outcome</dt>
          <dd className="mt-2 text-ink">{study.outcome}</dd>
        </div>
      </dl>
    </article>
  );
}

export function DiagramFigure({ topology, priority = false }: { topology: Topology; priority?: boolean }) {
  const { diagram } = topology;
  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-[#090d16]">
      {/* Static SVG plates; served as images so they add no JS to the page. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={diagram.src}
        alt={diagram.alt}
        width={diagram.width}
        height={diagram.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-line bg-surface px-4 py-3 text-xs text-muted">
        {topology.title}. Reference topology; client specifics and addressing omitted.
      </figcaption>
    </figure>
  );
}

export function TopologyBlock({ topology, index }: { topology: Topology; index: number }) {
  return (
    <article id={topology.id} className="scroll-mt-24 grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-12">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
          <span className="text-accent">{String(index + 1).padStart(2, '0')}</span> · {topology.domain}
        </p>
        <h3 className="mt-3 max-w-3xl font-serif text-2xl leading-snug text-ink sm:text-3xl">{topology.title}</h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">{topology.description}</p>
      </div>
      <div className="lg:col-span-8">
        <DiagramFigure topology={topology} />
      </div>
      <div className="space-y-6 lg:col-span-4">
        <dl className="divide-y divide-line border-y border-line">
          {topology.specs.map((s) => (
            <div key={s.label} className="flex justify-between gap-4 py-3 text-sm">
              <dt className="text-muted">{s.label}</dt>
              <dd className="text-right font-medium text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="space-y-3 text-sm">
          {topology.subsystems.map((s) => (
            <li key={s.name}>
              <span className="font-medium text-ink">{s.name}.</span>{' '}
              <span className="text-muted">{s.details}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function ComplianceTable({ items }: { items: ComplianceItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          Compliance frameworks with the architectural controls and evidence used to meet them
        </caption>
        <thead className="hidden bg-sunken md:table-header-group">
          <tr className="text-xs uppercase tracking-[0.1em] text-muted">
            <th scope="col" className="w-[26%] px-5 py-3 font-mono font-normal">Framework</th>
            <th scope="col" className="px-5 py-3 font-mono font-normal">Architectural evidence</th>
            <th scope="col" className="w-[30%] px-5 py-3 font-mono font-normal">Key controls</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="block border-t border-line first:border-t-0 md:table-row">
              <th scope="row" className="block px-5 pt-5 align-top font-normal md:table-cell md:py-5">
                <span className="block font-semibold text-ink">{c.framework}</span>
                <span className="mt-1 block text-xs text-muted">
                  {c.governing_body} · {c.category}
                </span>
              </th>
              <td className="block px-5 pt-3 align-top leading-relaxed text-ink-2 md:table-cell md:py-5">
                {c.architectural_evidence}
              </td>
              <td className="block px-5 pb-5 pt-3 align-top md:table-cell md:py-5">
                <ul className="list-disc space-y-1 pl-4 text-muted marker:text-line-strong">
                  {c.controls.slice(0, 3).map((ctl) => (
                    <li key={ctl}>{ctl}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComplianceStrip({ items }: { items: ComplianceItem[] }) {
  return <TagList label="Compliance frameworks" items={items.map((c) => c.framework)} />;
}

export function CtaBand({
  title = 'Got a problem an agent, a twin or a better platform could solve?',
  body = 'Send a two-minute brief. You get a reply from me with a first view on approach, timeline and cost.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="border-t border-line bg-ink text-paper">
      <Container className="grid gap-8 py-16 sm:py-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 id="cta-title" className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed opacity-80">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <Link
            href={site.brief}
            className="inline-flex items-center rounded-md bg-paper px-5 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            Send a project brief
          </Link>
          <a
            href={mailto('Enquiry from your profile')}
            className="inline-flex items-center rounded-md border border-paper/30 px-5 py-3 text-sm font-medium text-paper transition-colors hover:border-paper"
          >
            Email directly
          </a>
        </div>
      </Container>
    </section>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be inlined as raw text; content is static and escaped below.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export { ButtonLink };
