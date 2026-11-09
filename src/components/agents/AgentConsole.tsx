'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Pause, Play, RotateCcw, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { agentScenarios, type AgentStep } from '@/lib/agentScenarios';
import { briefHref } from '@/lib/site';

const STEP_MS: Record<AgentStep['kind'], number> = {
  plan: 1500,
  tool: 1300,
  guardrail: 1700,
  decision: 1400,
};

function StepIcon({ kind }: { kind: AgentStep['kind'] }) {
  const cls = 'h-3.5 w-3.5';
  if (kind === 'plan') return <Sparkles aria-hidden className={cls} />;
  if (kind === 'tool') return <Wrench aria-hidden className={cls} />;
  if (kind === 'guardrail') return <ShieldCheck aria-hidden className={cls} />;
  return <Check aria-hidden className={cls} />;
}

const kindLabel: Record<AgentStep['kind'], string> = {
  plan: 'Plan',
  tool: 'Tool call',
  guardrail: 'Guardrail',
  decision: 'Decision',
};

export function AgentConsole({ initial = 0, compact = false }: { initial?: number; compact?: boolean }) {
  const [index, setIndex] = useState(initial);
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const scenario = agentScenarios[index];
  const total = scenario.steps.length;
  const done = shown >= total;

  useEffect(() => {
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(r);
    if (r) {
      setShown(agentScenarios[initial].steps.length);
      return;
    }
    // Start playing only once the console is on screen.
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !startedRef.current) {
        startedRef.current = true;
        setPlaying(true);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [initial]);

  useEffect(() => {
    if (!playing || done) {
      if (done) setPlaying(false);
      return;
    }
    const next = scenario.steps[shown];
    const id = window.setTimeout(() => setShown((s) => s + 1), STEP_MS[next.kind] / speed);
    return () => window.clearTimeout(id);
  }, [playing, shown, done, scenario, speed]);

  const choose = (i: number) => {
    setIndex(i);
    if (reduced) {
      setShown(agentScenarios[i].steps.length);
    } else {
      setShown(0);
      setPlaying(true);
    }
  };

  const replay = () => {
    setShown(0);
    setPlaying(true);
  };

  const running = playing && !done ? scenario.steps[shown] : undefined;
  const latest = shown > 0 ? scenario.steps[shown - 1] : undefined;

  return (
    <div
      ref={rootRef}
      className="stage-grid overflow-hidden rounded-xl border border-stage-line text-stage-ink shadow-[0_30px_80px_-40px_rgba(9,13,22,0.6)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stage-line bg-stage-2/80 px-4 py-3">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-stage-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-stage-ai" aria-hidden />
          Agent trace · simulated walkthrough
        </p>
        <div className="flex items-center gap-1.5">
          {!reduced && (
            <>
              <button
                type="button"
                onClick={() => (done ? replay() : setPlaying((p) => !p))}
                aria-label={done ? 'Replay walkthrough' : playing ? 'Pause walkthrough' : 'Play walkthrough'}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-stage-line text-stage-muted hover:text-stage-ink"
              >
                {done ? (
                  <RotateCcw aria-hidden className="h-3.5 w-3.5" />
                ) : playing ? (
                  <Pause aria-hidden className="h-3.5 w-3.5" />
                ) : (
                  <Play aria-hidden className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
                aria-label={`${speed}× speed, switch to ${speed === 1 ? 2 : 1}×`}
                className="inline-flex h-8 min-w-10 items-center justify-center rounded-md border border-stage-line px-2 font-mono text-xs text-stage-muted hover:text-stage-ink"
              >
                {speed}×
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={
          compact
            ? 'grid grid-cols-[minmax(0,1fr)]'
            : 'grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]'
        }
      >
        <div
          role="group"
          aria-label="Pick a problem"
          className={
            compact
              ? 'flex gap-2 overflow-x-auto border-b border-stage-line p-3 [scrollbar-width:none]'
              : 'flex gap-2 overflow-x-auto border-b border-stage-line p-3 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-4'
          }
        >
          <p className={compact ? 'sr-only' : 'hidden px-1 pb-1 text-xs text-stage-muted lg:block'}>Pick a problem</p>
          {agentScenarios.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={i === index}
              onClick={() => choose(i)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                i === index
                  ? 'border-stage-ai bg-stage-ai/10 text-stage-ink'
                  : 'border-stage-line text-stage-muted hover:border-stage-muted hover:text-stage-ink'
              }`}
            >
              “{s.problem}”
            </button>
          ))}
        </div>

        <div className="min-w-0 p-4 sm:p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-stage-ai">Goal</p>
          <p className="mt-1 text-[15px] leading-relaxed">{scenario.goal}</p>

          <ol className={`mt-5 space-y-3 ${compact ? 'min-h-[18rem]' : 'min-h-[24rem]'}`}>
            {scenario.steps.slice(0, shown).map((step, i) => (
              <li
                key={`${scenario.id}-${i}`}
                className="animate-[fade-up_0.35s_ease-out_both] rounded-lg border border-stage-line bg-stage-2/70 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${
                        step.kind === 'guardrail'
                          ? 'bg-stage-iiot/15 text-stage-iiot'
                          : step.kind === 'decision'
                            ? 'bg-stage-twin/15 text-stage-twin'
                            : 'bg-stage-ai/15 text-stage-ai'
                      }`}
                    >
                      <StepIcon kind={step.kind} />
                    </span>
                    <span>{step.title}</span>
                  </p>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-stage-muted">
                    {step.kind === 'tool' ? `${step.ms} ms` : kindLabel[step.kind]}
                  </span>
                </div>

                {step.kind === 'plan' && (
                  <ol className="mt-2 list-decimal space-y-1 pl-9 text-[13px] text-stage-muted">
                    {step.detail.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ol>
                )}
                {step.kind === 'tool' && (
                  <div className="mt-2 space-y-1.5 pl-8 text-[13px]">
                    <p className="overflow-x-auto whitespace-nowrap font-mono text-[12px] [scrollbar-width:thin]">
                      <span className="text-stage-cloud">{step.tool}</span>
                      <span className="text-stage-muted">({step.args})</span>
                    </p>
                    <p className="text-stage-ink/90">
                      <span className="text-stage-twin">→</span> {step.result}
                    </p>
                  </div>
                )}
                {step.kind === 'guardrail' && (
                  <div className="mt-2 pl-8 text-[13px]">
                    <p className="text-stage-muted">{step.detail}</p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 rounded border border-stage-iiot/40 px-2 py-0.5 font-mono text-[11px] text-stage-iiot">
                      <Check aria-hidden className="h-3 w-3" /> {step.approver}
                    </p>
                  </div>
                )}
                {step.kind === 'decision' && <p className="mt-2 pl-8 text-[13px] text-stage-ink/90">{step.detail}</p>}
              </li>
            ))}

            {running && (
              <li className="flex items-center gap-3 rounded-lg border border-dashed border-stage-line px-3 py-2.5 text-sm text-stage-muted">
                <span className="relative h-1 w-16 overflow-hidden rounded bg-stage-line" aria-hidden>
                  <span className="absolute inset-y-0 left-0 w-1/2 animate-[scan_1s_linear_infinite] rounded bg-stage-ai/70" />
                </span>
                {running.kind === 'tool' ? `Calling ${running.tool}…` : `${kindLabel[running.kind]}…`}
              </li>
            )}
          </ol>

          {done && (
            <div className="mt-5 animate-[fade-up_0.45s_ease-out_both] rounded-lg border border-stage-twin/50 bg-stage-twin/[0.07] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-stage-twin">Outcome</p>
              <p className="mt-1 font-serif text-2xl leading-snug">{scenario.outcome.headline}</p>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Results">
                {scenario.outcome.metrics.map((m) => (
                  <li key={m} className="rounded border border-stage-line bg-stage px-2 py-0.5 text-[13px]">
                    {m}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-stage-muted">{scenario.outcome.source}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={briefHref(scenario.area)}
                  className="inline-flex items-center gap-2 rounded-md bg-stage-ink px-4 py-2 text-sm font-medium text-stage hover:opacity-90"
                >
                  Solve this for my company <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
                <Link
                  href={scenario.outcome.link.href}
                  className="inline-flex items-center rounded-md border border-stage-line px-4 py-2 text-sm text-stage-ink hover:border-stage-muted"
                >
                  {scenario.outcome.link.label}
                </Link>
              </div>
            </div>
          )}

          <p className="sr-only" aria-live="polite">
            {latest ? `${kindLabel[latest.kind]}: ${latest.title}` : ''}
            {done ? `. Outcome: ${scenario.outcome.headline}` : ''}
          </p>
        </div>
      </div>

      <p className="border-t border-stage-line px-4 py-2.5 text-[11px] text-stage-muted">
        A scripted walkthrough of how my agent systems reason. No live model runs here, and nothing you click leaves your
        browser.
      </p>
    </div>
  );
}
