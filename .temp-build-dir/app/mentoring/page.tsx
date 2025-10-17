export const metadata = { title: '1‑on‑1 Mentoring' };
import { CalendlyEmbed } from '../../components/mentoring/CalendlyEmbed';
import { FocusAreas } from '../../components/mentoring/FocusAreas';
import { siteConfig } from '../../config/site';

export default function MentoringPage() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || siteConfig.calendly; // optional direct scheduling
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^+\d]/g,'');
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/^\+/, '')}?text=${encodeURIComponent('Hi – interested in 1-on-1 mentoring.')} ` : undefined;

  return (
    <div className="mx-auto max-w-6xl px-6 py-28 space-y-28">
      {/* Hero */}
      <section className="space-y-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">
          1‑on‑1 Cloud Mentoring
        </h1>
        <p className="max-w-3xl text-fg-muted leading-relaxed text-base md:text-lg">
          Personalized mentorship to help you gain clarity, take action, and position your career for growth. Each session is practical, focused, and directly tied to your current projects or career goals.
        </p>
        {/* Focus Areas Interactive */}
        <FocusAreas />
        {/* Hero CTAs refined */}
        <div className="flex flex-wrap gap-5 pt-8">
          <a
            href="#book"
            className="group relative inline-flex items-center gap-3 rounded-xl px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-warning focus:outline-none focus-visible:ring-4 focus-visible:ring-warning/30 transition
            bg-gradient-to-br from-warning/15 via-warning/10 to-warning/5
            border border-warning/40 shadow-[0_4px_18px_-4px_rgba(234,179,8,0.25)] hover:shadow-[0_6px_24px_-4px_rgba(234,179,8,0.35)]
            backdrop-blur-sm"
            aria-label="Scroll to booking form"
          >
            <span className="absolute inset-0 rounded-xl ring-1 ring-warning/30 group-hover:ring-warning/50" aria-hidden />
            <span className="absolute -inset-px rounded-xl bg-[linear-gradient(140deg,rgba(255,255,255,0.15),rgba(255,255,255,0)_40%)] pointer-events-none" aria-hidden />
            <span className="relative flex items-center gap-2">
              <span className="i-lucide-calendar" />
              <span>Book a Session</span>
            </span>
            <span className="pointer-events-none absolute right-2 top-2 h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
            </span>
          </a>
          <a
            href={whatsappHref || '#'} /* Replace with wa.me link */
            data-placeholder={!whatsappHref ? 'whatsapp-booking' : undefined}
            aria-disabled={!whatsappHref}
            title={whatsappHref ? 'Start WhatsApp chat' : 'WhatsApp booking coming soon'}
            data-analytics="click_whatsapp_cta"
            className="group relative inline-flex items-center gap-3 rounded-xl px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-warning focus:outline-none focus-visible:ring-4 focus-visible:ring-warning/30 transition
            border border-warning/40 bg-[radial-gradient(circle_at_30%_30%,rgba(234,179,8,0.18),rgba(234,179,8,0)_70%)]
            hover:bg-[radial-gradient(circle_at_30%_30%,rgba(234,179,8,0.26),rgba(234,179,8,0)_72%)] shadow-[0_4px_18px_-4px_rgba(234,179,8,0.25)] hover:shadow-[0_6px_24px_-4px_rgba(234,179,8,0.35)] backdrop-blur-sm aria-disabled:opacity-60"
          >
            <span className="absolute inset-0 rounded-xl ring-1 ring-warning/25 group-hover:ring-warning/45" aria-hidden />
            <span className="absolute -inset-px rounded-xl bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0)_45%)] pointer-events-none" aria-hidden />
            <span className="relative flex items-center gap-2">
              <span className="i-lucide-phone" />
              <span>Book via WhatsApp</span>
            </span>
            <span className="pointer-events-none absolute right-2 top-2 h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
            </span>
          </a>
          {calendlyUrl && (
            <a
              href="#schedule"
              className="group relative inline-flex items-center gap-3 rounded-xl px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 transition
              bg-gradient-to-br from-accent/15 via-accent/10 to-accent/5
              border border-accent/40 shadow-[0_4px_18px_-4px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_24px_-4px_rgba(99,102,241,0.35)] backdrop-blur-sm"
              aria-label="Jump to direct scheduling"
            >
              <span className="absolute inset-0 rounded-xl ring-1 ring-accent/30 group-hover:ring-accent/50" aria-hidden />
              <span className="absolute -inset-px rounded-xl bg-[linear-gradient(140deg,rgba(255,255,255,0.12),rgba(255,255,255,0)_42%)] pointer-events-none" aria-hidden />
              <span className="relative flex items-center gap-2">
                <span className="i-lucide-bolt" />
                <span>Schedule Directly</span>
              </span>
              <span className="pointer-events-none absolute right-2 top-2 h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
            </a>
          )}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-fg-muted/70 flex items-center gap-2 pt-2">
          <span className="h-px w-8 bg-border" aria-hidden />
          Faster response via WhatsApp once enabled
        </div>
        {calendlyUrl && (
          <div className="pt-10 grid gap-6 md:grid-cols-3">
            <div className="group relative rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/10 p-5 flex flex-col">
              <h3 className="font-semibold tracking-tight mb-2 flex items-center gap-2 text-sm"><span className="i-lucide-form-input" /> Form Request</h3>
              <p className="text-xs text-fg-muted leading-relaxed">Share detailed context and goals; receive tailored follow‑up within 24h.</p>
              <a href="#book" data-analytics="open_form_from_cards" className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-accent hover:underline">Open Form →</a>
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
            </div>
            <div className="group relative rounded-2xl border border-warning/40 bg-gradient-to-br from-warning/15 via-warning/10 to-warning/5 p-5 flex flex-col">
              <h3 className="font-semibold tracking-tight mb-2 flex items-center gap-2 text-sm text-warning"><span className="i-lucide-phone" /> WhatsApp</h3>
              <p className="text-xs text-warning/90 leading-relaxed">Rapid back‑and‑forth for quick clarification and lightweight guidance.</p>
              <a href={whatsappHref || '#'} data-placeholder={!whatsappHref ? 'whatsapp-booking' : undefined} aria-disabled={!whatsappHref} data-analytics="open_whatsapp_from_cards" className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-warning/90 hover:text-warning">{whatsappHref ? 'Open Chat' : 'Coming Soon'}</a>
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-warning/40 transition" />
            </div>
            <div className="group relative rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/15 via-accent/10 to-accent/5 p-5 flex flex-col">
              <h3 className="font-semibold tracking-tight mb-2 flex items-center gap-2 text-sm text-accent"><span className="i-lucide-bolt" /> Calendly (Direct)</h3>
              <p className="text-xs text-accent/90 leading-relaxed">Skip the form—lock a time instantly. Provide details in the booking notes.</p>
              <a href="#schedule" data-analytics="open_calendly_from_cards" className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-accent hover:underline">Open Scheduler →</a>
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-accent/40 transition" />
            </div>
          </div>
        )}
      </section>

      {/* What to Expect */}
      <section id="what-to-expect" className="space-y-10">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">What to Expect from Your 1-on-1 Mentorship</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="group relative rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/10 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl" aria-hidden>🎯</span>
              <h3 className="font-semibold tracking-tight">Targeted</h3>
            </div>
            <p className="text-sm leading-relaxed text-fg-muted">We focus on the 20% of actions that create the biggest results — helping you move faster with clarity.</p>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
          </div>
          <div className="group relative rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/10 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl" aria-hidden>🔄</span>
              <h3 className="font-semibold tracking-tight">Adaptive</h3>
            </div>
            <p className="text-sm leading-relaxed text-fg-muted">Each session is shaped around your current challenges and opportunities, so the guidance is always relevant.</p>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
          </div>
          <div className="group relative rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/10 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl" aria-hidden>✅</span>
              <h3 className="font-semibold tracking-tight">Accountable</h3>
            </div>
            <p className="text-sm leading-relaxed text-fg-muted">You’ll leave every session with clear next steps and light progress tracking to keep you moving forward.</p>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="book" className="space-y-8">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-3">
            Book a Session
            <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-[10px] font-medium text-warning">
              <span className="i-lucide-flashlight" /> Fast Response
            </span>
          </h2>
          <p className="mt-3 text-sm text-fg-muted max-w-2xl">Submit your context. We review and send a scheduling link (or clarification) within 24h.</p>
        </div>
        <form className="grid gap-6 md:grid-cols-2" action="/api/mentoring-request" method="post">
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-xs font-medium uppercase tracking-wide text-fg-muted">Name</label>
            <input required name="name" className="rounded-md border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-xs font-medium uppercase tracking-wide text-fg-muted">Email</label>
            <input required type="email" name="email" className="rounded-md border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-xs font-medium uppercase tracking-wide text-fg-muted">Current Role / Target Role</label>
            <input name="role" className="rounded-md border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-xs font-medium uppercase tracking-wide text-fg-muted">Primary Goal (short)</label>
            <input name="goal" className="rounded-md border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-medium uppercase tracking-wide text-fg-muted">Context & Challenges</label>
            <textarea name="context" rows={5} className="rounded-md border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-y" placeholder="Briefly outline current projects, blockers, or decisions you need clarity on." />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-medium uppercase tracking-wide text-fg-muted">Topics (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {['Architecture','Career Pivot','Interview Prep','Roadmap','DevOps','Networking','Cost Optimization','Cloud Fundamentals'].map(tag => (
                <label key={tag} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-bg-alt/50 px-3 py-1 text-[11px] font-medium text-fg-muted hover:border-accent/50 hover:text-accent cursor-pointer">
                  <input type="checkbox" name="topics" value={tag} className="hidden" />{tag}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-xs font-medium uppercase tracking-wide text-fg-muted">Urgency</label>
            <select name="urgency" className="rounded-md border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="normal">Normal</option>
              <option value="soon">Soon (2-4 weeks)</option>
              <option value="urgent">Urgent (this week)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-xs font-medium uppercase tracking-wide text-fg-muted">Preferred Time Zone</label>
            <input name="timezone" placeholder="e.g. UTC-5 / EST" className="rounded-md border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="md:col-span-2 flex items-center justify-between pt-2 gap-4 flex-wrap">
            <p className="text-[11px] text-fg-muted">You will receive a scheduling link if accepted. We respect your inbox.</p>
            <div className="flex gap-3">
              <button type="submit" data-analytics="submit_mentoring_request" className="group relative inline-flex items-center gap-2 rounded-lg px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white bg-gradient-to-r from-accent to-accent-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 shadow hover:shadow-md transition">
                <span className="i-lucide-send" />
                Submit Request
                <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/10 group-hover:ring-white/20" aria-hidden />
              </button>
              <a
                href={whatsappHref || '#'} /* Replace with wa.me link */
                data-placeholder="whatsapp-booking"
                aria-disabled={!whatsappHref}
                title="WhatsApp booking coming soon"
                className="group relative inline-flex items-center gap-2 rounded-lg px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-warning border border-warning/40 bg-warning/5 hover:bg-warning/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-warning/30 aria-disabled:opacity-60 transition"
              >
                <span className="i-lucide-phone" />
                WhatsApp
                <span className="pointer-events-none absolute -right-1 -top-1 h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-warning" />
                </span>
              </a>
            </div>
          </div>
        </form>
      </section>

      {/* Inject direct scheduling Calendly embed if env provided */}
      {calendlyUrl && (
        <section id="schedule" className="space-y-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-3">
              Direct Scheduling
              <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-medium text-accent">
                <span className="i-lucide-bolt" /> Instant
              </span>
            </h2>
            <p className="mt-3 text-sm text-fg-muted max-w-2xl">Prefer to skip the form? Book immediately below. Embed auto-detects domain for Calendly.</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-4 shadow-sm">
            <CalendlyEmbed url={calendlyUrl} />
          </div>
        </section>
      )}

      {/* FAQ Placeholder */}
      <section className="space-y-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">FAQ</h2>
        <div className="divide-y divide-border/60 rounded-2xl border border-border/60 overflow-hidden">
          {[
            ['How long is a session?','Typically 45–55 minutes focused on a primary objective.'],
            ['Can I bundle sessions?','Yes—discounted 3 and 6 session packs coming soon. Mention interest in the form.'],
            ['What happens after I submit?','We review fit & context, then send a booking link or follow‑up questions.']
          ].map(([q,a]) => (
            <details key={q} className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="cursor-pointer flex items-center justify-between px-5 py-4 text-sm font-medium">
                <span>{q}</span>
                <span className="i-lucide-chevron-down transition group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 text-sm text-fg-muted leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Sticky mobile CTA bar refined */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40 flex gap-4">
        <a href="#book" className="flex-1 group relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-warning border border-warning/40 bg-warning/10 backdrop-blur-sm shadow shadow-warning/20 hover:bg-warning/15 transition">
          <span className="i-lucide-calendar" /> Book
          <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-warning/30 group-hover:ring-warning/50" aria-hidden />
        </a>
        <a
          href={whatsappHref || '#'} /* Replace with wa.me link */
          data-placeholder="whatsapp-booking"
          aria-disabled={!whatsappHref}
          className="flex-1 group relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-warning border border-warning/40 bg-warning/10 backdrop-blur-sm shadow shadow-warning/20 hover:bg-warning/15 transition"
        >
          <span className="i-lucide-phone" /> WA
          <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-warning/30 group-hover:ring-warning/50" aria-hidden />
        </a>
      </div>
    </div>
  );
}
