"use client";

export function FinalCTAPreview() {
  return (
    <section className="relative bg-bg-alt py-24">
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="mx-auto max-w-5xl px-6">
        {/* CTA Card */}
        <div className="relative bg-gradient-to-br from-accent/10 to-accent-alt/5 rounded-3xl p-10 md:p-16 shadow-2xl shadow-accent/20 border border-accent/30 overflow-hidden">
          {/* Decorative gradient blur */}
          <div aria-hidden className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div aria-hidden className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-alt/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative space-y-8 text-center">
            {/* Badge */}
            <div className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
              <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                FREE EVENT
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto">
              Attend a Virtual Open House
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed max-w-2xl mx-auto">
              Join us for an interactive session where you'll learn about our programs, meet our mentors, and get your questions answered live.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <a 
                href="/events"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-bold text-lg hover:shadow-xl hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
              >
                REGISTER NOW 👉
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-bg border border-accent/40 text-white font-semibold text-lg hover:bg-accent/10 hover:border-accent transition-all duration-200"
              >
                TALK TO AN ADVISOR
              </a>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap gap-6 justify-center text-sm text-fg-muted pt-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Next event: Every Thursday 6PM PST</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>60 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Live Q&A included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
