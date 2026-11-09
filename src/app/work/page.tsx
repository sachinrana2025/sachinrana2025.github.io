import type { Metadata } from 'next';
import { caseStudies, compliance, topologies } from '@/lib/data';
import { PageHeader, Section } from '@/components/ui';
import { CaseStudyCard, ComplianceTable, CtaBand, TopologyBlock } from '@/components/blocks';

export const metadata: Metadata = {
  title: 'Work: case studies & reference architectures',
  description:
    'Case studies in cloud cost reduction, zero-trust migration, SCADA telemetry and data migration, plus four reference architectures and a twelve-framework compliance matrix.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Case studies and the architectures behind them"
        intro="Five engagements, written up as challenge, approach and outcome. Below them are the reference architectures I reuse, and how each one maps to compliance controls."
      >
        <nav aria-label="On this page" className="flex flex-wrap gap-x-6 text-sm">
          <a href="#case-studies" className="inline-flex min-h-11 items-center text-accent hover:underline underline-offset-4">Case studies</a>
          <a href="#architectures" className="inline-flex min-h-11 items-center text-accent hover:underline underline-offset-4">Reference architectures</a>
          <a href="#compliance" className="inline-flex min-h-11 items-center text-accent hover:underline underline-offset-4">Compliance matrix</a>
        </nav>
      </PageHeader>

      <Section
        id="case-studies"
        index="01"
        eyebrow="Case studies"
        title="Engagement outcomes"
        intro="Clients are described by profile, not name. Every engagement ran under mutual NDA."
      >
        {caseStudies.map((s, i) => (
          <CaseStudyCard key={s.id} study={s} index={i} full />
        ))}
      </Section>

      <Section
        id="architectures"
        index="02"
        eyebrow="Reference architectures"
        title="Four production topologies"
        intro="Generalized versions of systems running in production. Addressing, hostnames and client identifiers have been removed."
        tone="surface"
      >
        <div className="space-y-20">
          {topologies.map((t, i) => (
            <TopologyBlock key={t.id} topology={t} index={i} />
          ))}
        </div>
      </Section>

      <Section
        id="compliance"
        index="03"
        eyebrow="Compliance"
        title="Twelve frameworks, mapped to controls"
        intro="These are architectural readiness mappings, not certifications I hold. Each row shows the evidence a client's auditor can trace in the delivered system."
      >
        <ComplianceTable items={compliance} />
      </Section>

      <CtaBand title="Want this kind of outcome on your platform?" />
    </>
  );
}
