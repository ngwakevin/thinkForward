export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-bg to-bg-alt pt-28 pb-24">
      {/* Subtle global glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-2 items-center">
          {/* Text Column */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Train. Build. Elevate.</h1>
            <p className="mt-6 text-lg text-fg-muted">Accelerate practical cloud & DevOps mastery with deliberate learning paths, hands‑on labs, and mentor feedback loops.</p>
            <div className="mt-10 flex flex-col sm:flex-row sm:justify-start items-center gap-4 lg:justify-start">
              <a href="/products" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-medium text-white shadow-md hover:bg-accent-alt transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">Get Started</a>
              <a href="/roadmaps" className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 font-medium text-fg hover:border-accent hover:text-accent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">View Roadmaps</a>
            </div>
            <p className="mt-5 text-[11px] text-fg-muted uppercase tracking-[0.2em]">No spam • Cancel anytime</p>
          </div>

          {/* Decorative / Illustration Column (panel removed) */}
          <div className="relative min-h-[420px] hidden lg:block">
            <div className="absolute top-6 right-8 h-64 w-64 rounded-full bg-gradient-to-br from-accent to-accent-alt opacity-80" />
            <div className="absolute bottom-4 left-0 h-52 w-52 rounded-full bg-gradient-to-tr from-accent-alt/70 to-accent/60 blur-sm" />
            <div className="absolute top-1/2 left-8 -translate-y-1/2 grid grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 w-14 rounded-full border border-border/50" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
