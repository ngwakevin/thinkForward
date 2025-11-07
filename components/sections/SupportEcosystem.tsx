import Link from 'next/link';

// Support / Services style section for home page
export function SupportEcosystem() {
  const items: { title: string; blurb: string; href: string; icon: string }[] = [
    { title: 'Support', blurb: 'Help when you need it — async or live, focused on unblocking momentum.', href: '/support', icon: '💬' },
    { title: 'Success Services', blurb: 'Guided integration & progression reviews to accelerate role‑ready outcomes.', href: '/contact', icon: '🧩' },
    { title: 'Learning', blurb: 'Roadmaps, deep‑dive guides, playbooks, and hands‑on scenarios that build evidence.', href: '/docs', icon: '📚' },
    { title: 'Community', blurb: 'Peer cohorts and micro‑accountability loops reinforcing consistent shipping.', href: '/events', icon: '🤝' }
  ];

  return (
    <section aria-labelledby="support-ecosystem-heading" className="relative py-20">
      {/* Soft top gradient bar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/40 via-accent-alt/30 to-accent/40 hidden sm:block"
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Two column layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: copy + service items */}
      <div className="space-y-8">
            <div className="space-y-6 max-w-xl">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Services</p>
        <h2 id="support-ecosystem-heading" className="font-display text-4xl font-bold tracking-tight text-white">
                We’ve Got Your Back
              </h2>
              <p className="text-fg-muted text-base leading-relaxed">
                Cloudegree isn&apos;t just a platform — it&apos;s an execution partner. Guidance, systems, and reinforcement designed
                to keep you moving from clarity → momentum → role readiness.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {items.map((it) => (
                <div key={it.title} className="group relative pl-9">
                  <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-alt text-white text-sm font-semibold shadow-sm ring-1 ring-white/10">
                    {it.icon}
                  </div>
                  <h3 className="font-semibold text-lg tracking-tight mb-2 group-hover:text-accent transition-colors">{it.title}</h3>
                  <p className="text-sm leading-relaxed text-fg-muted mb-4 pr-2">{it.blurb}</p>
                  <Link
                    href={it.href as any}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-alt transition"
                  >
                    Learn more <span className="i-lucide-arrow-right text-[13px]" />
                  </Link>
                  <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition ring-1 ring-accent/30" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: decorative visuals */}
          <div className="relative min-h-[24rem]">
            <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:flex items-center justify-center">
              <div className="relative h-[26rem] w-[20rem]">
                <div
                  className="absolute -inset-10 rounded-[48px] blur-3xl"
                  style={{
                    background:
                      'radial-gradient(circle at 20% 25%, rgba(0,196,140,0.45), rgba(0,196,140,0)),' +
                      'radial-gradient(circle at 80% 75%, rgba(15,210,160,0.35), rgba(15,210,160,0))'
                  }}
                />
                <div className="absolute inset-0 overflow-hidden rounded-[38px] border border-white/12 bg-[rgba(6,24,33,0.92)] shadow-[0_40px_120px_-48px_rgba(0,196,140,0.85)] backdrop-blur-2xl">
                  <div
                    className="absolute inset-0 opacity-85"
                    style={{
                      background:
                        'radial-gradient(circle at 18% 20%, rgba(0,196,140,0.34) 0, rgba(0,196,140,0) 55%),' +
                        'radial-gradient(circle at 84% 30%, rgba(94,234,212,0.26) 0, rgba(94,234,212,0) 60%),' +
                        'radial-gradient(circle at 48% 80%, rgba(245,250,252,0.28) 0, rgba(245,250,252,0) 70%)'
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.18]"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                      backgroundSize: '32px 32px'
                    }}
                  />
                  <div className="relative flex h-full flex-col justify-between p-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/8 backdrop-blur">
                        <span className="h-6 w-6 rounded-full bg-gradient-to-br from-accent to-accent-alt shadow-[0_0_30px_rgba(0,196,140,0.65)]" />
                      </span>
                      <div className="text-xs uppercase tracking-[0.32em] text-white/65">Support Matrix</div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                        <p className="text-[13px] font-medium text-white">Momentum Pods</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-white/70">Weekly checkpoints, async QA, and unblock sessions.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/15 bg-gradient-to-br from-white/12 via-white/4 to-white/12 p-3 text-[11px] text-white/75">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent/80">Signals</span>
                          <p className="mt-2 leading-tight text-white/85">Operational telemetry & feedback loops.</p>
                        </div>
                        <div className="relative rounded-xl border border-white/10 bg-white/8 p-3">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent-alt/80">Mentors</span>
                          <p className="mt-2 leading-tight text-white/85">Domain experts on demand.</p>
                          <div
                            className="absolute -bottom-6 right-4 h-16 w-16 rounded-full blur-xl"
                            style={{
                              background:
                                'radial-gradient(circle at 30% 30%, rgba(0,196,140,0.55), rgba(0,196,140,0))'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.42em] text-white/60">
                      <span className="h-px w-10 rounded-full bg-gradient-to-r from-accent/70 via-white/70 to-accent-alt/70" />
                      Always-On Care
                    </div>
                  </div>
                </div>
                <div
                  className="absolute -right-24 top-10 h-40 w-40 rounded-full blur-3xl"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(94,234,212,0.55), rgba(15,210,160,0))' }}
                />
                <div
                  className="absolute -left-20 bottom-0 h-52 w-52 rounded-full blur-[90px]"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,196,140,0.6), rgba(0,196,140,0))' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
