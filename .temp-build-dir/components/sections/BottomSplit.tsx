'use client';
import React from 'react';
import { testimonials } from '../../data/solutions';

export function BottomSplit() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const prefill = process.env.NEXT_PUBLIC_WHATSAPP_PREFILL || 'Hi – I would like to learn more about CloudAcers.';
  const waHref = number ? `https://wa.me/${number}?text=${encodeURIComponent(prefill)}` : '/contact';

  const customFirst = 'A clear roadmap and quick feedback turned a year of wandering into just a few months of real progress. Thank you, CloudAcers team!';
  const customSecond = 'Just one session was all I needed to focus on what truly matters and get a perfect roadmap. Thank you, CloudAcers team!';
  const customThird = 'Thanks to the one-on-one session, I stayed focused and on track. Thank you, CloudAcers team!';

  return (
  <section className="relative py-16" aria-labelledby="bottom-cta-results">
      {/* Soft top gradient bar */}
  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/40 via-accent-alt/30 to-accent/40 hidden sm:block" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Chat With Us card */}
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 via-bg-alt/40 to-bg p-5 md:p-6 shadow-sm relative overflow-hidden corner-notches">
            <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-accent/15 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent-alt/20 blur-3xl" aria-hidden />
            <div className="relative z-[1] space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Chat With Us</p>
              <h2 id="bottom-cta-results" className="font-display text-xl md:text-2xl font-bold tracking-tight">Questions? Instant Answers.</h2>
              <div className="dotted-divider w-full mt-2" />
              <p className="text-[13px] md:text-sm leading-relaxed text-fg-muted max-w-xl">Need clarity on mentorship, adaptive roadmaps, or fit? Reach out—fast response, no pressure. We&apos;ll help you map next best steps.</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1.5">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]/60 focus-visible:ring-offset-bg"
                  aria-label="Open WhatsApp chat"
                >
                  <span className="i-lucide-message-square h-4 w-4" /> WhatsApp
                  <span className="i-lucide-arrow-right transition group-hover:translate-x-0.5" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-accent/40 px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent/5 hover:border-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  <span className="i-lucide-mail" /> Contact Form
                </a>
              </div>
            </div>
          </div>

          {/* Results cards */}
          <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-bg-alt/20 to-transparent p-5 md:p-6 corner-notches">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Results</h3>
                <p className="mt-1 text-fg-muted text-[13px] md:text-sm">Simple wins from focused practice and clear weekly goals.</p>
              </div>
              <a href="/solutions" className="inline-flex items-center text-[12px] font-semibold tracking-wide text-accent hover:text-accent-alt">See more <span className="ml-1 i-lucide-arrow-right" /></a>
            </div>
            <div className="grid gap-3.5 md:gap-4 sm:grid-cols-2">
              {testimonials.slice(0,2).map((t,i) => (
                <div key={t.name} className="relative rounded-xl border border-border/60 bg-bg-alt/40 p-4 group overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-accent/10 to-accent-alt/10" />
                  <p className="relative text-[13px] leading-relaxed text-fg-muted">“{i===0 ? customFirst : i===1 ? customSecond : t.quote}”</p>
                  <div className="relative mt-2.5 text-[11px] font-medium text-fg">{t.name} · <span className="text-fg-muted">{t.role}</span></div>
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
                </div>
              ))}
            </div>
            <div className="mt-4 text-[11px] text-fg-muted">
              See more results and other comments on our <a href="/solutions" className="font-semibold text-accent hover:text-accent-alt">Solutions</a> page.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
