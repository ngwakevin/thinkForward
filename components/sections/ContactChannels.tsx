'use client';
import React from 'react';

// Lightweight contact channel strip with WhatsApp CTA
// Set NEXT_PUBLIC_WHATSAPP_NUMBER in env (digits only, e.g. 15551234567)
// Optional: NEXT_PUBLIC_WHATSAPP_PREFILL="Hi, I'm interested in..."
export function ContactChannels() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const prefill = process.env.NEXT_PUBLIC_WHATSAPP_PREFILL || 'Hi – I would like to learn more about thinkForward.';
  const waHref = number ? `https://wa.me/${number}?text=${encodeURIComponent(prefill)}` : '/contact';

  return (
    <section aria-labelledby="contact-channels-heading" className="relative mt-10 mb-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 via-bg-alt/40 to-bg p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-accent/15 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent-alt/20 blur-3xl" aria-hidden />
          <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-[1]">
            <div className="flex-1 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">Chat With Us</p>
              <h2 id="contact-channels-heading" className="font-display text-2xl md:text-3xl font-bold tracking-tight">Questions? Instant Answers.</h2>
              <p className="text-sm md:text-[15px] leading-relaxed text-fg-muted max-w-xl">Need clarity on mentorship, adaptive roadmaps, or fit? Reach out—fast response, no pressure. We'll help you map next best steps.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]/60 focus-visible:ring-offset-bg"
                aria-label="Open WhatsApp chat"
              >
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                <span className="i-lucide-arrow-right transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-accent/40 px-5 py-3 text-sm font-semibold text-accent hover:bg-accent/5 hover:border-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <span className="i-lucide-message-circle" /> Contact Form
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2a9.94 9.94 0 00-8.53 15.14L2 22l5-1.48A9.94 9.94 0 1012.04 2zm0 2a7.94 7.94 0 110 15.88 7.9 7.9 0 01-3.74-.95l-.27-.15-2.96.87.88-2.88-.18-.3a7.93 7.93 0 016.27-11.47zm4.55 9.55c-.25-.12-1.47-.73-1.7-.82-.23-.08-.4-.12-.57.13-.17.25-.65.82-.8.99-.15.17-.3.18-.55.06-.25-.12-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.38.1-.5.1-.1.25-.27.37-.4.12-.13.16-.23.25-.38.08-.15.04-.29-.02-.41-.06-.12-.57-1.38-.78-1.9-.2-.48-.4-.42-.57-.43l-.48-.01c-.17 0-.44.06-.67.29-.23.23-.88.86-.88 2.1 0 1.24.9 2.45 1.03 2.62.12.17 1.77 2.7 4.28 3.78.6.26 1.07.42 1.44.54.6.19 1.15.16 1.59.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z" />
    </svg>
  );
}
