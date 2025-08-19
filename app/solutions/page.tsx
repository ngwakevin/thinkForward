import { solutions, testimonials, faqs } from '../../data/solutions';
import { SolutionsWizard } from '../../components/sections/SolutionsWizard';

export const metadata = { title: 'Solutions' };

export default function SolutionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-28 space-y-32">
      {/* Growth Roadmap (added) */}
      <section className="space-y-10" aria-labelledby="roadmap-heading">
        <div className="max-w-4xl space-y-6">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Path Planning</p>
          <h1 id="roadmap-heading" className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Your Growth Roadmap: 1, 3, 6, 12 Months to Mastery</h1>
          <p className="text-fg-muted text-base md:text-lg leading-relaxed">Whether you can commit just a few hours per week or dedicate intensive time, our training adapts to your schedule. Here’s how your journey can unfold over 1, 3, 6, and 12 months.</p>
        </div>
        {/* Timeline / grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: '1-Month', title: 'Quick Wins', bullets: ['Focus on fundamentals', 'Hands-on intro exercises', 'First small achievement'] },
            { label: '3-Month', title: 'Foundation', bullets: ['Build core knowledge', 'Apply skills in practice tasks', 'Complete first real project'] },
            { label: '6-Month', title: 'Systemization', bullets: ['Advanced modules', 'Case studies & simulations', 'Capstone or portfolio work'] },
            { label: '12-Month', title: 'Mastery', bullets: ['Specialization tracks', 'Real-world application', 'Professional differentiation'] }
          ].map(stage => (
            <div key={stage.label} className="group relative flex flex-col rounded-2xl border border-border/70 bg-gradient-to-br from-bg-alt/80 via-bg-alt/60 to-bg/60 p-6 shadow-sm overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-[radial-gradient(circle_at_20%_15%,hsla(165,70%,45%,0.15),transparent_60%)]" />
              <header className="flex items-center justify-between mb-4 relative z-10">
                <span className="inline-flex items-center rounded-full bg-accent/15 text-accent px-3 py-1 text-[11px] font-semibold tracking-wide">{stage.label}</span>
                <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px] shadow-accent/20" />
              </header>
              <h3 className="font-display text-lg font-semibold tracking-tight relative z-10">{stage.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-fg-muted relative z-10">
                {stage.bullets.map(b => (
                  <li key={b} className="flex gap-2 items-start">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-4 flex flex-wrap gap-4">
          <a href="/products" className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-white shadow hover:bg-accent-alt transition">Start Training</a>
          <a href="/solutions#solutions-heading" className="inline-flex items-center rounded-md border border-border/70 px-6 py-3 text-sm font-semibold tracking-wide text-fg hover:border-accent hover:text-accent transition">See Programs</a>
        </div>
      </section>

      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Mentorship & Momentum</h1>
        <p className="text-fg-muted text-base md:text-lg leading-relaxed">Structured guidance, adaptive roadmaps, and motivational systems that turn intention into consistent execution for your cloud & DevOps career.</p>
      </section>

      {/* Solutions Grid */}
      <section aria-labelledby="solutions-heading" className="space-y-8">
        <h2 id="solutions-heading" className="sr-only">Solutions Catalogue</h2>
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3 items-stretch">
          {solutions.map(s => {
            const statusStyle: Record<string, string> = {
              live: 'bg-accent/15 text-accent ring-accent/30',
              beta: 'bg-warning/15 text-warning ring-warning/30',
              'coming-soon': 'bg-fg-muted/10 text-fg-muted ring-fg-muted/30'
            };
            return (
              <article
                key={s.key}
                className="group relative flex flex-col h-full rounded-2xl bg-gradient-to-br from-bg-alt/80 via-bg-alt/60 to-bg/60 p-6 pt-7 shadow-sm outline-none transition hover:shadow-md focus-within:shadow-md"
              >
                {/* Gradient border frame */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/80 group-hover:ring-border group-focus-within:ring-border" />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_15%,hsla(165,70%,45%,0.15),transparent_60%)] opacity-0 group-hover:opacity-100 transition" />

                <header className="flex items-start justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-fg group-hover:text-fg transition">{s.title}</h3>
                    <p className="text-xs font-medium uppercase tracking-wide text-fg-muted/70">{s.tagline}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide ring-1 ${statusStyle[s.status]} capitalize`}>{s.status.replace('-', ' ')}</span>
                </header>

                <p className="mt-4 text-sm leading-relaxed text-fg-muted/90 pr-1">{s.description}</p>

                {/* Outcomes */}
                <ul className="mt-5 grid gap-2 text-xs sm:grid-cols-2">
                  {s.outcomes.map(o => (
                    <li key={o} className="flex items-start gap-2 rounded-md bg-bg/40 px-2.5 py-2 ring-1 ring-border/60 group-hover:ring-border/80">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5l3 3 6-6" /></svg>
                      </span>
                      <span className="leading-snug text-fg/90">{o}</span>
                    </li>
                  ))}
                </ul>

                {/* Feature matrix */}
                <dl className="mt-6 space-y-3">
                  {s.features.map(f => (
                    <div key={f.label} className="flex gap-4">
                      <dt className="shrink-0 w-28 text-[11px] font-semibold text-fg-muted/70 tracking-wide uppercase">{f.label}</dt>
                      <dd className="text-[11px] text-fg-muted/90 leading-snug">{f.detail}</dd>
                    </div>
                  ))}
                </dl>

                <footer className="mt-auto pt-5 border-t border-border/50 flex items-center justify-between">
                  <a
                    href={s.cta.href}
                    className="relative inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-[11px] font-semibold tracking-wide text-white shadow-sm transition hover:bg-accent-alt focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/70 focus:ring-offset-bg"
                  >
                    {s.cta.label}
                    <span className="ml-1.5 text-white/70 group-hover:translate-x-0.5 transition">→</span>
                  </a>
                </footer>
              </article>
            );
          })}
        </div>
      </section>

      {/* Wizard */}
      <section className="space-y-10">
        <SolutionsWizard />
      </section>

      {/* Testimonials */}
      <section className="space-y-10" aria-labelledby="stories-heading">
        <h2 id="stories-heading" className="font-display text-3xl font-bold tracking-tight">Success Stories</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map(t => (
            <figure key={t.name} className="relative rounded-2xl border border-border/70 bg-bg-alt/60 p-6 text-sm leading-relaxed shadow-sm ring-1 ring-bg-alt/40 transition hover:shadow-md">
              <blockquote className="text-fg-muted">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-xs font-medium text-fg">{t.name} · <span className="text-fg-muted">{t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-8" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="font-display text-3xl font-bold tracking-tight">FAQ</h2>
        <div className="divide-y divide-border/60 rounded-2xl border border-border/70 overflow-hidden bg-bg-alt/40">
          {faqs.map(f => (
            <details key={f.q} className="group">
              <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between font-medium text-sm hover:bg-bg-alt/50 focus:outline-none focus:bg-bg-alt/60">
                <span>{f.q}</span>
                <span className="text-accent group-open:rotate-45 transition">+</span>
              </summary>
              <div className="px-6 pb-5 text-sm text-fg-muted leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center">
        <a href="/contact" className="inline-flex items-center rounded-md bg-accent px-7 py-3.5 font-semibold tracking-wide text-white shadow-md hover:bg-accent-alt transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent/70 focus:ring-offset-bg">Start Your Path</a>
      </section>
    </div>
  );
}
