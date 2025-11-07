"use client";

export function HeroPreview() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-bg to-bg-alt pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" aria-hidden />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Creative headline with overlapping stacked blocks */}
          <div className="relative max-w-xl">
            {/* Stacked text blocks - Designlab style with your brand colors */}
            <div className="relative">
              {/* "Train" block */}
              <div className="relative inline-block bg-gradient-to-br from-accent to-accent-alt rounded-[32px] px-10 py-6 md:px-14 md:py-8 shadow-lg shadow-accent/20 z-30">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-none">
                  Train
                </h1>
              </div>
              
              {/* "Build" block - overlapping and offset to right */}
              <div className="relative inline-block bg-gradient-to-br from-accent-alt to-accent rounded-[32px] px-10 py-6 md:px-14 md:py-8 shadow-lg shadow-accent/20 -mt-3 ml-16 md:ml-24 lg:ml-32 z-20">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-none">
                  Build
                </h1>
              </div>
              
              {/* "Elevate" block - overlapping and offset */}
              <div className="relative inline-block bg-gradient-to-br from-accent to-accent-alt rounded-[32px] px-10 py-6 md:px-14 md:py-8 shadow-lg shadow-accent/20 -mt-3 ml-8 md:ml-12 lg:ml-16 z-10">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-none">
                  Elevate
                </h1>
              </div>
            </div>
          </div>

          {/* Right: Description and CTAs */}
          <div className="space-y-8">
            {/* Description */}
            <p className="text-xl md:text-2xl text-fg-muted leading-relaxed max-w-xl">
              Our industry-leading online programs connect you with experienced cloud engineers — to unlock learning and help you launch and grow a career in cloud & DevOps.
            </p>
            
            {/* CTAs with pointing hand icon */}
            <div className="space-y-4">
              <a 
                href="/bootcamps" 
                className="group flex items-center gap-3 text-lg md:text-xl font-bold text-white hover:text-accent transition-colors"
              >
                <span className="inline-flex items-center">
                  <svg className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="uppercase tracking-wide">EXPLORE CLOUD BOOTCAMP</span>
                <span className="text-3xl md:text-4xl" role="img" aria-label="pointing hand">👉</span>
              </a>
              
              <a 
                href="/courses" 
                className="group flex items-center gap-3 text-lg md:text-xl font-bold text-white hover:text-accent transition-colors"
              >
                <span className="inline-flex items-center">
                  <svg className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="uppercase tracking-wide">VIEW ALL COURSES</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
