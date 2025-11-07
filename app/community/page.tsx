import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

export const metadata: Metadata = {
  title: 'Community - Cloudegree',
  description: 'Join our vibrant community of learners and professionals. Share knowledge, ask questions, and collaborate with peers worldwide.',
};

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

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Login Required
          </h1>
          <p className="text-lg text-fg-muted mb-8">
            You need to be logged in to access the community features.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-accent text-bg font-bold rounded-lg hover:bg-accent/90 transition-colors uppercase tracking-wide"
          >
            Login to Continue 👉
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative bg-bg-alt pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-semibold mb-6 uppercase tracking-wide">
            Community
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Learn Together,
            <br />
            <span className="text-accent">Grow Together</span>
          </h1>
          <p className="text-xl text-fg-muted max-w-2xl mx-auto mb-12">
            Join a vibrant community of cloud professionals, share knowledge, and accelerate your career growth.
          </p>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {communityStats.map((stat) => (
              <div key={stat.label} className="bg-bg/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
                <div className="text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-sm text-fg-muted uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liquid Glass Separator */}
      <div className="h-24 bg-gradient-to-b from-bg-alt to-bg" />

      {/* Features Grid */}
      <section className="relative bg-bg py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-fg-muted max-w-2xl mx-auto">
              Our community offers a complete ecosystem of resources, support, and opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-bg-alt rounded-2xl p-8 border border-white/5 hover:border-accent/30 transition-all group"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-fg-muted mb-4 leading-relaxed">{feature.description}</p>
                <div className="inline-block px-3 py-1 bg-accent/10 rounded-full text-accent text-sm font-semibold">
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liquid Glass Separator */}
      <div className="h-24 bg-gradient-to-b from-bg to-bg-alt" />

      {/* Testimonials Section */}
      <section className="relative bg-bg-alt py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Hear From Our Members
            </h2>
            <p className="text-lg text-fg-muted">
              See how our community has helped professionals transform their careers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-bg rounded-2xl p-8 border border-white/5"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-fg-muted">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-fg-muted leading-relaxed italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Liquid Glass Separator */}
      <div className="h-24 bg-gradient-to-b from-bg-alt to-bg" />

      {/* CTA Section */}
      <section className="relative bg-bg py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-xl text-fg-muted mb-12 max-w-2xl mx-auto">
            Connect with thousands of cloud professionals and start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#forums"
              className="px-8 py-4 bg-accent text-bg font-bold rounded-lg hover:bg-accent/90 transition-colors uppercase tracking-wide"
            >
              Browse Forums 👉
            </a>
            <a
              href="#groups"
              className="px-8 py-4 bg-bg-alt text-white font-bold rounded-lg border border-white/10 hover:border-accent/50 transition-colors uppercase tracking-wide"
            >
              Find Study Groups
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}