'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { mailto, site } from '@/lib/site';
import type { BriefArea } from '@/lib/agentScenarios';

const AREAS: { id: BriefArea; label: string }[] = [
  { id: 'ai', label: 'Agentic AI / LLMOps' },
  { id: 'cloud', label: 'Cloud cost & platform' },
  { id: 'twin', label: 'Digital twin' },
  { id: 'iiot', label: 'IIoT & telemetry' },
  { id: 'compliance', label: 'Security & compliance' },
  { id: 'cto', label: 'Fractional CTO' },
];
const TIMELINES = ['ASAP', 'This month', 'This quarter', 'Exploring'];
const BUDGETS = ['Under $10k', '$10k – $25k', '$25k – $60k', '$60k+', 'Not sure yet'];

const DRAFT_KEY = 'profile-brief-draft';

interface Draft {
  areas: BriefArea[];
  timeline: string;
  budget: string;
  name: string;
  company: string;
  problem: string;
}

const empty: Draft = { areas: [], timeline: '', budget: '', name: '', company: '', problem: '' };

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-sm transition-colors ${
        selected ? 'border-ink bg-ink text-paper' : 'border-line-strong bg-surface text-ink-2 hover:border-ink'
      }`}
    >
      {children}
    </button>
  );
}

export function BriefBuilder() {
  const [d, setD] = useState<Draft>(empty);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let draft = empty;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) draft = { ...empty, ...(JSON.parse(raw) as Partial<Draft>) };
    } catch {
      // storage unavailable: start empty
    }
    const area = new URLSearchParams(window.location.search).get('area') as BriefArea | null;
    if (area && AREAS.some((a) => a.id === area) && !draft.areas.includes(area)) {
      draft = { ...draft, areas: [area, ...draft.areas] };
    }
    setD(draft);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch {
      // ignore
    }
  }, [d, loaded]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }));
  const toggleArea = (id: BriefArea) =>
    set('areas', d.areas.includes(id) ? d.areas.filter((a) => a !== id) : [...d.areas, id]);

  const areaLabels = d.areas.map((a) => AREAS.find((x) => x.id === a)?.label ?? a);
  const subject = `Project brief${areaLabels.length ? `: ${areaLabels.join(', ')}` : ''}${d.company ? ` · ${d.company}` : ''}`;

  const body = [
    `Hi Sachin,`,
    ``,
    d.problem.trim() || '[What are you trying to solve?]',
    ``,
    `Area: ${areaLabels.join(', ') || '—'}`,
    `Timeline: ${d.timeline || '—'}`,
    `Budget: ${d.budget || '—'}`,
    ``,
    `${d.name || '[Your name]'}${d.company ? `, ${d.company}` : ''}`,
  ].join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${site.email}\nSubject: ${subject}\n\n${body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const ready = d.problem.trim().length > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-7 lg:col-span-7">
        <fieldset>
          <legend className="text-sm font-medium text-ink">1. What do you need help with?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <Chip key={a.id} selected={d.areas.includes(a.id)} onClick={() => toggleArea(a.id)}>
                {a.label}
              </Chip>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="brief-problem" className="text-sm font-medium text-ink">
            2. Describe the problem in a few lines
          </label>
          <textarea
            id="brief-problem"
            rows={5}
            value={d.problem}
            onChange={(e) => set('problem', e.target.value)}
            placeholder="e.g. Our support team answers the same 30 questions every day. We want an AI agent that drafts answers from our docs, with a human approving anything risky."
            className="mt-3 w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none"
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-ink">3. When do you want to start?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {TIMELINES.map((t) => (
              <Chip key={t} selected={d.timeline === t} onClick={() => set('timeline', d.timeline === t ? '' : t)}>
                {t}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-ink">4. Budget range</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <Chip key={b} selected={d.budget === b} onClick={() => set('budget', d.budget === b ? '' : b)}>
                {b}
              </Chip>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="brief-name" className="text-sm font-medium text-ink">
              Your name
            </label>
            <input
              id="brief-name"
              value={d.name}
              onChange={(e) => set('name', e.target.value)}
              autoComplete="name"
              className="mt-2 w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-[15px] text-ink focus:border-ink focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="brief-company" className="text-sm font-medium text-ink">
              Company
            </label>
            <input
              id="brief-company"
              value={d.company}
              onChange={(e) => set('company', e.target.value)}
              autoComplete="organization"
              className="mt-2 w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-[15px] text-ink focus:border-ink focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-24 rounded-lg border border-line bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Your brief</p>
          <p className="mt-3 text-sm text-muted">
            To: <span className="text-ink">{site.email}</span>
          </p>
          <p className="mt-1 text-sm font-medium text-ink">{subject}</p>
          <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-sunken p-3 font-sans text-[13px] leading-relaxed text-ink-2">
            {body}
          </pre>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={mailto(subject, body)}
              aria-disabled={!ready}
              onClick={(e) => {
                if (!ready) {
                  e.preventDefault();
                  document.getElementById('brief-problem')?.focus();
                }
              }}
              className={`inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium ${
                ready ? 'bg-ink text-paper hover:bg-ink-2' : 'cursor-not-allowed bg-line text-muted'
              }`}
            >
              <Mail aria-hidden className="h-4 w-4" /> Open in email
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-3 text-sm font-medium text-ink hover:border-ink"
            >
              {copied ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy brief'}
            </button>
          </div>
          {!ready && <p className="mt-3 text-xs text-muted">Add a line about the problem to send it.</p>}
          <p className="mt-4 text-xs text-muted">
            Nothing is sent from this page. Your draft stays in this browser until you send it from your own email.
          </p>
        </div>
      </div>
    </div>
  );
}
