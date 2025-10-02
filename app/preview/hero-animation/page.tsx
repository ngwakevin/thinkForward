"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from 'next/image';

/*
Preview: Hero Value Animation
- Goal: student → lesson → skill → job loop (~16s), subtle
- Delivery: demo of three strategies you can pick from later
  1) Lottie JSON (Bodymovin) — placeholder container
  2) Muted MP4/WebM video — placeholder source
  3) Pure SVG fallback — implemented path animation here
- Accessibility: respects prefers-reduced-motion; static fallback image + aria-label
*/

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function HeroAnimationPreview() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(prefersReducedMotion());
    mq?.addEventListener?.("change", onChange);
    return () => mq?.removeEventListener?.("change", onChange);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-bg to-bg-alt text-fg">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Hero Value Animation — Preview</h1>
          <p className="text-sm text-fg-muted max-w-2xl">
            Short looping animation that shows “student → lesson → skill → job”. The hero will use one of these delivery methods; this page lets us evaluate motion, clarity, and accessibility first.
          </p>
        </header>

        {/* Strategy 3: Pure SVG fallback (implemented) */}
        <section className="rounded-xl border border-border/60 bg-bg p-6 corner-notches shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-muted mb-3">SVG Fallback (implemented)</h2>
          <SVGValueLoop reduced={reduced} />
        </section>

        {/* Strategy 2: Muted video (placeholder sources) */}
        <section className="rounded-xl border border-border/60 bg-bg p-6 corner-notches shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-muted mb-3">Muted Video (placeholder)</h2>
          <VideoValueLoop reduced={reduced} />
        </section>

        {/* Strategy 1: Lottie JSON (placeholder container) */}
        <section className="rounded-xl border border-border/60 bg-bg p-6 corner-notches shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-muted mb-3">Lottie / Bodymovin (placeholder)</h2>
          <LottiePlaceholder />
        </section>
      </div>
    </main>
  );
}

function LottiePlaceholder() {
  return (
    <div className="flex items-center justify-center h-56 rounded-lg border border-dashed border-border/60 bg-bg-alt/50 text-fg-muted">
      Drop a Lottie JSON here later — we’ll wire playback on the main page.
    </div>
  );
}

function VideoValueLoop({ reduced }: { reduced: boolean }) {
  return (
    <figure aria-label="Student to lesson to skill to job animation via video" className="relative">
      {reduced ? (
        <Image
          src="/icon.svg" // placeholder graphic; replace with exported preview frame later
          alt="Static illustration: student, lesson, skill, job"
          width={960}
          height={320}
          className="h-56 w-full max-w-3xl rounded-md object-cover object-center opacity-70"
          priority
        />
      ) : (
        <video
          className="h-56 w-full max-w-3xl rounded-md object-cover object-center"
          muted
          playsInline
          loop
          autoPlay
          aria-label="Student to lesson to skill to job animation via video"
        >
          {/* Replace these sources with exported MP4/WebM when ready */}
          <source src="/hero-value-loop.webm" type="video/webm" />
          <source src="/hero-value-loop.mp4" type="video/mp4" />
        </video>
      )}
      <figcaption className="mt-2 text-xs text-fg-muted">Loop length target: 12–20s • Slow ease-in-out • Subtle motion</figcaption>
    </figure>
  );
}

function SVGValueLoop({ reduced }: { reduced: boolean }) {
  // Simple path with four stations: student → lesson → skill → job
  const pathId = useMemo(() => `p-${Math.random().toString(36).slice(2)}`,[ ]);
  const iconDelay = 4000; // ms between stations
  return (
    <figure className="relative" aria-label="Student to lesson to skill to job animation via SVG">
      <div className="relative rounded-lg border border-border/60 bg-bg-alt/50 px-4 pt-4 pb-2 overflow-hidden">
        <svg viewBox="0 0 900 220" className="block w-full h-auto text-fg">
          <defs>
            <path id={pathId} d="M40 170 C 180 40, 340 40, 480 170 S 760 300, 860 120" />
          </defs>
          {/* dashed guide */}
          <use href={`#${pathId}`} stroke="var(--color-border)" strokeDasharray="6 8" fill="none" />

          {/* stations */}
          {stations.map((s, i) => (
            <g key={i} transform={`translate(${s.x}, ${s.y})`}>
              <circle r="16" fill="var(--color-accent-soft)" stroke="var(--color-accent)" />
              <text x="24" y="6" className="text-[12px] fill-current" fill="currentColor">{s.label}</text>
            </g>
          ))}

          {/* moving token (book) */}
          {!reduced && (
            <MovingAlongPath pathRefId={pathId} durationMs={16000}>
              <g className="animate-pulse-soft">
                <rect x="-10" y="-7" rx="3" width="20" height="14" fill="var(--color-accent)" />
                <path d="M-2 -7 V7" stroke="var(--color-accent-alt)" />
              </g>
            </MovingAlongPath>
          )}
        </svg>
      </div>
      <figcaption className="mt-2 text-xs text-fg-muted">Accessible SVG fallback — respects reduced motion; tokens only. Replace with Lottie/Video for main page later.</figcaption>
    </figure>
  );
}

const stations = [
  { x: 40, y: 170, label: "Student" },
  { x: 300, y: 60, label: "Lesson" },
  { x: 520, y: 180, label: "Skill" },
  { x: 820, y: 120, label: "Job" },
];

function MovingAlongPath({ pathRefId, durationMs, children }: { pathRefId: string; durationMs: number; children: React.ReactNode }) {
  const ref = useRef<SVGCircleElement | SVGGElement | null>(null);
  useEffect(() => {
    const el = ref.current as any;
    if (!el) return;
    let raf = 0;
    let start = performance.now();
    const total = durationMs;
    const loop = (t: number) => {
      const elapsed = (t - start) % total;
      const p = elapsed / total; // 0..1
      const path = document.getElementById(pathRefId) as SVGPathElement | null;
      if (path) {
        const len = path.getTotalLength();
        const pt = path.getPointAtLength(len * p);
        el.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pathRefId, durationMs]);
  return <g ref={ref as any}>{children}</g>;
}
