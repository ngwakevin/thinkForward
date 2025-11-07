"use client";

export function CareerTrackPreview() {
  return (
    <section className="relative bg-gradient-to-b from-bg to-bg-alt py-24">
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="mx-auto max-w-5xl px-6">
        {/* Career Track Card - Designlab Style with your colors */}
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-3xl p-10 md:p-14 shadow-lg shadow-accent/10 border border-accent/20 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
              <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                CAREER TRACK
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Cloud Certification Bootcamp
            </h2>
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed max-w-3xl">
              Our project-based Cloud Certification Bootcamp is designed to teach you all the practical Cloud skills, best practices, and professional workflows that you need to break into the profession.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-3 gap-6 border-t border-accent/20 pt-8">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-white">32 Weeks</div>
              <div className="text-sm md:text-base text-fg-muted">Program Length</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-white">$8,500</div>
              <div className="text-sm md:text-base text-fg-muted">Tuition</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-white">Jan 6, 2025</div>
              <div className="text-sm md:text-base text-fg-muted">Next Cohort Starts</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <a 
              href="/bootcamps"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-semibold text-base hover:shadow-lg hover:shadow-accent/30 hover:scale-105 transition-all duration-200"
            >
              LEARN MORE
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-bg-alt border border-accent/40 text-white font-semibold text-base hover:bg-accent/10 hover:border-accent transition-all duration-200"
            >
              TALK TO AN ADVISOR
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
