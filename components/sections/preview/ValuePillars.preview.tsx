"use client";

const pillars = [
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Expert Mentorship",
    description: "Learn from industry veterans with real-world cloud experience. Get personalized feedback and guidance throughout your journey.",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Hands-on Projects",
    description: "Build real-world cloud solutions from day one. Work on enterprise-grade projects that showcase your skills to employers.",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Vibrant Community",
    description: "Connect with fellow learners, share knowledge, and grow together. Join study groups, networking events, and peer reviews.",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Career Support",
    description: "Get help with resume reviews, interview prep, and job placement. We're invested in your success beyond graduation.",
  },
];

export function ValuePillarsPreview() {
  return (
    <section className="relative bg-gradient-to-b from-bg-alt to-bg py-24">
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      {/* Subtle grid pattern */}
      <div 
        aria-hidden 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(0, 196, 140) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(0, 196, 140) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Why Choose Cloudegree
          </h2>
          <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
            We&apos;ve designed our programs around the pillars that matter most for cloud career success.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-bg-alt/60 to-bg/80 rounded-2xl p-8 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/10 space-y-4"
            >
              {/* Standardized Icon Container */}
              <div className="w-11 h-11 text-accent group-hover:text-accent-alt transition-colors">
                {pillar.icon}
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold text-white">
                {pillar.title}
              </h3>
              <p className="text-base text-fg-muted leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
