import Link from 'next/link';

export function SupportEcosystemPreview() {
  const items: { title: string; blurb: string; href: string; icon: string }[] = [
    { title: 'Support', blurb: 'Help when you need it — async or live, focused on unblocking momentum.', href: '/support', icon: '💬' },
    { title: 'Success Services', blurb: 'Guided integration & progression reviews to accelerate role‑ready outcomes.', href: '/contact', icon: '🧩' },
    { title: 'Learning', blurb: 'Roadmaps, deep‑dive guides, playbooks, and hands‑on scenarios that build evidence.', href: '/docs', icon: '📚' },
    { title: 'Community', blurb: 'Peer cohorts and micro‑accountability loops reinforcing consistent shipping.', href: '/events', icon: '🤝' }
  ];

  return (
    <section aria-labelledby="support-ecosystem-heading-preview" className="relative py-12">
      <div className="mx-auto max-w-7xl px-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-6 max-w-xl">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Preview • Services</p>
              <h2 id="support-ecosystem-heading-preview" className="font-display text-4xl font-bold tracking-tight text-white">We’ve Got Your Back</h2>
              <p className="text-fg-muted text-base leading-relaxed">Same content, cleaned outlines and focus states.</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {items.map((it) => (
                <div key={it.title} className="group relative pl-9 outline outline-1 -outline-offset-1 outline-border/50 rounded-xl py-4">
                  <div className="absolute left-2 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-alt text-white text-sm font-semibold shadow-sm ring-1 ring-white/10">
                    {it.icon}
                  </div>
                  <div className="pl-6 pr-3">
                    <h3 className="font-semibold text-lg tracking-tight mb-2 group-hover:text-accent transition-colors">{it.title}</h3>
                    <p className="text-sm leading-relaxed text-fg-muted mb-4">{it.blurb}</p>
                    <Link href={it.href as any} className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-alt transition">
                      Learn more <span className="i-lucide-arrow-right text-[13px]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[24rem]">
            {/* visuals removed in preview to emphasize content clarity */}
            <div className="h-full w-full rounded-2xl bg-bg/30 outline outline-1 -outline-offset-1 outline-border/50 flex items-center justify-center text-fg-muted">
              Visual space (optional)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupportEcosystemPreview;
