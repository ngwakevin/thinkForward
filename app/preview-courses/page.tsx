import { HeroPreview } from "@/components/sections/preview/Hero.preview";
import { products } from '@/data/products';

export const metadata = { title: 'Courses – Preview' };

const courseCategories = [
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: "Cloud Fundamentals",
    description: "Start your cloud journey with foundational concepts, architectures, and best practices.",
    courseCount: 12,
    hours: "40-60h",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "DevOps & Automation",
    description: "Master CI/CD pipelines, infrastructure as code, and automated deployment strategies.",
    courseCount: 18,
    hours: "60-80h",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Security & Compliance",
    description: "Learn cloud security fundamentals, identity management, and compliance frameworks.",
    courseCount: 15,
    hours: "50-70h",
  },
  {
    icon: (
      <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Data & Analytics",
    description: "Explore cloud data platforms, analytics tools, and machine learning foundations.",
    courseCount: 10,
    hours: "45-65h",
  },
];

const featuredCourses = products.slice(0, 6);

export default function CoursesPreviewPage() {
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
                LEARNING PATHS
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Courses & Learning Tracks
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-fg-muted leading-relaxed max-w-3xl mx-auto">
              Build cloud expertise with structured learning paths designed by industry experts. From fundamentals to advanced topics.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <a 
                href="#explore-courses"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-bold text-lg hover:shadow-xl hover:shadow-accent/40 hover:scale-105 transition-all duration-200"
              >
                EXPLORE COURSES 👉
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-bg-alt border border-accent/40 text-white font-semibold text-lg hover:bg-accent/10 hover:border-accent transition-all duration-200"
              >
                TALK TO ADVISOR
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section id="explore-courses" className="relative bg-gradient-to-b from-bg-alt to-bg py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              Learning Categories
            </h2>
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
              Choose your path based on your goals and interests
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {courseCategories.map((category, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-bg-alt/60 to-bg/80 rounded-2xl p-8 md:p-10 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/10 space-y-6"
              >
                {/* Icon */}
                <div className="w-11 h-11 text-accent group-hover:text-accent-alt transition-colors">
                  {category.icon}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                    {category.title}
                  </h3>
                  <p className="text-base text-fg-muted leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-fg-muted pt-2 border-t border-border/40">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {category.courseCount} courses
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {category.hours}
                  </span>
                </div>

                {/* CTA */}
                <a 
                  href="/courses"
                  className="inline-flex items-center gap-2 text-base font-semibold text-accent hover:text-accent-alt transition-colors group"
                >
                  View Courses
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
        
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>

      {/* Featured Courses */}
      <section className="relative bg-bg py-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white">
              Featured Courses
            </h2>
            <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
              Start with our most popular learning paths
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-bg-alt/50 to-bg/80 rounded-2xl p-6 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/10 space-y-4"
              >
                {/* Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-xs font-semibold text-accent uppercase">
                  {course.difficulty || 'intermediate'}
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-white">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-fg-muted leading-relaxed line-clamp-3">
                  {course.body}
                </p>

                {/* CTA */}
                <a 
                  href={`/courses/${course.key}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-alt transition-colors group"
                >
                  Learn More
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
        
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </section>
    </main>
  );
}
