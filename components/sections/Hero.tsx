const heroWords = [
  { text: 'Train.', hasStub: false },
  { text: 'Build.', hasStub: true },
  { text: 'Elevate.', hasStub: true },
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#d9e3d5] via-[#cfe0d2] to-[#bed4c6] pt-24 pb-20">
      {/* Subtle global glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Text Column */}
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="space-y-4">
              {heroWords.map((word, index) => (
                <div
                  key={word.text}
                  className="relative inline-flex min-w-[240px] items-center rounded-[68px] px-9 py-6 text-white shadow-[18px_18px_0_rgba(0,32,20,0.22)] sm:min-w-[280px] sm:px-12 sm:py-7"
                  style={{
                    background:
                      'linear-gradient(110deg, var(--color-accent), var(--color-accent-alt))',
                    marginLeft:
                      index === 0 ? 0 : index === 1 ? '3.5rem' : '1.5rem',
                  }}
                >
                  {word.hasStub && (
                    <span
                      className="absolute left-[-3rem] top-0 hidden h-full w-12 rounded-[68px] shadow-[18px_18px_0_rgba(0,32,20,0.22)] sm:inline-block"
                      style={{
                        background:
                          'linear-gradient(110deg, var(--color-accent), var(--color-accent-alt))',
                      }}
                    />
                  )}
                  <span className="font-display text-4xl leading-none tracking-tight sm:text-[3.2rem]">
                    {word.text}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-lg text-[#2d3d2c]/80">
              Accelerate practical cloud & DevOps mastery with deliberate learning paths, hands-on labs, and mentor feedback loops.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-start lg:justify-start">
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-medium text-white shadow-md transition hover:bg-accent-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                Get Started
              </a>
              <a
                href="/roadmaps"
                className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 font-medium text-fg transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                View Roadmaps
              </a>
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-fg-muted">
              No spam • Cancel anytime
            </p>
          </div>

          {/* Decorative / Illustration Column (modern composition) */}
          <div className="relative hidden md:flex items-center justify-center">
            <div className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-[40px] border border-white/10 bg-[rgba(6,24,33,0.88)] shadow-[0_38px_110px_-36px_rgba(0,196,140,0.5)]">
              <div
                aria-hidden
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    'radial-gradient(circle at 18% 18%, rgba(0,196,140,0.28) 0, rgba(0,196,140,0) 55%),' +
                    'radial-gradient(circle at 84% 22%, rgba(0,167,119,0.22) 0, rgba(0,167,119,0) 60%),' +
                    'radial-gradient(circle at 42% 78%, rgba(245,250,252,0.22) 0, rgba(245,250,252,0) 70%)'
                }}
              />
              <div
                aria-hidden
                className="absolute -right-10 -top-14 h-64 w-64 rounded-full blur-3xl"
                style={{
                  background:
                    'conic-gradient(from 120deg at 50% 50%, rgba(0,196,140,0.9), rgba(0,196,140,0.25), rgba(245,250,252,0.38), rgba(0,167,119,0.65), rgba(0,196,140,0.78))'
                }}
              />
              <div
                aria-hidden
                className="absolute -left-16 bottom-[-120px] h-80 w-80 rounded-full blur-[85px]"
                style={{
                  background:
                    'radial-gradient(circle at 42% 55%, rgba(0,196,140,0.75), rgba(0,196,140,0.18), rgba(0,196,140,0))'
                }}
              />
              <div className="absolute inset-0 opacity-[0.22]">
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
              </div>

              <div className="relative flex h-full flex-col justify-between p-7 md:p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/18 backdrop-blur">
                    <span className="h-6 w-6 rounded-full bg-gradient-to-br from-accent to-accent-alt shadow-[0_0_28px_rgba(0,196,140,0.6)]" />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.38em] text-white/60">Elevate</p>
                    <p className="text-sm text-white/80">Structured paths to accelerate your cloud growth.</p>
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/15 bg-white/8 p-5 backdrop-blur-xl shadow-[0_24px_54px_-32px_rgba(0,196,140,0.88)]">
                  <p className="text-base font-semibold text-white">Level up your cloud expertise.</p>
                  <p className="mt-2 text-sm text-white/75">Hands-on labs, expert mentors, and real-world projects to accelerate your cloud career.</p>
                  <div className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.42em] text-accent/85">
                    <span className="flex h-1.5 w-16 items-center">
                      <span className="h-1.5 w-full rounded-full bg-gradient-to-r from-accent/90 via-white/85 to-accent-alt/85" />
                    </span>
                    Cloudegree
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 text-white/65">
                  <span className="h-px w-10 rounded-full bg-gradient-to-r from-accent/70 via-white/70 to-accent-alt/70" />
                  <p className="text-sm uppercase tracking-[0.42em]">Infinite Iterations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
