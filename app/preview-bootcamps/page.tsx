export const metadata = { title: 'Bootcamps – Preview' };

const bootcampTracks = [
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    badge: "MOST POPULAR",
    title: "AWS Solutions Architect",
    subtitle: "AZ-305 Certification Track",
    duration: "16 weeks",
    level: "Expert",
    price: "$8,500",
    nextCohort: "Jan 6, 2025",
    description: "Master AWS cloud architecture and prepare for the Solutions Architect certification. Design scalable, secure, and cost-effective cloud solutions.",
    outcomes: [
      "Design multi-tier architectures",
      "Implement security best practices",
      "Optimize costs and performance",
      "Build serverless applications",
    ],
    includes: [
      "Live instructor-led sessions",
      "1:1 mentor support",
      "Hands-on lab projects",
      "Exam preparation",
    ],
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    badge: "NEW",
    title: "DevOps Engineer",
    subtitle: "AZ-400 Certification Track",
    duration: "14 weeks",
    level: "Expert",
    price: "$7,500",
    nextCohort: "Jan 13, 2025",
    description: "Become a DevOps expert with hands-on experience in CI/CD, infrastructure as code, and automation tools.",
    outcomes: [
      "Build CI/CD pipelines",
      "Implement IaC with Terraform",
      "Master container orchestration",
      "Automate deployments",
    ],
    includes: [
      "Live instructor-led sessions",
      "1:1 mentor support",
      "Real-world projects",
      "Certification prep",
    ],
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    badge: "ADVANCED",
    title: "Cloud Security Architect",
    subtitle: "SC-100 Certification Track",
    duration: "12 weeks",
    level: "Expert",
    price: "$7,000",
    nextCohort: "Jan 20, 2025",
    description: "Specialize in cloud security architecture, compliance frameworks, and security operations across cloud platforms.",
    outcomes: [
      "Design zero-trust architectures",
      "Implement compliance frameworks",
      "Secure cloud workloads",
      "Manage identity and access",
    ],
    includes: [
      "Live instructor-led sessions",
      "Security lab simulations",
      "Expert mentorship",
      "Certification guidance",
    ],
  },
];

const bootcampFeatures = [
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Expert Mentorship",
    description: "1:1 guidance from industry veterans with real-world cloud experience",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Hands-on Projects",
    description: "Build real-world solutions that showcase your skills to employers",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Certification Ready",
    description: "Comprehensive exam preparation for industry-recognized certifications",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Career Support",
    description: "Resume reviews, interview prep, and direct connections to hiring partners",
  },
];

