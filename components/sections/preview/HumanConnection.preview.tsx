"use client";

export function HumanConnectionPreview() {
  return (
    <section className="relative bg-bg-alt/30 py-24">
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header - Designlab Style with your colors */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Online Cloud Education With a Heavy Dose of Human Connection
          </h2>
          <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
            We believe that the best way to really learn cloud is from other people. That&apos;s why we&apos;ve put mentorship, feedback, and community at the center of all of our programs and courses.
          </p>
        </div>

        {/* Two column feature blocks */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Real Mentorship */}
          <div className="bg-gradient-to-b from-bg-alt/70 to-bg rounded-2xl p-8 md:p-10 shadow-sm border border-border/60 space-y-4 hover:border-accent/50 transition-colors">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
              REAL MENTORSHIP
            </h3>
            <p className="text-base md:text-lg text-fg-muted leading-relaxed">
              Learn with an expert. Our rigorously vetted cloud mentors provide personalized feedback, encouragement, and an insider&apos;s perspective on the cloud industry.
            </p>
            <a 
              href="/mentoring" 
              className="inline-flex items-center gap-2 text-base font-semibold text-accent hover:text-accent-alt transition-colors"
            >
              Learn More about Mentorship
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Community */}
          <div className="bg-gradient-to-b from-bg-alt/70 to-bg rounded-2xl p-8 md:p-10 shadow-sm border border-border/60 space-y-4 hover:border-accent/50 transition-colors">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
              CREATIVE COMMUNITY
            </h3>
            <p className="text-base md:text-lg text-fg-muted leading-relaxed">
              Just because our courses are online, doesn&apos;t mean you&apos;ll go it alone. Our online community gives plenty of opportunity for collaboration, networking, and making new friends.
            </p>
            <a 
              href="/community" 
              className="inline-flex items-center gap-2 text-base font-semibold text-accent hover:text-accent-alt transition-colors"
            >
              Explore our Community
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
