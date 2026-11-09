'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

type Hue = 'cloud' | 'iiot' | 'ai' | 'twin' | 'ink';
type Node = { id: string; x: number; y: number; w: number; h: number; title: string; sub: string; hue: Hue };
type Edge = { id: string; d: string; hue: Hue; to: string };

// Wide layout (sm and up): four columns.
const WIDE_NODES: Node[] = [
  { id: 'sensors', x: 16, y: 34, w: 116, h: 58, title: 'Field sensors', sub: 'meters · PLCs · BMS', hue: 'iiot' },
  { id: 'gateway', x: 164, y: 34, w: 116, h: 58, title: 'Edge gateway', sub: 'Modbus · BACnet', hue: 'iiot' },
  { id: 'mqtt', x: 312, y: 34, w: 116, h: 58, title: 'MQTT broker', sub: 'EMQX cluster', hue: 'cloud' },
  { id: 'clickhouse', x: 460, y: 34, w: 124, h: 58, title: 'ClickHouse', sub: 'sub-50 ms queries', hue: 'cloud' },
  { id: 'twin', x: 16, y: 196, w: 116, h: 64, title: 'Digital twin', sub: 'physics health', hue: 'twin' },
  { id: 'agent', x: 206, y: 186, w: 188, h: 84, title: 'AI agent', sub: 'plan · MCP tools · memory', hue: 'ai' },
  { id: 'llm', x: 460, y: 196, w: 124, h: 64, title: 'LLM gateway', sub: 'private GPUs', hue: 'ai' },
  { id: 'approval', x: 96, y: 356, w: 150, h: 58, title: 'Human approval', sub: 'guardrail gate', hue: 'ink' },
  { id: 'action', x: 344, y: 356, w: 168, h: 58, title: 'Action', sub: 'work order · PR · alert', hue: 'twin' },
];

const WIDE_EDGES: Edge[] = [
  { id: 'e1', d: 'M132 63 L164 63', hue: 'iiot', to: 'gateway' },
  { id: 'e2', d: 'M280 63 L312 63', hue: 'iiot', to: 'mqtt' },
  { id: 'e3', d: 'M428 63 L460 63', hue: 'cloud', to: 'clickhouse' },
  { id: 'e4', d: 'M522 92 C522 150 372 140 352 186', hue: 'cloud', to: 'agent' },
  { id: 'e5', d: 'M394 222 L460 222', hue: 'ai', to: 'llm' },
  { id: 'e5r', d: 'M460 238 L394 238', hue: 'ai', to: 'agent' },
  { id: 'e6', d: 'M206 222 L132 222', hue: 'twin', to: 'twin' },
  { id: 'e6r', d: 'M132 238 L206 238', hue: 'twin', to: 'agent' },
  { id: 'e7', d: 'M270 270 C270 320 171 312 171 356', hue: 'ai', to: 'approval' },
  { id: 'e8', d: 'M246 385 L344 385', hue: 'ink', to: 'action' },
];

// Tall layout (phones): the same flow in two columns, so labels stay near full size.
const TALL_NODES: Node[] = [
  { id: 'sensors', x: 8, y: 16, w: 156, h: 54, title: 'Field sensors', sub: 'meters · PLCs · BMS', hue: 'iiot' },
  { id: 'gateway', x: 176, y: 16, w: 156, h: 54, title: 'Edge gateway', sub: 'Modbus · BACnet', hue: 'iiot' },
  { id: 'mqtt', x: 8, y: 104, w: 156, h: 54, title: 'MQTT broker', sub: 'EMQX cluster', hue: 'cloud' },
  { id: 'clickhouse', x: 176, y: 104, w: 156, h: 54, title: 'ClickHouse', sub: 'sub-50 ms queries', hue: 'cloud' },
  { id: 'agent', x: 50, y: 196, w: 240, h: 84, title: 'AI agent', sub: 'plan · MCP tools · memory', hue: 'ai' },
  { id: 'twin', x: 8, y: 320, w: 156, h: 58, title: 'Digital twin', sub: 'physics health', hue: 'twin' },
  { id: 'llm', x: 176, y: 320, w: 156, h: 58, title: 'LLM gateway', sub: 'private GPUs', hue: 'ai' },
  { id: 'approval', x: 8, y: 430, w: 156, h: 54, title: 'Human approval', sub: 'guardrail gate', hue: 'ink' },
  { id: 'action', x: 176, y: 430, w: 156, h: 54, title: 'Action', sub: 'work order · PR', hue: 'twin' },
];