export default function BootcampsPreviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-bg to-bg-alt">
      {/* Hero Section */}
      <section className="relative bg-bg py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
              <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                IMMERSIVE TRAINING
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Live Cloud Bootcamps
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-fg-muted leading-relaxed max-w-3xl mx-auto">
              Transform your career in weeks, not years. Intensive, cohort-based training with expert mentors and real-world projects.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-4">
              <div className="space-y-1">
                <div className="font-display text-3xl md:text-4xl font-bold text-white">95%</div>
                <div className="text-sm text-fg-muted">Job Placement</div>
              </div>
              <div className="space-y-1">
                <div className="font-display text-3xl md:text-4xl font-bold text-white">12-16</div>
                <div className="text-sm text-fg-muted">Weeks</div>
              </div>
              <div className="space-y-1">
                <div className="font-display text-3xl md:text-4xl font-bold text-white">$85K</div>
                <div className="text-sm text-fg-muted">Avg. Salary</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bootcamp Tracks */}
      <section className="relative bg-gradient-to-b from-bg-alt/30 to-bg py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              Choose Your Track
            </h2>
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
              Specialized bootcamps designed to get you job-ready fast
            </p>
          </div>

          <div className="grid gap-8">
            {bootcampTracks.map((track, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-bg-alt/60 to-bg/80 rounded-3xl p-8 md:p-12 shadow-lg shadow-accent/5 border border-border/60 hover:border-accent/50 transition-all duration-200"
              >
                <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
                  {/* Left: Main Content */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-alt/10 text-accent border border-accent/30 shadow-sm shadow-accent/10 flex-shrink-0">
                        {track.icon}
                      </div>
                      
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-xs font-bold text-accent uppercase tracking-wide">
                            {track.badge}
                          </span>
                          <span className="text-sm text-fg-muted">{track.level}</span>
                        </div>
                        <h3 className="font-display text-3xl md:text-4xl font-bold text-white">
                          {track.title}
                        </h3>
                        <p className="text-sm text-fg-muted uppercase tracking-wide">
                          {track.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-base md:text-lg text-fg-muted leading-relaxed">
                      {track.description}
                    </p>

                    {/* Outcomes */}
                    <div>
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
                        What You&apos;ll Learn
                      </h4>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {track.outcomes.map((outcome, oIndex) => (
                          <li key={oIndex} className="flex items-center gap-2 text-sm text-fg">
                            <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right: Info Card */}
                  <div className="bg-gradient-to-br from-accent/10 to-accent-alt/5 rounded-2xl p-6 border border-accent/20 shadow-sm space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-accent/20">
                        <span className="text-sm text-fg-muted">Duration</span>
                        <span className="text-base font-semibold text-white">{track.duration}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-accent/20">
                        <span className="text-sm text-fg-muted">Next Cohort</span>
                        <span className="text-base font-semibold text-white">{track.nextCohort}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-fg-muted">Tuition</span>
                        <span className="text-2xl font-bold text-white">{track.price}</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <a 
                        href="/bootcamps"
                        className="block text-center px-6 py-3 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-bold text-base hover:shadow-lg hover:shadow-accent/30 hover:scale-105 transition-all duration-200"
                      >
                        APPLY NOW
                      </a>
                      <a 
                        href="/contact"
                        className="block text-center px-6 py-3 rounded-full bg-bg-alt border border-accent/40 text-white font-semibold text-base hover:bg-accent/10 hover:border-accent transition-all duration-200"
                      >
                        Learn More
                      </a>
                    </div>

                    <div className="pt-4 border-t border-accent/20">
                      <p className="text-xs text-fg-muted mb-2">Includes:</p>
                      <ul className="space-y-1">
                        {track.includes.map((item, iIndex) => (
                          <li key={iIndex} className="flex items-center gap-2 text-xs text-fg">
                            <svg className="w-3 h-3 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      {/* Features */}
      <section className="relative bg-gradient-to-b from-bg to-bg-alt py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              The Bootcamp Experience
            </h2>
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
              Everything you need to launch your cloud career
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {bootcampFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-bg-alt/60 to-bg/80 rounded-2xl p-8 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 space-y-4"
              >
                <div className="w-11 h-11 text-accent">
                  {feature.icon}
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-base text-fg-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      {/* CTA Section */}
      <section className="relative bg-bg py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative bg-gradient-to-br from-accent/10 to-accent-alt/5 rounded-3xl p-10 md:p-16 shadow-2xl shadow-accent/20 border border-accent/30 overflow-hidden">
            <div aria-hidden className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div aria-hidden className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-alt/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative space-y-8 text-center">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
                Ready to Accelerate Your Career?
              </h2>

              <p className="text-lg md:text-xl text-fg-muted leading-relaxed max-w-2xl mx-auto">
                Talk to our admissions team to find the right bootcamp for your goals and get started on your application.
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-bold text-lg hover:shadow-xl hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
                >
                  TALK TO ADMISSIONS 👉
                </a>
                <a 
                  href="/events"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-bg-alt border border-accent/40 text-white font-semibold text-lg hover:bg-accent/10 hover:border-accent transition-all duration-200"
                >
                  ATTEND INFO SESSION
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>
    </main>
  );
}
