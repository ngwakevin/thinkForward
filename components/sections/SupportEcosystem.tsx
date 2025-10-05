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
                thinkForward isn’t just a platform — it’s an execution partner. Guidance, systems, and reinforcement designed
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
            {/* 8-circle ring cluster */}
            <div aria-hidden className="hidden md:grid absolute left-0 top-4 grid-cols-4 gap-6 z-20 will-change-transform">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 w-14 rounded-full border-2 border-white/70" />
              ))}
            </div>

            {/* Discs */}
            <div aria-hidden className="pointer-events-none z-0">
              {/* Large crisp green disc */}
              <div className="hidden md:block absolute right-4 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--color-accent),var(--color-accent-alt))] mix-blend-screen saturate-150" />
              {/* Secondary crisp green disc */}
              <div className="hidden md:block absolute right-24 top-52 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--color-accent),var(--color-accent-alt))] mix-blend-screen saturate-150" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
