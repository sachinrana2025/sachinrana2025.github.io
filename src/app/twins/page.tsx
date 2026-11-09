import type { Metadata } from 'next';
import { expertise, topologies, twinPilot, twins } from '@/lib/data';
import { briefHref } from '@/lib/site';
import { ButtonLink, PageHeader, Section, TagList } from '@/components/ui';
import { CtaBand, DiagramFigure } from '@/components/blocks';
import { TwinValue } from '@/components/twins/TwinValue';
import { Reveal } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Digital twins',
  description:
    'Physics-informed digital twins built for one client plant at a time: health per component, faults blamed correctly and energy lost priced against a healthy baseline. Nine in production across data centers, substations, cold storage, chillers and microgrids.',
  alternates: { canonical: '/twins' },
};

export default function TwinsPage() {
  const area = expertise.find((e) => e.id === 'twins');
  const loop = topologies.find((t) => t.id === 'physics-digital-twins');

  return (
    <>
      <PageHeader
        eyebrow="Digital twins"
        title={
          <>
            A model of your plant that <em className="italic text-twin">tells you what is wrong.</em>
          </>
        }
        intro="Each twin is built for one client's plant, on their data, and it stays theirs. That is why there are no public demos here. Below is what a twin does, how an engagement runs, and the platforms delivered so far."
      >
        <ButtonLink href={briefHref('twin')}>Get a twin of your plant</ButtonLink>
      </PageHeader>

      <Section id="value" index="01" eyebrow="Why a twin" title="What a twin gives your operations team">
        <TwinValue />
        {loop && (
          <div className="mt-12">
            <DiagramFigure topology={loop} />
          </div>
        )}
      </Section>

      <Section
        id="engagement"
        index="02"
        eyebrow="Engagement"
        title={twinPilot.name}
        intro={`${twinPilot.summary} ${twinPilot.price}, ${twinPilot.duration}.`}
        tone="surface"
      >
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {twinPilot.steps.map((step, i) => (
            <li key={step} className="border-t-2 border-twin pt-5">
              <Reveal delay={i * 60}>
                <span className="font-mono text-xs text-twin">Step {i + 1}</span>
                <p className="mt-2 font-medium leading-snug text-ink">{step}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <ButtonLink href={briefHref('twin')} variant="text">
            Scope a twin pilot for your plant
          </ButtonLink>
        </div>
      </Section>

      <Section
        id="production"
        index="03"
        eyebrow="In production"
        title="Nine production twins"
        intro={area?.summary}
      >
        {area && (
          <div className="mb-8">
            <TagList label="Twin platform technologies" items={area.technologies} />
          </div>
        )}
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface sm:hidden" aria-label="Production digital twins">
          {twins.map((t) => (
            <li key={t.id} className="p-4">
              <p className="font-medium text-ink">{t.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{t.scale}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`${t.name} modeled KPIs`}>
                {t.kpis.map((k) => (
                  <li key={k} className="rounded border border-line bg-sunken px-2 py-0.5 text-xs text-ink-2">
                    {k}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto rounded-lg border border-line sm:block">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">Inventory of production digital twins</caption>
            <thead className="bg-sunken text-xs uppercase tracking-[0.1em] text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-mono font-normal">Twin</th>
                <th scope="col" className="px-5 py-3 font-mono font-normal">Scale</th>
                <th scope="col" className="px-5 py-3 font-mono font-normal">Modeled KPIs</th>
              </tr>
            </thead>
            <tbody>
              {twins.map((t) => (
                <tr key={t.id} className="border-t border-line align-top">
                  <th scope="row" className="px-5 py-4 font-medium text-ink">{t.name}</th>
                  <td className="px-5 py-4 text-muted">{t.scale}</td>
                  <td className="px-5 py-4 text-ink-2">
                    <ul className="space-y-1">
                      {t.kpis.map((k) => (
                        <li key={k}>{k}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <CtaBand title="Want your plant to tell you what is wrong with it?" />
    </>
  );
}
