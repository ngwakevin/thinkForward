import React from "react";
import { Reveal, RevealGroup } from "../../../components/ui/ScrollReveal";

export const metadata = {
  title: "Preview – Scroll Reveal",
  description: "Fade/slide in sections on scroll with consistent easing and reduced-motion support.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <div className="pt-10 pb-6 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-base font-semibold tracking-wide text-accent">Preview</h1>
          <p className="mt-1 text-2xl font-medium">Scroll Reveal</p>
          <p className="mt-2 text-sm text-fg-muted">Sections fade/slide in ~32px with consistent easing. Respects reduced-motion.</p>
        </div>
      </div>

      {/* Spacer to allow scroll */}
      <div className="h-[40vh] grid place-items-center text-fg-muted">
        <p>Scroll down…</p>
      </div>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Features</h2>
          </Reveal>
          <Reveal className="mt-2">
            <p className="text-fg-muted max-w-2xl">A simple grid of feature cards with subtle entrance animations.</p>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" intervalMs={100}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-xl border border-border/60 bg-bg-alt/40 p-6 corner-notches">
                <div className="h-10 w-10 rounded-md bg-accent/10 border border-accent/30" aria-hidden />
                <h3 className="mt-4 font-semibold">Feature {i}</h3>
                <p className="text-sm text-fg-muted mt-1">Consistent easing, minimal movement, professional look.</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-16 bg-bg-alt/20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Testimonials</h2>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-6 md:grid-cols-3" intervalMs={120}>
            {[1,2,3].map(i => (
              <div key={i} className="relative rounded-2xl border border-border/60 bg-bg-alt/40 p-6 overflow-hidden">
                <p className="relative text-sm leading-relaxed text-fg-muted">“Clear focus and weekly milestones made progress inevitable.”</p>
                <div className="relative mt-4 text-xs font-medium text-fg">Ada — <span className="text-fg-muted">Cloud Engineer</span></div>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Pricing</h2>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-6 md:grid-cols-3" intervalMs={100}>
            {["Starter","Pro","Teams"].map((tier, i) => (
              <div key={tier} className="rounded-2xl border border-border/60 bg-bg-alt/40 p-6 corner-notches">
                <h3 className="font-semibold">{tier}</h3>
                <p className="text-sm text-fg-muted mt-1">Great for {i===0?"trying things out":i===1?"serious learners":"collaboration"}.</p>
                <div className="mt-6 text-3xl font-extrabold">${(i+1)*19}</div>
                <button className="mt-6 inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">Choose {tier}</button>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>
    </main>
  );
}
