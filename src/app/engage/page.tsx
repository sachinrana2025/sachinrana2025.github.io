import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { engagementTerms, engagements, sprints } from '@/lib/data';
import { mailto, site } from '@/lib/site';
import { ButtonLink, PageHeader, Section } from '@/components/ui';
import { JsonLd } from '@/components/blocks';
import { BriefBuilder } from '@/components/BriefBuilder';

export const metadata: Metadata = {
  title: 'Engage: fractional CTO & architecture advisory',
  description:
    'Fractional CTO retainers, hands-on architecture engagements and fixed-scope delivery sprints with Sachin Rana.',
  alternates: { canonical: '/engage' },
};

const steps = [
  { title: 'Brief and call', body: 'Your brief, then thirty minutes on the problem, constraints and what success looks like. No charge.' },
  { title: 'Written proposal', body: 'Scope, architecture direction, milestones and a fixed or capped price within a few days.' },
  { title: 'Delivery', body: 'Weekly reviews, working software in your repositories, and decisions documented as they are made.' },
  { title: 'Handover', body: 'Runbooks, training and full IP transfer, so your team owns what was built.' },
];

const service = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: `${site.name}: Fractional CTO & Architecture Advisory`,
  url: `${site.url}/engage`,
  email: site.email,
  areaServed: 'Worldwide',
  provider: { '@id': `${site.url}/#person` },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Engagement models',
    itemListElement: [...engagements, ...sprints].map((e) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: e.name },
    })),
  },
};

export default function EngagePage() {
  return (
    <>
      <JsonLd data={service} />
      <PageHeader
        eyebrow="Engage"
        title="Senior architecture, without a full-time hire"
        intro="Ongoing leadership, hands-on delivery, or a specific platform built and handed over. Pick the engagement that fits, or send a brief and I will recommend one."
      >
        <ButtonLink href="#brief">Send a project brief</ButtonLink>
      </PageHeader>

      <Section
        id="brief"
        index="01"
        eyebrow="Start here"
        title="Two-minute project brief"
        intro="Tell me the problem, the timeline and a rough budget. It opens as an email from your own inbox, and you get a first view on approach, timeline and cost back from me."
        tone="surface"
      >
        <BriefBuilder />
      </Section>

      <Section id="retainers" index="02" eyebrow="Ongoing" title="Monthly engagements">
        <div className="grid gap-6 lg:grid-cols-3">
          {engagements.map((e, i) => (
            <article
              key={e.name}
              className={`flex flex-col rounded-lg border p-7 sm:p-8 ${i === 1 ? 'border-ink' : 'border-line'} bg-surface`}
            >
              <h3 className="font-serif text-2xl text-ink">{e.name}</h3>
              <p className="mt-1 text-sm text-muted">{e.commitment}</p>
              <p className="mt-6">
                <span className="font-serif text-4xl tracking-tight text-ink">{e.price}</span>{' '}
                <span className="text-sm text-muted">{e.cadence}</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-ink-2">
                {e.scope.map((s) => (
                  <li key={s} className="flex gap-3">
                    <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-5 text-sm text-muted">
                <span className="font-medium text-ink">Ideal for: </span>
                {e.idealFor}
              </p>
              <div className="mt-auto pt-7">
                <ButtonLink href={mailto(`Enquiry: ${e.name}`)} variant={i === 1 ? 'primary' : 'secondary'}>
                  Discuss this engagement
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="sprints"
        index="03"
        eyebrow="Fixed scope"
        title="Delivery sprints"
        intro="Defined deliverables, a fixed timeline and a price agreed up front. Final pricing depends on scope and is confirmed in the proposal."
        
      >
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-3">
          {sprints.map((s) => (
            <article key={s.name} className="flex flex-col bg-surface p-7">
              <h3 className="font-serif text-xl leading-snug text-ink">{s.name}</h3>
              <p className="mt-4 flex items-baseline justify-between gap-3 border-y border-line py-3 text-sm">
                <span className="font-medium text-ink">{s.price}</span>
                <span className="text-muted">{s.turnaround}</span>
              </p>
              <ul className="mt-5 list-disc space-y-2 pl-4 text-sm leading-relaxed text-ink-2 marker:text-line-strong">
                {s.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <ButtonLink href={mailto(`Sprint enquiry: ${s.name}`)} variant="text">
                  Request a proposal
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="process" index="04" eyebrow="Process" title="How an engagement runs" tone="surface">
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-ink pt-5">
              <span className="font-mono text-xs text-accent">Step {i + 1}</span>
              <h3 className="mt-2 font-medium text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="terms" index="05" eyebrow="Terms" title="Commercial terms">
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {engagementTerms.map((t) => (
            <div key={t.label} className="border-t border-line pt-4">
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{t.label}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-ink-2">{t.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <section id="contact" aria-labelledby="contact-title" className="border-t border-line bg-ink text-paper">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="contact-title" className="font-serif text-4xl leading-tight tracking-tight">
              Start with a conversation.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed opacity-80">
              Send a few lines on what you are building and where it hurts. You will get a reply from me
              directly, not from a sales team.
            </p>
          </div>
          <ul className="space-y-4 text-sm lg:col-span-5 lg:pt-3">
            <li>
              <a href={mailto('Scoping call request')} className="block rounded-md bg-paper px-5 py-4 font-medium text-ink hover:opacity-90">
                Email {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border border-paper/30 px-5 py-4 font-medium hover:border-paper"
              >
                Message on LinkedIn
              </a>
            </li>
            <li>
              <a href={site.cv} download="Sachin_Rana_CV.pdf" className="block rounded-md border border-paper/30 px-5 py-4 font-medium hover:border-paper">
                Download CV (PDF)
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
