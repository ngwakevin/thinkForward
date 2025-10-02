"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

/*
Code Execution / Step Visualizer — Preview
Requirements:
- Animate code flow/algorithm steps: current line highlight + moving data tokens
- Controls: Play/Pause, Step, Reset, Speed slider (400–800ms default per step)
- Accessibility: keyboard controls (Space play/pause, N step, R reset), text log of steps, respects prefers-reduced-motion
- Where: Preview only; can be embedded in lessons later
*/

const DEFAULT_INTERVAL = 600; // ms per step (between 400–800ms)

const demoCode = [
  "function sum(arr) {",
  "  let total = 0;",
  "  for (let i = 0; i < arr.length; i++) {",
  "    total += arr[i];",
  "  }",
  "  return total;",
  "}",
];

// A small demo trace for arr=[2,4,3]
const trace = [
  { line: 1, log: "Enter function sum" },
  { line: 2, log: "Initialize total=0" },
  { line: 3, log: "Loop i=0" },
  { line: 4, log: "total += arr[0] -> total=2" },
  { line: 3, log: "Loop i=1" },
  { line: 4, log: "total += arr[1] -> total=6" },
  { line: 3, log: "Loop i=2" },
  { line: 4, log: "total += arr[2] -> total=9" },
  { line: 5, log: "Exit loop" },
  { line: 6, log: "Return 9" },
];

type Step = typeof trace[number];