const TALL_EDGES: Edge[] = [
  { id: 'e1', d: 'M164 43 L176 43', hue: 'iiot', to: 'gateway' },
  { id: 'e2', d: 'M254 70 C254 90 86 84 86 104', hue: 'iiot', to: 'mqtt' },
  { id: 'e3', d: 'M164 131 L176 131', hue: 'cloud', to: 'clickhouse' },
  { id: 'e4', d: 'M254 158 C254 178 230 176 230 196', hue: 'cloud', to: 'agent' },
  { id: 'e5', d: 'M250 280 C250 300 262 300 262 320', hue: 'ai', to: 'llm' },
  { id: 'e5r', d: 'M244 320 C244 302 238 298 238 280', hue: 'ai', to: 'agent' },
  { id: 'e6', d: 'M90 280 C90 300 78 300 78 320', hue: 'twin', to: 'twin' },
  { id: 'e6r', d: 'M96 320 C96 302 102 298 102 280', hue: 'twin', to: 'agent' },
  { id: 'e7', d: 'M170 280 L170 400 C170 418 86 412 86 430', hue: 'ai', to: 'approval' },
  { id: 'e8', d: 'M164 457 L176 457', hue: 'ink', to: 'action' },
];

const LAYOUTS = {
  wide: { viewBox: '0 0 600 430', nodes: WIDE_NODES, edges: WIDE_EDGES },
  tall: { viewBox: '0 0 340 500', nodes: TALL_NODES, edges: TALL_EDGES },
};

// One cycle of the story: [edge, start ms, duration ms]
const TIMELINE: [string, number, number][] = [
  ['e1', 0, 700],
  ['e2', 700, 700],
  ['e3', 1400, 700],
  ['e4', 2100, 1000],
  ['e5', 3300, 600],
  ['e6', 3300, 600],
  ['e5r', 4000, 600],
  ['e6r', 4000, 600],
  ['e7', 4800, 900],
  ['e8', 5900, 800],
];
const CYCLE = 7600;

const STORIES = [
  'Condenser approach drifting → agent checks the twin → work order drafted for approval',
  'Voltage sag on a feeder → agent correlates meter data → incident summary sent to on-call',
  'GPU spend spiking → agent queries usage in ClickHouse → right-sizing PR opened for review',
];

const hueVar: Record<Hue, string> = {
  cloud: 'var(--stage-cloud)',
  iiot: 'var(--stage-iiot)',
  ai: 'var(--stage-ai)',
  twin: 'var(--stage-twin)',
  ink: 'var(--stage-ink)',
};

