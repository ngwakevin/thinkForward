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
    <section aria-labelledby="support-ecosystem-heading" className="relative py-28">
      {/* Background wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-accent/5 via-bg-alt/40 to-bg" />
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-[480px] w-[480px] translate-x-1/3 -translate-y-1/4 rounded-full bg-accent/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-24 top-32 h-64 w-64 rounded-full bg-accent-alt/20 blur-2xl" />

      <div className="mx-auto max-w-7xl px-6 grid gap-20 lg:grid-cols-2">
        {/* Copy + cards */}
        <div className="space-y-10">
          <div className="space-y-6 max-w-xl">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Services</p>
            <h2 id="support-ecosystem-heading" className="font-display text-4xl font-bold tracking-tight">We’ve Got Your Back</h2>
            <p className="text-fg-muted text-base leading-relaxed">thinkForward isn’t just a platform — it’s an execution partner. Guidance, systems, and reinforcement designed to keep you moving from clarity → momentum → role readiness.</p>
          </div>
          <div className="grid gap-10 sm:grid-cols-2">
            {items.map(it => (
              <div key={it.title} className="group relative pl-9">
                <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-alt text-white text-sm font-semibold shadow-sm ring-1 ring-white/10">{it.icon}</div>
                <h3 className="font-semibold text-lg tracking-tight mb-2 group-hover:text-accent transition-colors">{it.title}</h3>
                <p className="text-sm leading-relaxed text-fg-muted mb-4 pr-2">{it.blurb}</p>
                <Link href={it.href as any} className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-alt transition">
                  Learn more <span className="i-lucide-arrow-right text-[13px]" />
                </Link>
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition ring-1 ring-accent/30" />
              </div>
            ))}
          </div>
        </div>

        {/* Decorative / illustrative side */}
        <div className="relative hidden lg:block">
          {/* Concentric / grid motif */}
          <div className="absolute left-8 top-8 grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 w-14 rounded-full border border-accent/40" />
            ))}
          </div>
          {/* Layered gradient discs */}
          <div className="absolute right-0 top-0 flex flex-col gap-6">
            <div className="h-48 w-48 rounded-full bg-gradient-to-br from-accent to-accent-alt opacity-80" />
            <div className="ml-16 h-40 w-40 rounded-full bg-gradient-to-tr from-accent-alt to-accent/70 opacity-60" />
          </div>
          {/* Placeholder panel */}
            <div className="absolute bottom-0 right-8 w-[420px] rounded-3xl border border-border/60 bg-bg/70 backdrop-blur p-8 shadow-xl shadow-accent/10">
              <h3 className="font-display text-xl font-semibold tracking-tight mb-3">Your Momentum Stack</h3>
              <ul className="space-y-2 text-sm text-fg-muted">
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Mentorship checkpoints</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Adaptive roadmap shifts</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Streak recovery logic</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Portfolio artifact cadence</li>
              </ul>
            </div>
        </div>
      </div>
    </section>
  );
}
