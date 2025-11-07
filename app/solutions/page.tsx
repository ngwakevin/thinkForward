import {
  orderedSolutions,
  SOLUTION_STATUS_META,
  testimonials,
  faqs
} from '../../data/solutions';
import * as Icons from 'lucide-react';
import { SolutionsWizard } from '../../components/sections/SolutionsWizard';

export const metadata = { title: 'Solutions' };

const gradientBg =
  'linear-gradient(140deg, #d9e3d5 0%, #cfe0d2 40%, #bed4c6 100%)';

export default function SolutionsPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.65),rgba(255,255,255,0)),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.35),rgba(255,255,255,0))]"
        style={{ backgroundColor: '#d9e3d5' }}
        aria-hidden
      />
      <div className="relative space-y-24 pb-28">
      <section
        className="relative isolate overflow-hidden rounded-[48px] border border-[#bcd0c1] bg-white px-6 pb-20 pt-24 shadow-[0_45px_120px_rgba(29,43,29,0.18)] sm:px-10"
        style={{ background: gradientBg }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.7),rgba(255,255,255,0)),radial-gradient(circle_at_82%_22%,rgba(255,255,255,0.55),rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-4xl text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#375037] shadow-[8px_8px_0_rgba(35,56,35,0.08)]">
            Solutions
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#1f331f] sm:text-5xl">
            Cloud &amp; DevOps acceleration that adapts to how you learn.
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-[#243624]/85 sm:text-lg">
            Pick the path that fits your bandwidth today—cohort bootcamps,
            adaptive self-paced tracks, or high-touch mentorship. Each route
            blends deliberate practice, feedback loops, and proof you can ship.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#355035]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[#355035] shadow-[6px_6px_0_rgba(35,56,35,0.08)]">
              Guided roadmaps
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-[#355035] shadow-[6px_6px_0_rgba(35,56,35,0.06)]">
              1:1 mentorship
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 text-[#355035] shadow-[6px_6px_0_rgba(35,56,35,0.05)]">
              Momentum systems
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto space-y-12 px-6 sm:px-10 lg:max-w-6xl">
        <div className="space-y-3 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#1f331f] sm:text-4xl">
            Pick the solution that meets you where you are.
          </h2>
          <p className="text-sm leading-relaxed text-[#2b3f2b]/80 sm:text-base">
            Every offer keeps the same principles: portfolio-ready output,
            deliberate feedback, and momentum support. Choose live, hybrid, or
            async cadence—then layer more as your needs evolve.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <a
            href="/bootcamps"
            className="group relative overflow-hidden rounded-[32px] border border-[#f5c48a] bg-[linear-gradient(135deg,#fffdf7_0%,#fff1db_55%,#ffd4a6_100%)] p-6 text-left shadow-[0_26px_60px_rgba(191,128,55,0.22)] transition hover:-translate-y-1 hover:shadow-[0_34px_80px_rgba(191,128,55,0.28)]"
          >
            <div className="flex items-start gap-4">
              <span className="rounded-2xl bg-white/70 p-3 text-[#8a4d15] shadow-[6px_6px_0_rgba(191,128,55,0.28)]">
                <Icons.Rocket className="h-5 w-5" />
              </span>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#9c5a1f]">
                  Live Bootcamps
                </p>
                <p className="text-sm leading-relaxed text-[#5a3620]/90">
                  Six-week cohort rhythm, mentor cadences, and shipping
                  commitments for high accountability.
                </p>
              </div>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a4d15]">
              Join a bootcamp →
            </span>
          </a>

          <a
            href="/courses#courses-list"
            className="group relative overflow-hidden rounded-[32px] border border-[#a7c4ae] bg-[linear-gradient(135deg,#f3fbf4_0%,#e0f4e4_55%,#c6ebd2_100%)] p-6 text-left shadow-[0_26px_60px_rgba(69,120,89,0.18)] transition hover:-translate-y-1 hover:shadow-[0_34px_80px_rgba(69,120,89,0.24)]"
          >
            <div className="flex items-start gap-4">
              <span className="rounded-2xl bg-white/75 p-3 text-[#1f4f37] shadow-[6px_6px_0_rgba(69,120,89,0.22)]">
                <Icons.GraduationCap className="h-5 w-5" />
              </span>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#275a3f]">
                  Self-Paced Tracks
                </p>
                <p className="text-sm leading-relaxed text-[#204431]/90">
                  Modular playlists with async support, ideal for layering core
                  mastery or bridging to bootcamps.
                </p>
              </div>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#1f4f37]">
              Explore courses →
            </span>
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {orderedSolutions.map((solution) => {
            const statusMeta = SOLUTION_STATUS_META[solution.status];
            return (
              <article
                key={solution.key}
                className="group relative flex h-full flex-col overflow-hidden rounded-[34px] border border-[#c4d6c3] bg-white/90 p-8 shadow-[0_30px_70px_rgba(22,36,24,0.12)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_40px_90px_rgba(22,36,24,0.18)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/65 to-white/30 opacity-0 transition group-hover:opacity-100" />
                <header className="relative flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#2d452d]">
                      {solution.icon && (
                        <span className="text-xl">{solution.icon}</span>
                      )}
                      {solution.highlight && (
                        <span className="inline-flex items-center rounded-full bg-[#e6f0e4] px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-[#476147]">
                          {solution.highlight}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-[#1f331f]">
                      {solution.title}
                    </h3>
                    <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#4c654c]">
                      {solution.tagline}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] ring-1 ${
                      statusMeta.badgeClass
                    }`}
                  >
                    {statusMeta.label}
                  </span>
                </header>

                <p className="relative mt-4 text-sm leading-relaxed text-[#263826]/85 sm:text-base">
                  {solution.description}
                </p>

                <div className="relative mt-6 grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#557055]">
                      You&apos;ll achieve
                    </p>
                    <ul className="space-y-2 text-sm text-[#1f331f]">
                      {solution.outcomes.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-[#355035]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#557055]">
                      What makes it work
                    </p>
                    <ul className="space-y-2 text-sm text-[#1f331f]">
                      {solution.features.map((feature) => (
                        <li key={feature.label}>
                          <span className="font-semibold text-[#2b3f2b]">
                            {feature.label}:{' '}
                          </span>
                          <span className="text-[#293c29]/80">
                            {feature.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <footer className="relative mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={solution.cta.href}
                    className="inline-flex items-center gap-2 rounded-full bg-[#355035] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_12px_24px_rgba(28,44,28,0.25)] transition hover:bg-[#2a442a]"
                  >
                    {solution.cta.label}
                    <span className="text-white/70">→</span>
                  </a>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[#4a624a]/80">
                    {statusMeta.tone === 'pending'
                      ? 'Launching soon—secure early access.'
                      : 'Ready when you are.'}
                  </p>
                </footer>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="relative overflow-hidden rounded-[40px] border border-[#cbdac9] bg-white/90 p-10 shadow-[0_32px_80px_rgba(24,38,28,0.18)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,49,34,0.08),rgba(14,49,34,0)),radial-gradient(circle_at_80%_15%,rgba(14,49,34,0.08),rgba(14,49,34,0))]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="space-y-5">
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#1f331f] sm:text-4xl">
                Not sure where to begin? Build your stack in minutes.
              </h2>
              <p className="text-sm leading-relaxed text-[#2b3f2b]/80 sm:text-base">
                Answer a few quick questions and the Solutions Wizard assembles
                a recommended mix of bootcamps, guided roadmaps, and mentorship
                cadence so you can start with confidence.
              </p>
              <ul className="space-y-2 text-sm text-[#1f331f]">
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#355035]" />
                  <span>Adaptive suggestions based on your role target.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#355035]" />
                  <span>
                    Built-in guardrails to prevent taking on too much at once.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#355035]" />
                  <span>Downloadable action plan with next steps and links.</span>
                </li>
              </ul>
            </div>
            <div className="relative rounded-[28px] border border-[#d6e3d5] bg-white/90 p-6 shadow-[0_22px_50px_rgba(28,44,28,0.15)]">
              <SolutionsWizard />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="space-y-8 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#1f331f] sm:text-4xl">
            Evidence it works in practice
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#2b3f2b]/80 sm:text-base">
            Every story started with uncertainty and uneven progress. The common
            thread? Clarity, deliberate repetitions, and a feedback loop they
            could trust.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="relative flex h-full flex-col rounded-[28px] border border-[#cbdac9] bg-white p-6 text-left shadow-[0_24px_60px_rgba(28,44,28,0.12)]"
            >
              <blockquote className="text-sm leading-relaxed text-[#1f331f]/85">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-auto pt-5 text-sm font-semibold text-[#1f331f]">
                {item.name}
                <p className="text-xs font-medium uppercase tracking-[0.32em] text-[#4a624a]">
                  {item.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 sm:px-10">
        <div className="rounded-[32px] border border-[#cbdac9] bg-white/90 p-8 shadow-[0_28px_72px_rgba(28,44,28,0.16)]">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#1f331f] sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#2b3f2b]/80 sm:text-base">
            Still unsure how each solution fits? Start here or reach out—we’ll
            help map the route that matches your pace.
          </p>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[22px] border border-[#d6e3d5] bg-white px-6 py-4 shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between text-left text-sm font-semibold text-[#1f331f]">
                  {faq.q}
                  <span className="text-accent transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#263826]/80">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 text-center sm:px-10">
        <div className="space-y-6 rounded-[36px] border border-[#bcd0c1] bg-white/90 px-8 py-10 shadow-[0_30px_80px_rgba(24,38,28,0.14)]">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#1f331f] sm:text-4xl">
            Ready to pick your launch point?
          </h2>
          <p className="text-sm leading-relaxed text-[#2b3f2b]/80 sm:text-base">
            Book a quick fit call and we’ll co-design the mix of bootcamps,
            roadmaps, and mentorship that matches your goals and bandwidth.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em]">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#355035] px-5 py-2 text-white shadow-[0_18px_30px_rgba(24,38,28,0.2)] transition hover:bg-[#2a442a]"
            >
              Talk to us <span className="text-white/70">→</span>
            </a>
            <a
              href="/courses#courses-list"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[#355035] shadow-[0_12px_22px_rgba(28,44,28,0.12)] transition hover:bg-[#f1f6ef]"
            >
              Browse options
            </a>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
