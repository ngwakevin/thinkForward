"use client";

const supportItems = [
  {
    title: "24/7 Discord Community",
    description: "Get help anytime from peers and mentors in our active Discord server.",
  },
  {
    title: "Weekly Office Hours",
    description: "Join live Q&A sessions with instructors to clarify concepts and get guidance.",
  },
  {
    title: "Career Services",
    description: "Access job boards, resume reviews, and mock interviews to land your dream role.",
  },
];

export function SupportEcosystemPreview() {
  return (
    <section className="relative bg-gradient-to-b from-bg-alt to-bg py-24">
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Comprehensive Support Ecosystem
          </h2>
          <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
            You&apos;re never alone on your cloud journey. Our multi-layered support system ensures you always have the help you need.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Support Items */}
          <div className="space-y-6">
            {supportItems.map((item, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-bg-alt/60 to-bg/80 rounded-2xl p-6 md:p-8 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/10 space-y-3"
              >
                <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-base text-fg-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Decorative Card with liquid glass effect */}
          <div className="relative rounded-3xl overflow-hidden min-h-[400px] bg-gradient-to-br from-accent/10 to-accent-alt/5 border border-accent/20 shadow-xl shadow-accent/10">
            {/* Liquid glass layers */}
            <div 
              aria-hidden 
              className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent-alt/20 backdrop-blur-3xl"
            />
            <div 
              aria-hidden 
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/30 rounded-full blur-3xl"
            />
            <div 
              aria-hidden 
              className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-alt/30 rounded-full blur-3xl"
            />
            
            {/* Content overlay */}
            <div className="relative p-10 flex flex-col justify-center h-full space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-alt shadow-lg shadow-accent/30">
                <svg className="w-10 h-10 text-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="space-y-3">
                <h3 className="font-display text-3xl font-bold text-white">
                  Join 5,000+ Cloud Professionals
                </h3>
                <p className="text-lg text-fg-muted leading-relaxed">
                  Be part of a thriving community that supports each other&apos;s growth and celebrates wins together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
