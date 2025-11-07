"use client";

const services = [
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Live Workshops",
    description: "Weekly interactive sessions covering advanced cloud topics, best practices, and real-world scenarios.",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Project Reviews",
    description: "Get detailed feedback on your cloud architecture and code from experienced engineers.",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Career Acceleration",
    description: "Resume optimization, interview prep, and direct connections to hiring partners in the cloud industry.",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Lifetime Access",
    description: "Keep access to all course materials, updates, and community resources after graduation.",
  },
];

export function AccelerationPromoPreview() {
  return (
    <section className="relative bg-bg py-24">
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Accelerate Your Success
          </h2>
          <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
            Beyond coursework, we provide comprehensive support to ensure you achieve your cloud career goals.
          </p>
        </div>

        {/* Unified Container for Services - Designlab inspired clean layout */}
        <div className="bg-gradient-to-br from-bg-alt/50 to-bg/80 rounded-3xl p-8 md:p-12 shadow-lg shadow-accent/5 border border-border/60">
          <div className="grid sm:grid-cols-2 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <div key={index} className="space-y-4">
                {/* Icon with brand gradient background chip */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-alt/10 text-accent border border-accent/30 shadow-sm shadow-accent/10">
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl font-bold text-white">
                  {service.title}
                </h3>
                <p className="text-base md:text-lg text-fg-muted leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