export function SystemCanvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [story, setStory] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused || hovered;
  const L = narrow ? LAYOUTS.tall : LAYOUTS.wide;

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || reduced) return;
    const { nodes: layoutNodes, edges: layoutEdges } = narrow ? LAYOUTS.tall : LAYOUTS.wide;
    const paths = new Map<string, SVGPathElement>();
    layoutEdges.forEach((e) => {
      const p = svg.querySelector<SVGPathElement>(`#sc-${e.id}`);
      if (p) paths.set(e.id, p);
    });
    const dots = new Map<string, SVGCircleElement>();
    TIMELINE.forEach(([id]) => {
      const c = svg.querySelector<SVGCircleElement>(`#sc-dot-${id}`);
      if (c) dots.set(id, c);
    });
    const nodes = new Map<string, SVGGElement>();
    layoutNodes.forEach((n) => {
      const g = svg.querySelector<SVGGElement>(`#sc-node-${n.id}`);
      if (g) nodes.set(n.id, g);
    });

    let raf = 0;
    let clock = 0;
    let last = performance.now();
    let cycleIndex = 0;

    const frame = (now: number) => {
      const dt = now - last;
      last = now;
      if (!pausedRef.current) clock += dt;
      const t = clock % CYCLE;
      const c = Math.floor(clock / CYCLE);
      if (c !== cycleIndex) {
        cycleIndex = c;
        setStory(c % STORIES.length);
      }
      const active = new Set<string>(['sensors']);
      TIMELINE.forEach(([id, start, dur]) => {
        const dot = dots.get(id);
        const path = paths.get(id);
        if (!dot || !path) return;
        const p = (t - start) / dur;
        if (p >= 0 && p <= 1) {
          const pt = path.getPointAtLength(path.getTotalLength() * p);
          dot.setAttribute('cx', pt.x.toFixed(1));
          dot.setAttribute('cy', pt.y.toFixed(1));
          dot.setAttribute('opacity', '1');
        } else {
          dot.setAttribute('opacity', '0');
        }
        const edge = layoutEdges.find((e) => e.id === id);
        if (edge && p > 0.85 && p < 1.6) active.add(edge.to);
      });
      nodes.forEach((g, id) => g.toggleAttribute('data-active', active.has(id)));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduced, narrow]);

  return (
    <figure
      className="stage-grid relative overflow-hidden rounded-xl border border-stage-line p-3 shadow-[0_30px_80px_-40px_rgba(9,13,22,0.6)] sm:p-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="flex items-center justify-between gap-3 px-1 pb-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-stage-muted">
          <span className="text-stage-twin">●</span> Edge → data → agent → action
        </p>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused ? 'Play system animation' : 'Pause system animation'}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-stage-line text-stage-muted hover:text-stage-ink"
          >
            {paused ? <Play aria-hidden className="h-3.5 w-3.5" /> : <Pause aria-hidden className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={L.viewBox}
        role="img"
        aria-labelledby="sc-title sc-desc"
        className="block h-auto w-full"
      >
        <title id="sc-title">How an agentic system turns field data into action</title>
        <desc id="sc-desc">
          Field sensors publish through an edge gateway and MQTT into ClickHouse. An AI agent queries the data, reasons
          with a private LLM gateway and the digital twin, passes a human approval gate, then raises an action such as a
          work order.
        </desc>

        {L.edges.map((e) => (
          <path
            key={e.id}
            id={`sc-${e.id}`}
            d={e.d}
            fill="none"
            stroke={hueVar[e.hue]}
            strokeOpacity={0.45}
            strokeWidth={1.5}
            className="flow"
          />
        ))}

        {L.nodes.map((n) => (
          <g key={n.id} id={`sc-node-${n.id}`} className="group/node">
            <rect
              x={n.x - 4}
              y={n.y - 4}
              width={n.w + 8}
              height={n.h + 8}
              rx={12}
              fill="none"
              stroke={hueVar[n.hue]}
              strokeWidth={2}
              className="opacity-0 transition-opacity duration-300 group-data-[active]/node:opacity-80"
            />
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              rx={9}
              fill="var(--stage-2)"
              stroke={hueVar[n.hue]}
              strokeOpacity={n.id === 'agent' ? 0.9 : 0.45}
              strokeWidth={n.id === 'agent' ? 1.6 : 1}
            />
            <circle cx={n.x + 14} cy={n.y + 18} r={3.5} fill={hueVar[n.hue]} />
            <text
              x={n.x + 24}
              y={n.y + 22}
              fill="var(--stage-ink)"
              fontSize={n.id === 'agent' ? 16 : 13}
              fontWeight={600}
              fontFamily="var(--font-inter), system-ui, sans-serif"
            >
              {n.title}
            </text>
            <text
              x={n.x + 12}
              y={n.y + (n.id === 'agent' ? 46 : 42)}
              fill="var(--stage-muted)"
              fontSize={10.5}
              fontFamily="var(--font-jetbrains), ui-monospace, monospace"
            >
              {n.sub}
            </text>
            {n.id === 'agent' && (
              <g fontFamily="var(--font-jetbrains), ui-monospace, monospace" fontSize={9.5}>
                {['clickhouse.query', 'twin.health', 'llm.reason'].map((tool, i) => (
                  <g key={tool} transform={`translate(${n.x + 12 + i * 58}, ${n.y + 56})`}>
                    <rect width={54} height={16} rx={4} fill="var(--stage)" stroke="var(--stage-line)" />
                    <text x={27} y={11.5} textAnchor="middle" fill="var(--stage-ai)">
                      {tool.split('.')[1]}
                    </text>
                  </g>
                ))}
              </g>
            )}
          </g>
        ))}

        {TIMELINE.map(([id]) => {
          const edge = L.edges.find((e) => e.id === id);
          return (
            <circle
              key={id}
              id={`sc-dot-${id}`}
              r={4.5}
              cx={-10}
              cy={-10}
              opacity={0}
              fill={edge ? hueVar[edge.hue] : 'white'}
              style={{ filter: `drop-shadow(0 0 6px ${edge ? hueVar[edge.hue] : 'white'})` }}
            />
          );
        })}
      </svg>

      <figcaption className="flex min-h-[3.25rem] items-start gap-2 border-t border-stage-line px-1 pt-3 text-[13px] leading-snug text-stage-ink">
        <span className="mt-0.5 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-stage-ai">Example</span>
        <span aria-live="off">{STORIES[story]}</span>
      </figcaption>
    </figure>
  );
}
