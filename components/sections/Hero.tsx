export function Hero() {
  return (
  <section className="relative overflow-hidden bg-gradient-to-b from-bg to-bg-alt pt-24 pb-20">
      {/* Subtle global glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6">
  <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Text Column */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Train. Build. Elevate.</h1>
            <p className="mt-6 text-lg text-fg-muted">Accelerate practical cloud & DevOps mastery with deliberate learning paths, hands‑on labs, and mentor feedback loops.</p>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-start items-center gap-4 lg:justify-start">
              <a href="/products" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-medium text-white shadow-md hover:bg-accent-alt transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">Get Started</a>
              <a href="/roadmaps" className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 font-medium text-fg hover:border-accent hover:text-accent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">View Roadmaps</a>
            </div>
            <p className="mt-4 text-[11px] text-fg-muted uppercase tracking-[0.2em]">No spam • Cancel anytime</p>
          </div>

          {/* Decorative / Illustration Column (discs only) */}
          <div className="relative min-h-[480px] hidden lg:block">
            {/* Gradient discs to match composition (vivid green) */}
            <div className="absolute -top-2 left-6 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--color-accent),var(--color-accent-alt))] mix-blend-screen saturate-150" />
            <div className="absolute -top-6 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--color-accent),var(--color-accent-alt))] mix-blend-screen saturate-150" />
            <div className="absolute bottom-2 left-12 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--color-accent),var(--color-accent-alt))] mix-blend-screen saturate-150" />

            {/* 8-ring cluster (outlined small circles) */}
            <div className="pointer-events-none absolute left-[-1rem] top-1/2 -translate-y-1/2" aria-hidden>
              {/* row 1 (bottom): 4 */}
              <div className="absolute left-[0px] top-[120px] h-12 w-12 rounded-full border-2 border-border/70" />
              <div className="absolute left-[56px] top-[120px] h-12 w-12 rounded-full border-2 border-border/70" />
              <div className="absolute left-[112px] top-[120px] h-12 w-12 rounded-full border-2 border-border/70" />
              <div className="absolute left-[168px] top-[120px] h-12 w-12 rounded-full border-2 border-border/70" />
              {/* row 2 (middle): 3, offset right by half-step */}
              <div className="absolute left-[28px] top-[64px] h-12 w-12 rounded-full border-2 border-border/70" />
              <div className="absolute left-[84px] top-[64px] h-12 w-12 rounded-full border-2 border-border/70" />
              <div className="absolute left-[140px] top-[64px] h-12 w-12 rounded-full border-2 border-border/70" />
              {/* row 3 (top-left): 1 slightly offset left */}
              <div className="absolute left-[-8px] top-[8px] h-12 w-12 rounded-full border-2 border-border/70" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
