"use client";
import Link from 'next/link';
import { useReveal } from '../../lib/hooks/useReveal';

export function AccelerationPromo() {
  useReveal();
  const items: { title: string; blurb: string; href: string; icon: string }[] = [
    { title: 'Bootcamps', blurb: 'Live, instructor‑led cloud programs with hands‑on guidance.', href: '/bootcamps', icon: '🚀' },
    { title: 'Role Roadmaps', blurb: 'Clear paths for Cloud/DevOps roles with weekly goals.', href: '/roadmaps', icon: '🧭' },
    { title: 'Hands‑on Labs', blurb: 'Real scenarios to build confidence and evidence.', href: '/courses', icon: '🧪' },
    { title: '1:1 Mentorship', blurb: 'Accountability and feedback to keep momentum.', href: '/mentoring', icon: '👤' }
  ];

  return (
  <section id="services" aria-labelledby="acceleration-heading" className="relative py-20">
      {/* Soft top gradient bar */}
  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/40 via-accent-alt/30 to-accent/40 hidden sm:block" />
      <div className="mx-auto max-w-7xl px-6">
        {/* Copy + cards */}
        <div className="space-y-8">
          <div className="space-y-6 max-w-xl reveal reveal-visible">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Services</p>
            <div className="relative inline-block">
              <span className="pointer-events-none absolute -inset-1 top-4 h-3 w-full rounded-full bg-gradient-to-r from-accent/20 via-accent-alt/10 to-transparent blur-sm" aria-hidden />
              <h2 id="acceleration-heading" className="relative font-display text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Move faster than the cloud evolves</h2>
            </div>
            <div className="dotted-divider w-full mt-2" />
            <p className="text-fg-muted text-base leading-relaxed">Close the gap between where you are and the role you want. Learn with a focused plan, hands‑on practice, and mentorship that keeps you accountable.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 reveal reveal-visible">
            {items.map(it => (
              <div key={it.title} className="group relative pl-9 rounded-2xl ring-1 ring-transparent hover:ring-accent/30 transition hover:shadow-[0_10px_24px_-8px_rgba(0,196,140,0.25)] bg-gradient-to-b from-bg-alt/20 to-transparent">
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

  {/* Decorative column removed for minimal look */}
      </div>
    </section>
  );
}
