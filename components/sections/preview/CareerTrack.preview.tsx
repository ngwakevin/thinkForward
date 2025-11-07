"use client";

const stats = [
  { value: "300+", label: "Confirmed graduate hires" },
  { value: "4.8/5.0", label: "Across 500+ reviews" },
  { value: "10,000+", label: "1:1 mentor sessions" },
];

export function CareerTrackPreview() {
  return (
    <section className="relative isolate overflow-hidden bg-[#e8e7ff] py-24 text-[#2b1e40]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(255,117,76,0.16), rgba(232,231,255,0))," +
            "radial-gradient(circle at 82% 24%, rgba(0,170,135,0.16), rgba(232,231,255,0))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.34em] text-[#2b1e40]/65 shadow-[4px_4px_0_0_rgba(43,30,64,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#2f441c]" />
            Career Track
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold leading-tight">
            Cloud Academy, rebuilt with easy-to-love blocks.
          </h2>
        </div>

        <div className="mt-16 rounded-[48px] bg-white px-10 py-12 shadow-[16px_16px_0_0_rgba(43,30,64,0.12)]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] lg:items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="inline-flex items-center rounded-[28px] bg-[#5638ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[6px_6px_0_0_rgba(43,30,64,0.12)]">
                  Cloud Academy
                </span>
                <div className="inline-flex items-center gap-3 rounded-[26px] bg-[#ffeedf] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#2f441c] shadow-[6px_6px_0_0_rgba(43,30,64,0.12)]">
                  Next cohort • Dec 1, 2025
                </div>
              </div>

              <p className="text-sm md:text-base leading-relaxed text-[#2b1e40]/75">
                For close to a decade, Cloud Academy has been the proven way to launch a career in cloud
                engineering and DevOps. The refreshed track keeps the rigor but swaps in Designlab-inspired visuals
                so the journey feels more inviting.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="/bootcamps"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#2f441c] bg-[#2f441c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-[#2f441c]"
                >
                  Learn more
                  <span className="i-lucide-arrow-up-right text-base" />
                </a>
                <a
                  href="/mentoring"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#2f441c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#2f441c] transition hover:bg-[#dff7f0]"
                >
                  Talk to mentors
                  <span className="i-lucide-arrow-right text-base" />
                </a>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-[32px] bg-[#f5f1ff] px-5 py-4 text-center shadow-[8px_8px_0_0_rgba(43,30,64,0.12)]"
                  >
                    <p className="text-2xl font-semibold text-[#2b1e40]">{stat.value}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#2b1e40]/60">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[40px] bg-[#dff7f0] p-10 shadow-[12px_12px_0_0_rgba(43,30,64,0.12)]">
              <div className="space-y-6 text-[#2b1e40]/80">
                <div className="rounded-[32px] bg-white px-5 py-4 text-sm leading-relaxed shadow-[8px_8px_0_0_rgba(43,30,64,0.12)]">
                  “It looks fun, but the expectations stayed high. Each block unlocked a new proof point for my interviews.”
                </div>
                <div className="space-y-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#2b1e40]/60">
                  <p>Real projects</p>
                  <p>Mentor feedback in 24h</p>
                  <p>Career activation sessions</p>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2f441c]">
                  Program illustration • coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
