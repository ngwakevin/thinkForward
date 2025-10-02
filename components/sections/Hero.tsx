import DecorativeFlowInline from "./DecorativeFlowInline";

export function Hero() {
  return (
  <section className="relative overflow-hidden bg-gradient-to-b from-bg to-bg-alt pt-24 pb-20">
      {/* Subtle global glow (reduced) */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[320px] w-[700px] -translate-x-1/2 rounded-full bg-accent/10 blur-2xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
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

          {/* Illustration Column: inline decorative flow (static) */}
          <div className="relative md:block pl-2 pr-2 md:pl-8 w-full ml-auto">
            <div className="mx-auto max-w-[880px] xl:max-w-[960px]">
              <DecorativeFlowInline />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
