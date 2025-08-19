import Link from 'next/link';

interface SupportChannel { title: string; description: string; cta?: { label: string; href: string }; icon: string; items?: string[] }

const channels: SupportChannel[] = [
  {
    title: 'Contact Form & Advisory Intake',
    description: 'Structured submission for mentorship, roadmap alignment, or architectural review. We respond within 24 hours (usually sooner).',
    cta: { label: 'Open Contact Form', href: '/contact' },
    icon: '📝',
    items: [
      'Mentorship & coaching inquiries',
      'Learning roadmap calibration',
      'Solution / platform fit questions'
    ]
  },
  {
    title: 'Async Support (Email / Portal)',
    description: 'Lightweight unblock requests, clarification, and follow‑ups without scheduling overhead.',
    icon: '✉️',
    items: [
      'Environment or lab issues',
      'Concept clarification',
      'Next-step validation'
    ]
  },
  {
    title: 'Live Sessions & Deep Dives',
    description: 'Scheduled calls for strategic alignment, architecture reviews, or mock practice sessions.',
    icon: '🎯',
    items: [
      'Quarterly strategic planning',
      'Architecture & design critique',
      'Interview readiness mock'
    ]
  },
  {
    title: 'Community & Peer Cohorts',
    description: 'Micro accountability loops, progress sharing, and peer reinforcement to preserve momentum.',
    icon: '🤝',
    items: [
      'Weekly progress threads',
      'Peer code / scenario swaps',
      'Motivation & streak recovery'
    ]
  },
  {
    title: 'Knowledge & Self‑Serve',
    description: 'Guides, roadmaps, and scenario playbooks so you can keep moving independently.',
    icon: '📚',
    cta: { label: 'Browse Resources', href: '/docs' },
    items: [
      'Concept deep dives',
      'Role readiness paths',
      'Hands‑on scenario labs'
    ]
  }
];

export default function SupportPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-bg-alt/50 to-bg" aria-hidden />
      <header className="relative mx-auto max-w-5xl px-6 pt-24 pb-14">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Support</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">How We Help You Keep Momentum</h1>
        <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-fg-muted">Multiple layers of assistance—from self‑serve to strategic advisory—so you get the right level of help at the right time without friction.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/contact" className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white shadow hover:bg-accent-alt transition">Contact Us</Link>
          <Link href="/docs" className="rounded-md border border-border/60 px-6 py-3 text-sm font-medium text-fg hover:border-accent hover:text-accent transition">Documentation</Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 pb-28 space-y-28">
        <section>
          <h2 className="font-display text-2xl font-semibold tracking-tight mb-8">Channels & Layers</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {channels.map(ch => (
              <div key={ch.title} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/80 to-bg/60 backdrop-blur p-6 shadow-sm hover:shadow-accent/20 transition">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent grid place-items-center text-lg">{ch.icon}</div>
                  <div>
                    <h3 className="font-semibold tracking-tight text-fg group-hover:text-accent transition-colors">{ch.title}</h3>
                    <p className="mt-1 text-xs uppercase tracking-wide text-fg-muted/70">Support Layer</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-fg-muted mb-4 flex-1">{ch.description}</p>
                {ch.items && (
                  <ul className="mb-5 space-y-1.5 text-[12px] text-fg-muted/90">
                    {ch.items.map(i => <li key={i} className="flex gap-1"><span className="text-accent">•</span><span>{i}</span></li>)}
                  </ul>
                )}
                {ch.cta && <Link href={ch.cta.href as any} className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-alt transition">{ch.cta.label} <span className="i-lucide-arrow-right text-[13px]" /></Link>}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold tracking-tight mb-8">Engagement Journey</h2>
          <ol className="relative ml-4 border-l border-border/60 space-y-10">
            {["Intake & Context", "Goal & Gap Mapping", "Execution Cadence", "Momentum Reinforcement", "Outcome & Next Horizon"].map((step, idx) => (
              <li key={step} className="pl-6 relative">
                <span className="absolute -left-3 top-1.5 h-5 w-5 rounded-full bg-accent text-[11px] font-semibold text-white grid place-items-center shadow">{idx+1}</span>
                <h3 className="font-medium text-sm tracking-tight text-fg">{step}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-fg-muted/90">
                  {idx===0 && 'Submit context via the contact form: goals, current role, constraints.'}
                  {idx===1 && 'We align on priority outcomes, risks, and capability gaps to focus early leverage.'}
                  {idx===2 && 'Establish weekly / bi-weekly touchpoints, async review channels, and checkpoints.'}
                  {idx===3 && 'Telemetry (streaks, artifacts, retention) surfaces drift early; interventions applied.'}
                  {idx===4 && 'Review progress, document wins, and expand scope or transition to independent growth.'}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="relative">
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-accent/10 via-bg-alt/60 to-bg p-10 shadow-md">
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-bold tracking-tight mb-4">Ready to Unblock Momentum?</h2>
              <p className="text-fg-muted leading-relaxed mb-6">Whether you need architectural guidance, roadmap calibration, or focused interview practice—reach out. We’ll triage and recommend the highest leverage next step.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white shadow hover:bg-accent-alt transition">Open Contact Form</Link>
                <Link href="/docs" className="rounded-md border border-border/60 px-6 py-3 text-sm font-medium text-fg hover:border-accent hover:text-accent transition">Browse Self‑Serve Docs</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