export default function StepVisualizerPage() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_INTERVAL);
  const [reduced, setReduced] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq?.matches ?? false);
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

  const step = () => setIndex(i => Math.min(i + 1, trace.length - 1));
  const reset = () => setIndex(0);

  useEffect(() => {
    if (!playing || reduced) return; // no interval
    const id = window.setInterval(() => {
      setIndex(prev => {
        if (prev >= trace.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, Math.max(100, speed));
    return () => window.clearInterval(id);
  }, [playing, speed, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); setPlaying(p => !p); }
      if (e.key.toLowerCase() === "n") step();
      if (e.key.toLowerCase() === "r") { setPlaying(false); reset(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const current = trace[index];

  return (
    <main className="min-h-screen bg-gradient-to-b from-bg to-bg-alt text-fg">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Step Visualizer — Preview</h1>
          <p className="text-sm text-fg-muted">Play/pause/step through code; watch data tokens move. Keyboard: Space=Play/Pause, N=Step, R=Reset.</p>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={()=>setPlaying(p=>!p)} className="rounded-md border border-border px-4 h-9 text-sm hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            {playing ? "Pause" : "Play"}
          </button>
          <button onClick={()=>{ setPlaying(false); step(); }} className="rounded-md border border-border px-4 h-9 text-sm hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">Step</button>
          <button onClick={()=>{ setPlaying(false); reset(); }} className="rounded-md border border-border px-4 h-9 text-sm hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">Reset</button>
          <div className="flex items-center gap-2 ml-4 text-sm">
            <label htmlFor="speed" className="text-fg-muted">Speed</label>
            <input id="speed" type="range" min={200} max={1200} step={50} value={speed} onChange={e=>setSpeed(Number(e.target.value))} className="w-48" />
            <span className="text-xs text-fg-muted">{speed}ms/step</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Code Panel */}
          <CodePanel lines={demoCode} activeLine={current.line} />

          {/* Visual Panel */}
          <VisualPanel index={index} reduced={reduced} />
        </div>

        {/* Text log (accessible) */}
        <section aria-live="polite" className="rounded-lg border border-border/60 bg-bg p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-muted mb-2">Step Log</h2>
          <ol className="list-decimal pl-6 space-y-1 text-sm">
            {trace.slice(0, index + 1).map((s, i) => (
              <li key={i} className="text-fg-muted">{s.log}</li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}

function CodePanel({ lines, activeLine }: { lines: string[]; activeLine: number }) {
  return (
    <figure className="rounded-lg border border-border/60 bg-bg p-3 shadow-sm">
      <figcaption className="text-xs text-fg-muted mb-2">sum([2,4,3])</figcaption>
      <pre className="text-sm leading-6 overflow-auto">
        {lines.map((l, i) => (
          <div key={i} className={`px-2 rounded ${activeLine-1===i ? "bg-accent/10 text-fg" : "text-fg-muted"}`}>
            <span className="inline-block w-6 text-right mr-2 opacity-60 select-none">{i+1}</span>
            {l}
          </div>
        ))}
      </pre>
    </figure>
  );
}

function VisualPanel({ index, reduced }: { index: number; reduced: boolean }) {
  // positions for tokens along a simple track; three array elements traveling to the accumulator
  const positions = useMemo(() => [
    { x: 40, y: 60 },
    { x: 110, y: 60 },
    { x: 180, y: 60 },
  ], []);

  const tokenClass = reduced ? "" : "animate-float-slow";

  // determine which token is moving based on the trace index
  const movingIdx = index < 4 ? 0 : index < 6 ? 1 : index < 8 ? 2 : -1;

  return (
    <figure className="rounded-lg border border-border/60 bg-bg p-3 shadow-sm">
      <figcaption className="text-xs text-fg-muted mb-2">Data flow</figcaption>
      <svg viewBox="0 0 420 160" className="w-full h-auto text-fg">
        {/* array track */}
        <rect x="20" y="40" width="200" height="40" rx="8" fill="var(--color-bg-alt)" stroke="var(--color-border)" />
        <line x1="90" y1="40" x2="90" y2="80" stroke="var(--color-border)" />
        <line x1="160" y1="40" x2="160" y2="80" stroke="var(--color-border)" />
        <text x="24" y="36" className="text-[10px] fill-current" fill="currentColor">arr</text>

        {/* accumulator box */}
        <rect x="320" y="50" width="80" height="60" rx="8" fill="var(--color-bg-alt)" stroke="var(--color-accent)" />
        <text x="328" y="44" className="text-[10px] fill-current" fill="currentColor">total</text>

        {/* arrow path */}
        <path d="M220 60 C 270 60, 280 80, 320 80" fill="none" stroke="var(--color-accent)" strokeDasharray="5 7" />

        {/* tokens 2,4,3 */}
        {[2,4,3].map((v, i) => (
          <g key={i} transform={`translate(${positions[i].x}, ${positions[i].y})`}>
            <rect width="40" height="30" rx="6" fill="var(--color-accent)" opacity={0.15} stroke="var(--color-accent)" />
            <text x="20" y="20" textAnchor="middle" className="text-[12px] fill-current" fill="currentColor">{v}</text>
          </g>
        ))}

        {/* moving token overlay */}
        {movingIdx >= 0 && !reduced && (
          <g>
            {/* draw at source */}
            <g transform={`translate(${positions[movingIdx].x}, ${positions[movingIdx].y})`} opacity={0.2}>
              <rect width="40" height="30" rx="6" fill="var(--color-accent)" stroke="var(--color-accent)" />
            </g>
            {/* animate along curve into total */}
            <AnimatedAlongCurve fromX={positions[movingIdx].x+40} fromY={positions[movingIdx].y+15} toX={320} toY={80} />
          </g>
        )}

        {/* accumulator value label */}
        <text x="360" y="84" textAnchor="middle" className="text-[14px] fill-current" fill="currentColor">
          {index < 4 ? 0 : index < 6 ? 2+4 : index < 8 ? 2+4+3 : 9}
        </text>
      </svg>
    </figure>
  );
}

function AnimatedAlongCurve({ fromX, fromY, toX, toY }: { fromX: number; fromY: number; toX: number; toY: number }) {
  const ref = useRef<SVGGElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const start = performance.now();
    const duration = 700; // ~0.7s per move
    const curve = (t: number) => {
      const p = Math.min(1, Math.max(0, t));
      // cubic bezier: start( fromX, fromY ), c1(260,60), c2(280,80), end(320,80)
      const c1x = 260, c1y = 60, c2x = 280, c2y = 80;
      const x = (1-p)**3 * fromX + 3*(1-p)**2 * p * c1x + 3*(1-p) * p**2 * c2x + p**3 * toX;
      const y = (1-p)**3 * fromY + 3*(1-p)**2 * p * c1y + 3*(1-p) * p**2 * c2y + p**3 * toY;
      el.setAttribute("transform", `translate(${x-20}, ${y-15})`);
    };
    const loop = (now: number) => {
      const elapsed = now - start;
      const p = easeInOutCubic(Math.min(1, elapsed / duration));
      curve(p);
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fromX, fromY, toX, toY]);

  return (
    <g ref={ref}>
      <rect width="40" height="30" rx="6" fill="var(--color-accent)" stroke="var(--color-accent)" />
    </g>
  );
}

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
