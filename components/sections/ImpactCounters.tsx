"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Stat = {
  label: string;
  value: number; // target numeric value (e.g., 50000)
  suffix?: string; // e.g., '+' or '%'
  icon?: React.ReactNode; // optional icon element
  durationMs?: number; // per-stat duration override
};

type Props = {
  title?: string;
  subtitle?: string;
  stats: Stat[];
  // global animation duration; individual stat can override via durationMs
  durationMs?: number;
  className?: string;
};

export default function ImpactCounters({ title, subtitle, stats, durationMs = 1600, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <section ref={containerRef} className={"py-16 sm:py-20 bg-bg " + (className || "")}> 
      <div className="mx-auto max-w-7xl px-6">
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {title && <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-fg">{title}</h2>}
            {subtitle && <p className="mt-2 text-fg-muted">{subtitle}</p>}
          </div>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <li key={s.label} className="rounded-2xl border border-border/60 bg-bg-alt/40 p-6 corner-notches">
              <div className="flex items-start gap-4">
                {s.icon && (
                  <div className={`h-12 w-12 grid place-items-center rounded-lg border border-border/60 bg-bg/60 text-accent transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`} aria-hidden>
                    {s.icon}
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-fg tabular-nums">
                    <CountUp
                      run={visible}
                      target={s.value}
                      durationMs={s.durationMs ?? durationMs}
                      reducedMotion={reducedMotion}
                    />
                    <span className="ml-1 align-[6px] text-accent font-black">{s.suffix || ""}</span>
                  </div>
                  <div className="mt-1 text-sm text-fg-muted">{s.label}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CountUp({ run, target, durationMs, reducedMotion }: { run: boolean; target: number; durationMs: number; reducedMotion: boolean; }) {
  const [val, setVal] = useState(0);
  const startTs = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  const eased = useMemo(() => makeEaseOutCubic(), []);

  useEffect(() => {
    if (!run) return;
    if (reducedMotion) {
      setVal(target);
      return;
    }
    const step = (ts: number) => {
      if (startTs.current == null) startTs.current = ts;
      const p = Math.min(1, (ts - startTs.current) / durationMs);
      const next = Math.round(target * eased(p));
      setVal(next);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [run, target, durationMs, reducedMotion, eased]);

  return <span aria-live="polite">{formatNumber(val)}</span>;
}

function makeEaseOutCubic() {
  return (t: number) => 1 - Math.pow(1 - t, 3);
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function formatNumber(n: number) {
  if (n >= 1000) return new Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
  return n.toString();
}
