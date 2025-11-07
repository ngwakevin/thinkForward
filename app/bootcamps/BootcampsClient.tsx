"use client";

import { useState } from 'react';

export function BootcampsClient() {
  const trackCards = [
    {
      icon: 'i-lucide-brain',
      title: 'AI Foundation',
      body: 'Get started with AI fundamentals: Python, ML basics, prompt engineering, and simple cloud AI workflows.',
      gradient: 'linear-gradient(140deg, #fef4ff 0%, #e9d6ff 100%)',
      accent: '#8b5cf6'
    },
    {
      icon: 'i-lucide-globe',
      title: 'Cloud Foundation',
      body: 'Build a strong baseline in cloud computing. Learn core concepts, essential services, and industry best practices—perfect for beginners.',
      gradient: 'linear-gradient(140deg, #e6fbff 0%, #cdf4ff 100%)',
      accent: '#0ea5e9'
    },
    {
      icon: 'i-lucide-settings',
      title: 'Cloud Engineering',
      body: 'Develop the technical expertise to deploy, manage, and automate cloud environments using production-grade tooling.',
      gradient: 'linear-gradient(140deg, #fff4ea 0%, #ffe2f2 100%)',
      accent: '#f97316'
    },
    {
      icon: 'i-lucide-building-2',
      title: 'Cloud Solution Architect',
      body: 'Design scalable, secure, and cost-efficient architectures. Apply frameworks and integration strategies to real scenarios.',
      gradient: 'linear-gradient(140deg, #f1f5ff 0%, #e7f6f1 100%)',
      accent: '#14b8a6'
    },
    {
      icon: 'i-lucide-network',
      title: 'Cloud Networking',
      body: 'Master networking in cloud environments: VPC design, load balancing, interconnectivity, security, and performance for resilient architectures.',
      gradient: 'linear-gradient(140deg, #fff3ed 0%, #f5e6ff 100%)',
      accent: '#ec4899'
    }
  ];

  return (
    <section className="relative z-10 isolate w-full max-w-7xl space-y-8 rounded-[48px] border border-white/40 bg-white/40 p-8 shadow-[0_55px_140px_rgba(49,31,73,0.22)] backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#311f49]/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_18px_40px_rgba(49,31,73,0.3)]">
            Live cohorts
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#241639] sm:text-5xl">
            Live Bootcamps with Mentored Outcomes
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#2f1f4b]/80 sm:text-base">
            Hands-on, instructor-led programs designed to ship production-ready skills in realtime.
            Pick the journey that matches your next milestone, then join an upcoming cohort or drop into mentorship.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 self-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#facc15]/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#a16207] ring-1 ring-[#facc15]/40 shadow-[0_12px_32px_rgba(250,204,21,0.25)]">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#facc15]/50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#facc15]" />
            </span>
            Enrolling now
          </span>
          <a
            href="/mentoring"
            className="inline-flex items-center gap-2 rounded-full bg-[#5638ff]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#5638ff] ring-1 ring-[#5638ff]/35 transition hover:bg-[#5638ff]/25 hover:text-[#452cd2]"
            aria-label="Book Your Mentorship Session"
          >
            <span className="i-lucide-user-round h-4 w-4" />
            Book mentorship
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 xl:grid-cols-5">
        {trackCards.map((card) => (
          <div
            key={card.title}
            className="relative flex h-full flex-col overflow-hidden rounded-[32px] border border-white/60 p-6 text-[#241639] shadow-[0_32px_85px_rgba(49,31,73,0.2)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_40px_110px_rgba(49,31,73,0.28)]"
            style={{ background: card.gradient }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${card.accent}1a`, color: card.accent }}
              >
                <span className={`${card.icon} text-lg`} />
              </span>
              <h3 className="font-display text-lg font-semibold leading-tight">
                {card.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#2f1f4b]/80 flex-1">{card.body}</p>
            <div className="mt-6 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.28em] text-[#311f49]">
              <a href="#upcoming" className="inline-flex items-center gap-2 transition hover:text-[#5638ff]">
                See cohorts
                <span className="i-lucide-arrow-right" />
              </a>
              <a
                href={`/bootcamps/register?track=${encodeURIComponent(card.title)}`}
                aria-label={`Register for ${card.title}`}
                data-cta="register"
                className="inline-flex items-center gap-2 rounded-full bg-[#311f49] px-4 py-2 text-white shadow-[0_14px_36px_rgba(49,31,73,0.32)] transition hover:bg-[#5638ff]"
              >
                Register
                <span className="i-lucide-arrow-up-right" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
