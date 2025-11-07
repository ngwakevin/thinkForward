export const metadata = { title: 'Resources – Preview' };

const resourceCategories = [
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Getting Started",
    description: "Essential guides for beginners starting their cloud journey",
    count: 24,
    color: "accent",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Concepts",
    description: "Core cloud computing concepts and architectures explained",
    count: 18,
    color: "accent-alt",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Guides",
    description: "Step-by-step tutorials and implementation guides",
    count: 32,
    color: "accent",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Playbooks",
    description: "Real-world scenarios and best practice playbooks",
    count: 15,
    color: "accent-alt",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "FAQ",
    description: "Frequently asked questions and quick answers",
    count: 28,
    color: "accent",
  },
];

const featuredResources = [
  {
    category: "Getting Started",
    title: "Your First Week in the Cloud",
    description: "Everything you need to know to get started with cloud computing, from basic concepts to your first deployment.",
    difficulty: "Foundation",
    readTime: "15 min",
  },
  {
    category: "Guides",
    title: "Setting Up CI/CD Pipelines",
    description: "A comprehensive guide to implementing continuous integration and deployment in Azure DevOps.",
    difficulty: "Intermediate",
    readTime: "25 min",
  },
  {
    category: "Playbooks",
    title: "Cloud Security Best Practices",
    description: "Essential security patterns and practices for protecting your cloud infrastructure and applications.",
    difficulty: "Advanced",
    readTime: "30 min",
  },
];

export default function ResourcesPreviewPage() {
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
                KNOWLEDGE BASE
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Cloud Resources & Documentation
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-fg-muted leading-relaxed max-w-3xl mx-auto">
              Comprehensive guides, tutorials, and documentation to help you master cloud technologies and best practices.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full px-6 py-4 rounded-full bg-bg-alt border border-border/60 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 text-white placeholder-fg-muted transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="relative bg-gradient-to-b from-bg-alt/30 to-bg py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              Browse by Category
            </h2>
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
              Find exactly what you need with our organized resource library
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceCategories.map((category, index) => (
              <a
                key={index}
                href="/docs"
                className="group bg-gradient-to-br from-bg-alt/60 to-bg/80 rounded-2xl p-8 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/10 space-y-4"
              >
                {/* Icon */}
                <div className="w-11 h-11 text-accent group-hover:text-accent-alt transition-colors">
                  {category.icon}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                      {category.title}
                    </h3>
                    <span className="text-sm font-semibold text-fg-muted">
                      {category.count}
                    </span>
                  </div>
                  <p className="text-sm text-fg-muted leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-sm font-semibold text-accent group-hover:text-accent-alt transition-colors">
                  Browse
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      {/* Featured Resources */}
      <section className="relative bg-gradient-to-b from-bg to-bg-alt py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              Featured Resources
            </h2>
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
              Start with our most popular guides and tutorials
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-bg-alt/50 to-bg/80 rounded-2xl p-6 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/10 space-y-4"
              >
                {/* Category & Meta */}
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-xs font-semibold text-accent uppercase">
                    {resource.category}
                  </span>
                  <span className="text-xs text-fg-muted">
                    {resource.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-white">
                  {resource.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-fg-muted leading-relaxed">
                  {resource.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className={`text-xs font-semibold ${
                    resource.difficulty === 'Foundation' ? 'text-emerald-400' :
                    resource.difficulty === 'Intermediate' ? 'text-amber-400' :
                    'text-rose-400'
                  }`}>
                    {resource.difficulty}
                  </span>
                  <a 
                    href="/docs"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-alt transition-colors group"
                  >
                    Read
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
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
            <div aria-hidden className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div aria-hidden className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-alt/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative space-y-8 text-center">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto">
                Can't Find What You're Looking For?
              </h2>

              <p className="text-lg md:text-xl text-fg-muted leading-relaxed max-w-2xl mx-auto">
                Ask our community or reach out to our support team for personalized help.
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <a 
                  href="/community"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-bold text-lg hover:shadow-xl hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
                >
                  ASK COMMUNITY 👉
                </a>
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-bg-alt border border-accent/40 text-white font-semibold text-lg hover:bg-accent/10 hover:border-accent transition-all duration-200"
                >
                  CONTACT SUPPORT
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
