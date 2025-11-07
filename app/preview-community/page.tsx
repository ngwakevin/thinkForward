export const metadata = { title: 'Community – Preview' };

const communityFeatures = [
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    title: "Discussion Forums",
    description: "Ask questions, share insights, and engage in meaningful conversations with fellow cloud professionals.",
    stats: "10K+ threads",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Study Groups",
    description: "Join or create study groups to learn together, share resources, and stay accountable.",
    stats: "200+ active groups",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Live Events",
    description: "Attend virtual meetups, webinars, and workshops hosted by industry experts and community leaders.",
    stats: "Weekly events",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Resource Library",
    description: "Access community-curated guides, templates, and resources shared by experienced professionals.",
    stats: "500+ resources",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Career Support",
    description: "Get resume feedback, interview tips, and job referrals from community members and mentors.",
    stats: "Job board access",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    title: "Hackathons & Challenges",
    description: "Participate in coding challenges, hackathons, and collaborative projects to build your portfolio.",
    stats: "Monthly challenges",
  },
];

const testimonials = [
  {
    quote: "The community has been instrumental in my learning journey. I've made connections that have lasted beyond the courses.",
    author: "Sarah Chen",
    role: "Cloud Solutions Architect",
    avatar: "SC",
  },
  {
    quote: "Being part of study groups kept me motivated and accountable. The peer support is invaluable.",
    author: "Marcus Johnson",
    role: "DevOps Engineer",
    avatar: "MJ",
  },
  {
    quote: "I got my current job through a referral from a community member. The networking opportunities are incredible.",
    author: "Priya Patel",
    role: "Cloud Architect",
    avatar: "PP",
  },
];

const communityStats = [
  { value: "15K+", label: "Active Members" },
  { value: "50+", label: "Countries" },
  { value: "200+", label: "Weekly Posts" },
  { value: "24/7", label: "Support" },
];

export default function CommunityPreviewPage() {
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
                JOIN THE MOVEMENT
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Learn Together, Grow Together
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-fg-muted leading-relaxed max-w-3xl mx-auto">
              Join a vibrant community of cloud professionals, share knowledge, collaborate on projects, and accelerate your career growth.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <a 
                href="/community"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-bold text-lg hover:shadow-xl hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
              >
                JOIN COMMUNITY 👉
              </a>
              <a 
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-bg-alt border border-accent/40 text-white font-semibold text-lg hover:bg-accent/10 hover:border-accent transition-all duration-200"
              >
                EXPLORE FEATURES
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="relative bg-gradient-to-b from-bg-alt/30 to-bg py-16">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="font-display text-4xl md:text-5xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-fg-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      {/* Community Features */}
      <section id="features" className="relative bg-gradient-to-b from-bg to-bg-alt py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              What You'll Find Here
            </h2>
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
              Everything you need to connect, learn, and grow with fellow cloud professionals
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-bg-alt/60 to-bg/80 rounded-2xl p-8 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/10 space-y-4"
              >
                {/* Icon */}
                <div className="w-11 h-11 text-accent">
                  {feature.icon}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-white">
                      {feature.title}
                    </h3>
                    <span className="text-xs font-semibold text-accent">
                      {feature.stats}
                    </span>
                  </div>
                  <p className="text-sm text-fg-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      {/* Testimonials */}
      <section className="relative bg-gradient-to-b from-bg-alt to-bg py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              Community Stories
            </h2>
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
              Hear from members who found their tribe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-bg-alt/60 to-bg/80 rounded-2xl p-8 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 space-y-6"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center text-bg font-bold text-sm shadow-lg shadow-accent/20">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-fg-muted">{testimonial.role}</div>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-base text-fg-muted leading-relaxed">
                  "{testimonial.quote}"
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
                Ready to Join the Community?
              </h2>

              <p className="text-lg md:text-xl text-fg-muted leading-relaxed max-w-2xl mx-auto">
                Create your free account and start connecting with thousands of cloud professionals today.
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <a 
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-bold text-lg hover:shadow-xl hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
                >
                  CREATE FREE ACCOUNT 👉
                </a>
                <a 
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-bg-alt border border-accent/40 text-white font-semibold text-lg hover:bg-accent/10 hover:border-accent transition-all duration-200"
                >
                  SIGN IN
                </a>
              </div>

              <p className="text-sm text-fg-muted pt-4">
                Already a student? Community access is included with all programs.
              </p>
            </div>
          </div>
        </div>
        
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>
    </main>
  );
}
