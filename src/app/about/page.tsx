import type { Metadata } from 'next';
import { career, profile } from '@/lib/data';
import { site } from '@/lib/site';
import { ButtonLink, PageHeader, Section, TagList } from '@/components/ui';
import { CtaBand } from '@/components/blocks';

export const metadata: Metadata = {
  title: 'About & career',
  description:
    'Career of Sachin Rana: from IoT firmware and industrial gateways through EY and TCS to infrastructure leadership at Brick AI.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="From firmware to the boardroom"
        intro={profile.summary}
      >
        <div className="flex flex-wrap items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profile/sachin_rana.webp"
            alt="Portrait of Sachin Rana"
            width={800}
            height={800}
            className="h-28 w-28 rounded-lg border border-line object-cover object-top sm:h-32 sm:w-32"
          />
          <ButtonLink href={site.brief}>Send a project brief</ButtonLink>
          <ButtonLink href={site.cv} download variant="secondary">
            Download CV (PDF)
          </ButtonLink>
          <ButtonLink href={site.linkedin} external variant="secondary">
            LinkedIn
          </ButtonLink>
        </div>
      </PageHeader>

      <Section id="career" index="01" eyebrow="Career" title="Roles and responsibilities" intro={career.overview}>
        <ol className="relative">
          {career.roles.map((r) => (
            <li key={`${r.company}-${r.period}`} className="grid gap-4 border-t border-line py-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">{r.period}</p>
                <h3 className="mt-2 font-serif text-xl text-ink">{r.role}</h3>
                <p className="mt-1 text-sm text-ink-2">{r.company}</p>
                <p className="mt-1 text-xs text-muted">{r.location}</p>
              </div>
              <div className="lg:col-span-8">
                <ul className="list-disc space-y-2 pl-4 text-[15px] leading-relaxed text-ink-2 marker:text-line-strong">
                  {r.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <div className="mt-4">
                  <TagList label={`Technologies at ${r.company}`} items={r.technologies} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="projects" index="02" eyebrow="Projects" title="Notable standalone engagements" tone="surface">
        <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
          {career.projects.map((p) => (
            <li key={p.name} className="bg-surface p-7">
              <h3 className="font-medium text-ink">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.objective}</p>
              <p className="mt-3 text-sm text-ink-2">
                <span className="text-muted">Role: </span>
                {p.role}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="education" index="03" eyebrow="Education" title="Training">
        <ul className="divide-y divide-line border-y border-line">
          {profile.education.map((e) => (
            <li key={e.degree} className="grid gap-1 py-5 sm:grid-cols-12">
              <span className="font-mono text-xs text-muted sm:col-span-3">{e.period}</span>
              <span className="text-ink sm:col-span-9">
                <span className="font-medium">{e.degree}</span>
                {e.field ? `, ${e.field}` : ''}
                <span className="block text-sm text-muted">{e.institution}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}
