"use client";
import React from "react";

export function HeroFirstImpression() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20">
      {/* Animated gradient background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-gradient-slow"
        style={{
          backgroundImage:
            "linear-gradient(120deg, var(--color-bg) 0%, rgba(0,196,140,0.12) 30%, rgba(0,169,119,0.14) 60%, var(--color-bg-alt) 100%)",
        }}
      />

      {/* Subtle vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.18),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Headline / CTA */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight animate-fade-up">
              Learn faster. Build better.
            </h1>
            <p className="mt-6 text-lg text-fg-muted animate-fade-up-delay">
              Clear paths, hands-on practice, and mentor feedback—all in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start animate-fade-up-delay">
              <a href="/products" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-medium text-white shadow-md hover:bg-accent-alt transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">Get Started</a>
              <a href="/roadmaps" className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 font-medium text-fg hover:border-accent hover:text-accent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">View Roadmaps</a>
            </div>
            <p className="mt-4 text-[11px] text-fg-muted uppercase tracking-[0.2em]">No spam • Cancel anytime</p>
          </div>

          {/* Floating icons column */}
          <div className="relative hidden lg:block pl-4 pr-2 md:pl-6 w-full max-w-[640px] ml-auto">
            <div className="relative h-[420px] rounded-xl border border-border/50 bg-bg/40 corner-notches overflow-hidden">
              {/* soft glow */}
              <div aria-hidden className="absolute -top-16 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

              {/* floating icons (SVG) */}
              <FloatingIcon delay="0ms" className="left-10 top-16" label="Book">
                <rect x="6" y="8" width="28" height="24" rx="3" fill="var(--color-accent)" opacity="0.2" stroke="var(--color-accent)" />
                <path d="M20 8 V32" stroke="var(--color-accent-alt)" />
              </FloatingIcon>
              <FloatingIcon delay="250ms" className="left-48 top-6" label="Lightbulb">
                <path d="M22 10a10 10 0 1 1 0 20c0 3-2 5-4 6h8c-2-1-4-3-4-6Z" fill="var(--color-accent)" opacity="0.18" stroke="currentColor" />
                <path d="M18 36h8" />
              </FloatingIcon>
              <FloatingIcon delay="500ms" className="right-10 top-24" label="Code">
                <path d="M14 16l-8 8 8 8" />
                <path d="M34 16l8 8-8 8" />
              </FloatingIcon>
              <FloatingIcon delay="800ms" className="left-20 bottom-14" label="Award">
                <circle cx="20" cy="18" r="10" fill="var(--color-accent-soft)" stroke="var(--color-accent)" />
                <path d="M16 28l-4 10 8-4 8 4-4-10Z" />
              </FloatingIcon>
              <FloatingIcon delay="1100ms" className="right-16 bottom-10" label="Terminal">
                <rect x="8" y="12" width="28" height="18" rx="3" fill="var(--color-bg-alt)" />
                <path d="M12 18l6 6" />
                <path d="M22 24h10" />
              </FloatingIcon>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingIcon({ children, className, delay }: { children: React.ReactNode; className?: string; delay?: string; label?: string }) {
  return (
    <figure aria-hidden className={`absolute ${className ?? ""}`}>
      <svg viewBox="0 0 44 44" role="img" aria-hidden className="h-16 w-16 text-fg animate-float-slow" style={{ animationDelay: delay }}>
        <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </g>
      </svg>
    </figure>
  );
}

export default HeroFirstImpression;
