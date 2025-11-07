"use client";

const heroWords = [
  { text: "Train.", hasStub: false },
  { text: "Build.", hasStub: true },
  { text: "Elevate.", hasStub: true },
] as const;

const heroStats = [
  { label: "Real Mentorship", detail: "Expert cloud engineers guiding every step." },
  { label: "Creative Community", detail: "Cohorts that keep momentum high." },
  { label: "Career Outcomes", detail: "Portfolio evidence and interview prep." },
];

export function HeroPreview() {
  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        background:
          "linear-gradient(140deg, #d9e3d5 0%, #cfe0d2 45%, #bed4c6 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.6),rgba(255,255,255,0)),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.35),rgba(255,255,255,0))]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
        <div className="space-y-12">
          <div className="space-y-5 text-left">
            {heroWords.map((word, index) => (
              <div
                key={word.text}
                className="relative inline-flex min-w-[280px] items-center rounded-[68px] bg-[#233816] px-12 py-7 text-[#f5f7f2] shadow-[18px_18px_0_rgba(35,56,22,0.22)]"
                style={{
                  marginLeft: index === 0 ? 0 : index === 1 ? '3.5rem' : '1.5rem',
                }}
              >
                {word.hasStub && (
                  <span
                    className="absolute left-[-3.5rem] top-0 h-full w-16 rounded-[68px] bg-[#233816] shadow-[18px_18px_0_rgba(35,56,22,0.22)]"
                  />
                )}
                <span className="font-display text-[3.2rem] leading-none tracking-tight sm:text-[3.6rem]">
                  {word.text}
                </span>
              </div>
            ))}
          </div>

          <p className="max-w-xl text-base md:text-lg leading-relaxed text-[#1f2b20]/80">
            Launch your cloud career with playful structure, mentored practice, and evidence that
            proves what you can ship.
          </p>

          <div className="flex flex-col gap-4 text-[0.78rem] font-semibold uppercase tracking-[0.32em] text-[#1f2b20] sm:flex-row">
            <a
              href="/bootcamps"
              className="inline-flex items-center gap-2 border-b border-[#1f2b20] pb-1 transition hover:text-[#3e4f28]"
            >
              Explore bootcamps
              <span className="i-lucide-arrow-up-right text-base" />
            </a>
            <a
              href="/courses"
              className="inline-flex items-center gap-2 border-b border-[#1f2b20]/60 pb-1 transition hover:text-[#3e4f28]"
            >
              See courses
              <span className="i-lucide-arrow-right text-base" />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[32px] bg-white px-6 py-5 text-left shadow-[14px_14px_0_rgba(47,68,40,0.18)]"
              >
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-[#647461]">
                  {stat.label}
                </p>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-[#1f2b20]">{stat.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[40px] bg-white px-8 py-7 text-left shadow-[18px_18px_0_rgba(47,68,40,0.18)]">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-[#647461]">
              Alumni reflection
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#1f2b20]/85">
              “Cloudegree’s playful energy inspired thinkForward’s new experience. Every module feels crafted, and
              the blocks make the journey obvious.”
            </p>
            <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-[#1f2b20]">
              Cloud Engineer • 2024 cohort
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
