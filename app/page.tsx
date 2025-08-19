import { Hero } from '../components/sections/Hero';
import { SocialProof } from '../components/sections/SocialProof';
import { ValuePillars } from '../components/sections/ValuePillars';
import { LivePanel } from '../components/sections/LivePanel';
import { TestimonialsSlice } from '../components/sections/TestimonialsSlice';
import { SupportEcosystem } from '../components/sections/SupportEcosystem';
import { ContactChannels } from '../components/sections/ContactChannels';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <ValuePillars />
      <LivePanel />
      <TestimonialsSlice />
      <SupportEcosystem />
      <section className="py-24" aria-labelledby="training-options-heading">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl mb-14 space-y-5">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Learning Formats</p>
            <h2 id="training-options-heading" className="font-display text-3xl md:text-4xl font-bold tracking-tight">Our Training Options</h2>
            <p className="text-fg-muted text-base leading-relaxed">Choose the format that matches your rhythm today—switch paths as your availability or goals evolve.</p>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            <div className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-8 shadow-sm">
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide mb-4 text-accent">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                Available Now
              </span>
              <h3 className="font-display text-xl font-semibold tracking-tight mb-3">Live Bootcamps</h3>
              <p className="text-fg-muted text-sm leading-relaxed flex-1">Join immersive, instructor-led sessions designed for hands-on learning, real-time interaction, and accelerated progress. Perfect if you want accountability and a collaborative environment.</p>
              <div className="mt-6">
                <a href="/bootcamps" className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-xs font-semibold tracking-wide text-white shadow hover:bg-accent-alt transition">View Cohorts <span className="ml-1.5 i-lucide-arrow-right text-[14px]" /></a>
              </div>
            </div>
            <div className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/10 p-8 shadow-sm">
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide mb-4 text-fg-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-fg-muted" />
                Coming Soon
              </span>
              <h3 className="font-display text-xl font-semibold tracking-tight mb-3">Self-Paced Courses</h3>
              <p className="text-fg-muted text-sm leading-relaxed flex-1">Learn anytime, anywhere at your own speed with structured video lessons, exercises, and resources. Ideal if you prefer flexibility and independent study.</p>
              <div className="mt-6">
                <a href="/contact" className="inline-flex items-center rounded-md border border-border/60 px-5 py-2.5 text-xs font-semibold tracking-wide hover:border-accent hover:text-accent transition">Get Notified <span className="ml-1.5 i-lucide-bell text-[14px]" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactChannels />
    </>
  );
}
