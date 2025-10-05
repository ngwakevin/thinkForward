import { testimonials, faqs } from '../../data/solutions';
import { SolutionsWizard } from '../../components/sections/SolutionsWizard';

export const metadata = { title: 'Solutions' };

export default function SolutionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-28 space-y-32">
      {/* Solutions Overview (new, placed before Path Planning) */}
      <section aria-labelledby="solutions-overview-heading" className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Solutions</p>
          <h2 id="solutions-overview-heading" className="font-display text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Choose Your Path</h2>
          <p className="text-fg-muted text-sm md:text-base leading-relaxed">Three ways to build momentum in Cloud & DevOps—pick what fits your schedule and goals.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Bootcamps Training */}
          <article className="group relative flex flex-col rounded-2xl bg-gradient-to-br from-bg-alt/80 via-bg-alt/60 to-bg/60 p-6 shadow-sm">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/80 group-hover:ring-border" />
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Bootcamps Training</h3>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-muted/70">Live • Cohort-based • Outcome-focused</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Live</span>
            </header>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted/90">Structured sprints, expert feedback, and portfolio-ready deliverables with peers.</p>
            <ul className="mt-4 space-y-2 text-xs text-fg/90">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Weekly checkpoints & accountability</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Hands-on labs and simulations</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Cohort support and momentum</li>
            </ul>
            <footer className="mt-5 pt-4 border-t border-border/50 flex items-center gap-3">
              <a href="/bootcamps" className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-[11px] font-semibold tracking-wide text-white shadow-sm hover:bg-accent-alt transition">
                Explore Bootcamps <span className="ml-1.5 text-white/70 group-hover:translate-x-0.5 transition">→</span>
              </a>
              <a href="#bootcamps-details" className="inline-flex items-center rounded-md px-3 py-2 text-[11px] font-semibold tracking-wide text-fg hover:text-accent transition">
                Learn more <span className="ml-1.5">→</span>
              </a>
            </footer>
          </article>

          {/* Self-paced Training */}
          <article className="group relative flex flex-col rounded-2xl bg-gradient-to-br from-bg-alt/80 via-bg-alt/60 to-bg/60 p-6 shadow-sm">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/80 group-hover:ring-border" />
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Self‑paced Training</h3>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-muted/70">On‑demand • Structured tracks</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-fg-muted/10 text-fg-muted ring-1 ring-fg-muted/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Coming Soon</span>
            </header>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted/90">Learn on your schedule with clear modules, checkpoints, and practice scenarios.</p>
            <ul className="mt-4 space-y-2 text-xs text-fg/90">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Role‑aligned roadmaps</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Progress tracking & milestones</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Practical, evidence‑building work</li>
            </ul>
            <footer className="mt-5 pt-4 border-t border-border/50 flex items-center gap-3">
              <a href="/courses" className="inline-flex items-center rounded-md border border-border/70 px-4 py-2 text-[11px] font-semibold tracking-wide text-fg hover:border-accent hover:text-accent transition">
                Browse Courses <span className="ml-1.5 group-hover:translate-x-0.5 transition">→</span>
              </a>
              <a href="#self-paced-details" className="inline-flex items-center rounded-md px-3 py-2 text-[11px] font-semibold tracking-wide text-fg hover:text-accent transition">
                Learn more <span className="ml-1.5">→</span>
              </a>
            </footer>
          </article>

          {/* Career Mentorship */}
          <article className="group relative flex flex-col rounded-2xl bg-gradient-to-br from-bg-alt/80 via-bg-alt/60 to-bg/60 p-6 shadow-sm">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/80 group-hover:ring-border" />
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Career Mentorship</h3>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-muted/70">1‑on‑1 • Personalized • Practical</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Available</span>
            </header>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted/90">Targeted sessions to remove blockers, refine roadmaps, and accelerate outcomes.</p>
            <ul className="mt-4 space-y-2 text-xs text-fg/90">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Personalized growth plan</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Portfolio & interview prep</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Clear next steps each week</li>
            </ul>
            <footer className="mt-5 pt-4 border-t border-border/50 flex items-center gap-3">
              <a href="/mentoring" className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-[11px] font-semibold tracking-wide text-white shadow-sm hover:bg-accent-alt transition">
                Book Mentoring <span className="ml-1.5 text-white/70 group-hover:translate-x-0.5 transition">→</span>
              </a>
              <a href="#mentorship-details" className="inline-flex items-center rounded-md px-3 py-2 text-[11px] font-semibold tracking-wide text-fg hover:text-accent transition">
                Learn more <span className="ml-1.5">→</span>
              </a>
            </footer>
          </article>
        </div>
      </section>

      

      {/* Details for each solution */}
      <section aria-labelledby="solutions-details-heading" className="space-y-12">
        <h2 id="solutions-details-heading" className="sr-only">Solution Details</h2>

        {/* Bootcamps detail */}
        <article id="bootcamps-details" className="grid gap-8 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-gradient-to-br from-bg-alt/80 via-bg-alt/50 to-bg p-6 md:p-8 shadow-sm">
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Bootcamps Training</h3>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-fg-muted">Cohort-based live sprints that combine expert guidance, hands-on labs, and weekly accountability to get you role-ready faster.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">What you get</h4>
                <ul className="mt-2 space-y-2 text-sm text-fg-muted">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Weekly live sessions + checkpoints</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Scenario labs and code reviews</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Portfolio‑ready artifacts</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Best for</h4>
                <ul className="mt-2 space-y-2 text-sm text-fg-muted">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Learners who want structure + peers</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Deadline‑driven momentum</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/bootcamps" className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-[11px] font-semibold tracking-wide text-white shadow-sm hover:bg-accent-alt transition">Explore Bootcamps <span className="ml-1.5 text-white/70">→</span></a>
              <a href="/events" className="inline-flex items-center rounded-md border border-border/70 px-5 py-2.5 text-[11px] font-semibold tracking-wide hover:border-accent hover:text-accent transition">Upcoming Cohorts</a>
            </div>
          </div>
          <aside className="rounded-2xl border border-border/70 bg-bg-alt/50 p-6">
            <dl className="space-y-3 text-sm">
              <div className="flex gap-3"><dt className="w-28 text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Format</dt><dd>Live, cohort‑based</dd></div>
              <div className="flex gap-3"><dt className="w-28 text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Cadence</dt><dd>1–2 sessions/week + labs</dd></div>
              <div className="flex gap-3"><dt className="w-28 text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Outcome</dt><dd>Projects, confidence, momentum</dd></div>
            </dl>
          </aside>
        </article>

        {/* Self‑paced detail */}
        <article id="self-paced-details" className="grid gap-8 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-gradient-to-br from-bg-alt/80 via-bg-alt/50 to-bg p-6 md:p-8 shadow-sm">
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Self‑paced Training</h3>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-fg-muted">On‑demand modules and role‑aligned roadmaps so you can learn consistently—whenever you have time.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">What you get</h4>
                <ul className="mt-2 space-y-2 text-sm text-fg-muted">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Role‑based roadmaps & milestones</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Checkpoints and practice tasks</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Progress tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Best for</h4>
                <ul className="mt-2 space-y-2 text-sm text-fg-muted">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Flexible schedules</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Independent learners</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/courses#courses-list" className="inline-flex items-center rounded-md border border-border/70 px-5 py-2.5 text-[11px] font-semibold tracking-wide hover:border-accent hover:text-accent transition">Browse Courses</a>
              <span className="inline-flex items-center rounded-md bg-fg-muted/10 px-5 py-2.5 text-[11px] font-semibold tracking-wide text-fg-muted">Coming Soon</span>
            </div>
          </div>
          <aside className="rounded-2xl border border-border/70 bg-bg-alt/50 p-6">
            <dl className="space-y-3 text-sm">
              <div className="flex gap-3"><dt className="w-28 text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Format</dt><dd>On‑demand, self‑paced</dd></div>
              <div className="flex gap-3"><dt className="w-28 text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Cadence</dt><dd>Your schedule</dd></div>
              <div className="flex gap-3"><dt className="w-28 text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Outcome</dt><dd>Consistent progress</dd></div>
            </dl>
          </aside>
        </article>

        {/* Mentorship detail */}
        <article id="mentorship-details" className="grid gap-8 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-gradient-to-br from-bg-alt/80 via-bg-alt/50 to-bg p-6 md:p-8 shadow-sm">
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Career Mentorship</h3>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-fg-muted">1‑on‑1 sessions to remove blockers, refine your plan, and keep execution steady week after week.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">What you get</h4>
                <ul className="mt-2 space-y-2 text-sm text-fg-muted">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Personalized growth plan</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Targeted feedback & resources</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Clear next steps each week</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Best for</h4>
                <ul className="mt-2 space-y-2 text-sm text-fg-muted">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Fast course‑corrections</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Focus + accountability</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/mentoring" className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-[11px] font-semibold tracking-wide text-white shadow-sm hover:bg-accent-alt transition">Book Mentoring <span className="ml-1.5 text-white/70">→</span></a>
              <a href="/contact" className="inline-flex items-center rounded-md border border-border/70 px-5 py-2.5 text-[11px] font-semibold tracking-wide hover:border-accent hover:text-accent transition">Questions? Contact</a>
            </div>
          </div>
          <aside className="rounded-2xl border border-border/70 bg-bg-alt/50 p-6">
            <dl className="space-y-3 text-sm">
              <div className="flex gap-3"><dt className="w-28 text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Format</dt><dd>1‑on‑1 sessions</dd></div>
              <div className="flex gap-3"><dt className="w-28 text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Cadence</dt><dd>As needed or weekly</dd></div>
              <div className="flex gap-3"><dt className="w-28 text-[11px] font-semibold uppercase tracking-wide text-fg-muted/70">Outcome</dt><dd>Clarity, velocity</dd></div>
            </dl>
          </aside>
        </article>

        {/* Hero (moved here under Career Mentorship) */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Mentorship & Momentum</h1>
          <p className="text-fg-muted text-base md:text-lg leading-relaxed">Structured guidance, adaptive roadmaps, and motivational systems that turn intention into consistent execution for your cloud & DevOps career.</p>
        </section>

        {/* Feature cards immediately under mentorship */}
  <div className="grid gap-6 md:grid-cols-2">
          {/* Accelerate role readiness */}
          <article className="group relative flex flex-col rounded-2xl bg-gradient-to-br from-bg-alt/80 via-bg-alt/60 to-bg/60 p-6 shadow-sm">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/80 group-hover:ring-border" />
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">Accelerate role readiness with targeted 1:1 guidance</h3>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-muted/70">Live</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">live</span>
            </header>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted/90">Structured senior-level guidance, calibrated quarterly goals, and rapid feedback loops so progression is intentional, visible, and compounding.</p>
            <ul className="mt-4 space-y-2 text-sm text-fg/90">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> 90‑day execution plan with measurable checkpoints</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Faster skill depth through focused correction</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Reduced stall time via rapid unblock support</li>
            </ul>
            <dl className="mt-6 space-y-3 text-[11px]">
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Strategic Alignment</dt><dd>Quarterly deep‑dive to define focus, risks, and success metrics.</dd></div>
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Async Reviews</dt><dd>Code / architecture feedback turnaround under 48h.</dd></div>
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Weekly Momentum</dt><dd>Light cadence check‑ins to de‑risk drift early.</dd></div>
            </dl>
            <footer className="mt-5 pt-4 border-t border-border/50">
              <a href="/mentoring" className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-[11px] font-semibold tracking-wide text-white shadow-sm hover:bg-accent-alt transition">Start Mentorship <span className="ml-1.5 text-white/70">→</span></a>
            </footer>
          </article>
          {/* Guided Learning Roadmaps */}
          <article className="group relative flex flex-col rounded-2xl bg-gradient-to-br from-bg-alt/80 via-bg-alt/60 to-bg/60 p-6 shadow-sm">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/80 group-hover:ring-border" />
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">Guided Learning Roadmaps</h3>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-muted/70">Live</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">live</span>
            </header>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted/90">Adaptive learning sequences that rebalance depth and delivery based on assessment signals—eliminating noise while accelerating portfolio credibility.</p>
            <ul className="mt-4 space-y-2 text-sm text-fg/90">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Remove unfocused curriculum overhead</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Concentrate on high‑leverage repetitions</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Maintain consistent forward velocity</li>
            </ul>
            <dl className="mt-6 space-y-3 text-[11px]">
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Adaptive Sequencing</dt><dd>Path reshapes using completion + retention signal checkpoints.</dd></div>
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Milestone Validation</dt><dd>Retention & application gates before unlocking next phase.</dd></div>
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Deliverable Artifacts</dt><dd>Each phase produces a tangible portfolio asset.</dd></div>
            </dl>
            <footer className="mt-5 pt-4 border-t border-border/50">
              <a href="/roadmaps" className="inline-flex items-center rounded-md border border-border/70 px-4 py-2 text-[11px] font-semibold tracking-wide hover:border-accent hover:text-accent transition">View Roadmaps <span className="ml-1.5">→</span></a>
            </footer>
          </article>

          {/* Motivation & Accountability */}
          <article className="group relative flex flex-col rounded-2xl bg-gradient-to-br from-bg-alt/80 via-bg-alt/60 to-bg/60 p-6 shadow-sm">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/80 group-hover:ring-border" />
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">Motivation & Accountability</h3>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-muted/70">Beta</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-warning/15 text-warning ring-1 ring-warning/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">beta</span>
            </header>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted/90">Lightweight gamification, peer micro‑cohorts, and progress surfacing that convert intention into durable execution habits.</p>
            <ul className="mt-4 space-y-2 text-sm text-fg/90">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Protect learning streak integrity</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Lower disengagement & dropout risk</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Continuous reinforcement via visible progress</li>
            </ul>
            <dl className="mt-6 space-y-3 text:[11px]">
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Streak Intelligence</dt><dd>Grace buffers + recovery logic to prevent momentum collapse.</dd></div>
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Peer Squads</dt><dd>Small cohort loops for accountability & morale lift.</dd></div>
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Progress Feed</dt><dd>Milestones surfaced to reinforce identity & cadence.</dd></div>
            </dl>
            <footer className="mt-5 pt-4 border-t border-border/50">
              <a href="/contact" className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-[11px] font-semibold tracking-wide text-white shadow-sm hover:bg-accent-alt transition">Join Beta <span className="ml-1.5 text-white/70">→</span></a>
            </footer>
          </article>

          {/* Interview & Certification Prep */}
          <article className="group relative flex flex-col rounded-2xl bg-gradient-to-br from-bg-alt/80 via-bg-alt/60 to-bg/60 p-6 shadow-sm">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/80 group-hover:ring-border" />
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">Interview & Certification Prep</h3>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-muted/70">Coming soon</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-fg-muted/10 text-fg-muted ring-1 ring-fg-muted/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">coming soon</span>
            </header>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted/90">Scenario drills, rubric‑based mock sessions, and readiness scoring that expose gaps early—so performance on the day is a calibrated repeat, not a first attempt.</p>
            <ul className="mt-4 space-y-2 text-sm text-fg/90">
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Surface competency gaps earlier</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Increase narrative clarity & depth</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Improve pass & offer probability</li>
            </ul>
            <dl className="mt-6 space-y-3 text-[11px]">
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Scenario Bank</dt><dd>Architecture, incident, behavioral, and systems prompts.</dd></div>
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Structured Mocks</dt><dd>Rubric scoring + actionable debrief with priority fixes.</dd></div>
              <div className="flex gap-4"><dt className="w-28 font-semibold text-fg-muted/70 uppercase tracking-wide">Readiness Index</dt><dd>Weighted coverage & confidence scoring model.</dd></div>
            </dl>
            <footer className="mt-5 pt-4 border-t border-border/50">
              <a href="/contact" className="inline-flex items-center rounded-md border border-border/70 px-4 py-2 text-[11px] font-semibold tracking-wide hover:border-accent hover:text-accent transition">Join Waitlist <span className="ml-1.5">→</span></a>
            </footer>
          </article>
        </div>

      </section>
  {/* Growth Roadmap (added) */}
    <section className="space-y-10" aria-labelledby="roadmap-heading">
        <div className="max-w-4xl space-y-6">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Path Planning</p>
      <h1 id="roadmap-heading" className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Sample 1/3/6/12‑month roadmap</h1>
          <p className="text-fg-muted text-base md:text-lg leading-relaxed">Whether you can commit just a few hours per week or dedicate intensive time, our training adapts to your schedule. Here’s how your journey can unfold over 1, 3, 6, and 12 months.</p>
        </div>
        {/* Timeline / grid (restored) */}
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
          <a href="/roadmaps" className="inline-flex items-center rounded-md border border-border/70 px-6 py-3 text-sm font-semibold tracking-wide text-fg hover:border-accent hover:text-accent transition">Explore Roadmaps</a>
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
        <div className="mt-4">
          <a href="/roadmaps" className="inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-accent transition">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M14.5 9.5l-3 1-1 3 3-1 1-3z" fill="currentColor" stroke="none" />
            </svg>
            Explore Roadmaps
          </a>
        </div>
      </section>
    </div>
  );
}
