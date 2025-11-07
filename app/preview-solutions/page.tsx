import { solutions } from '@/data/solutions';

export const metadata = { title: 'Solutions – Preview' };

const solutionPaths = [
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    badge: "LIVE",
    title: "Bootcamps Training",
    subtitle: "Live • Cohort-based • Outcome-focused",
    description: "Structured sprints with expert feedback and portfolio-ready deliverables. Build alongside peers in an intensive learning environment.",
    features: [
      "Weekly checkpoints & accountability",
      "Hands-on labs and simulations",
      "Cohort support and momentum",
      "1:1 mentor sessions",
    ],
    cta: "Explore Bootcamps",
    href: "/bootcamps",
    color: "accent",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    badge: "ON-DEMAND",
    title: "Self-paced Training",
    subtitle: "On-demand • Structured tracks",
    description: "Learn at your own pace with comprehensive courses covering cloud fundamentals to advanced topics. Perfect for busy professionals.",
    features: [
      "Lifetime access to materials",
      "Learn on your schedule",
      "Structured learning paths",
      "Certification preparation",
    ],
    cta: "Browse Courses",
    href: "/courses",
    color: "accent-alt",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    badge: "FLEXIBLE",
    title: "Corporate Training",
    subtitle: "Custom • Team-focused • Scalable",
    description: "Tailored training programs for teams and organizations. Upskill your workforce with customized cloud curriculum.",
    features: [
      "Custom learning paths",
      "Team progress tracking",
      "Dedicated success manager",
      "Flexible scheduling options",
    ],
    cta: "Contact Sales",
    href: "/contact",
    color: "accent",
  },
];

const successMetrics = [
  { value: "5,000+", label: "Graduates" },
  { value: "95%", label: "Job Placement" },
  { value: "150+", label: "Hiring Partners" },
  { value: "$85K", label: "Avg. Starting Salary" },
];

export default function SolutionsPreviewPage() {
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
                YOUR PATH TO SUCCESS
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Choose Your Learning Path
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-fg-muted leading-relaxed max-w-3xl mx-auto">
              Three ways to build momentum in Cloud & DevOps—pick what fits your schedule, learning style, and career goals.
            </p>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="relative bg-gradient-to-b from-bg-alt/30 to-bg py-16">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {successMetrics.map((metric, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="font-display text-4xl md:text-5xl font-bold text-white">
                  {metric.value}
                </div>
                <div className="text-sm md:text-base text-fg-muted">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      {/* Solution Paths */}
      <section className="relative bg-gradient-to-b from-bg to-bg-alt py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              Find Your Perfect Fit
            </h2>
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
              Every learner is different. We offer multiple paths to help you achieve your cloud career goals.
            </p>
          </div>

          <div className="grid gap-8">
            {solutionPaths.map((solution, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-bg-alt/60 to-bg/80 rounded-3xl p-8 md:p-12 shadow-lg shadow-accent/5 border border-border/60 hover:border-accent/50 transition-all duration-200"
              >
                <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-center">
                  {/* Left: Icon & Title */}
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-alt/10 text-accent border border-accent/30 shadow-sm shadow-accent/10">
                      {solution.icon}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-xs font-bold text-accent uppercase tracking-wide">
                        {solution.badge}
                      </div>
                      <h3 className="font-display text-3xl md:text-4xl font-bold text-white">
                        {solution.title}
                      </h3>
                      <p className="text-sm text-fg-muted uppercase tracking-wide">
                        {solution.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="space-y-6">
                    <p className="text-base md:text-lg text-fg-muted leading-relaxed">
                      {solution.description}
                    </p>

                    {/* Features */}
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {solution.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm text-fg">
                          <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="pt-4">
                      <a 
                        href={solution.href}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-bold text-base hover:shadow-lg hover:shadow-accent/30 hover:scale-105 transition-all duration-200"
                      >
                        {solution.cta}
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
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
            {/* Decorative gradient blur */}
            <div aria-hidden className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div aria-hidden className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-alt/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative space-y-8 text-center">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
                Not Sure Which Path Is Right for You?
              </h2>

              <p className="text-lg md:text-xl text-fg-muted leading-relaxed max-w-2xl mx-auto">
                Talk to our learning advisors to find the perfect program for your goals, schedule, and learning style.
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-bold text-lg hover:shadow-xl hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
                >
                  TALK TO AN ADVISOR 👉
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
