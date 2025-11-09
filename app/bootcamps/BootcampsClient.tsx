"use client";

export function BootcampsClient() {
  const trackCards = [
    { icon: 'i-lucide-brain', title: 'AI Foundation', body: 'Get started with AI fundamentals: Python, ML basics, prompt engineering, and simple cloud AI workflows.' },
    { icon: 'i-lucide-globe', title: 'Cloud Foundation', body: 'Build a strong baseline in cloud computing. Learn core concepts, essential services, and industry best practices—perfect for beginners.' },
    { icon: 'i-lucide-settings', title: 'Cloud Engineering', body: 'Develop the technical expertise to deploy, manage, and automate cloud environments using production-grade tooling.' },
    { icon: 'i-lucide-building-2', title: 'Cloud Solution Architect', body: 'Design scalable, secure, and cost-efficient architectures. Apply frameworks and integration strategies to real scenarios.' },
    { icon: 'i-lucide-network', title: 'Cloud Networking', body: 'Master networking in cloud environments: VPC design, load balancing, interconnectivity, security, and performance for resilient architectures.' }
  ];
  
  return (
    <section className="relative z-10 isolate w-full space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">
            Live Bootcamps
          </h1>
          <span className="inline-flex items-center gap-2 rounded-full bg-warning/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/40">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
            </span>
            Available Now
          </span>
          <a 
            href="/mentoring" 
            className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent ring-1 ring-accent/30 hover:bg-accent/25 hover:ring-accent/50 transition" 
            aria-label="Book Your Mentorship Session"
          >
            <span className="i-lucide-user-round h-4 w-4" />
            Book Your Mentorship Session
          </a>
        </div>
        <p className="text-fg-muted text-base md:text-lg leading-relaxed max-w-5xl">
          Hands-on, instructor-led programs designed to build practical cloud skills in real time. Choose the path that matches your career goals:
        </p>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="relative -mx-6 px-6">
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {trackCards.map((card) => (
            <div 
              key={card.title} 
              className="min-w-[320px] max-w-[320px] shrink-0 snap-start flex flex-col rounded-3xl border-2 border-border/40 bg-gradient-to-br from-bg-alt/50 to-bg/30 p-8 shadow-lg hover:border-accent/30 hover:shadow-xl transition-all duration-300"
            >
              {/* Title with LIVE badge */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold tracking-tight text-fg">
                    {card.title}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-accent/15 text-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-accent/30">
                    Live
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-fg-muted leading-relaxed mb-6 flex-1">
                {card.body}
              </p>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a 
                  href="#upcoming" 
                  className="block text-center text-sm font-medium text-accent hover:text-accent-alt transition"
                >
                  See cohorts →
                </a>
                <a
                  href={`/bootcamps/register?track=${encodeURIComponent(card.title)}`}
                  className="relative group flex items-center justify-center gap-2.5 rounded-full bg-warning/20 px-6 py-3 text-xs font-bold uppercase tracking-wider text-warning ring-2 ring-warning/50 shadow-lg shadow-warning/20 hover:bg-warning/30 hover:ring-warning/70 hover:shadow-warning/40 transition-all duration-300"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
                  </span>
                  <span>Enroll Now</span>
                  <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-warning/20 group-hover:ring-warning/40 transition-all" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
