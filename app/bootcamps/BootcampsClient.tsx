"use client";

import { useState } from 'react';

export function BootcampsClient() {
  const trackCards = [
    { icon: 'i-lucide-globe', title: 'Cloud Foundation', body: 'Build a strong baseline in cloud computing. Learn core concepts, essential services, and industry best practices—perfect for beginners.' },
    { icon: 'i-lucide-settings', title: 'Cloud Engineering', body: 'Develop the technical expertise to deploy, manage, and automate cloud environments using production-grade tooling.' },
    { icon: 'i-lucide-building-2', title: 'Cloud Solution Architect', body: 'Design scalable, secure, and cost-efficient architectures. Apply frameworks and integration strategies to real scenarios.' },
    { icon: 'i-lucide-network', title: 'Cloud Networking', body: 'Master networking in cloud environments: VPC design, load balancing, interconnectivity, security, and performance for resilient architectures.' }
  ];
  return (
    <section className="max-w-4xl space-y-6">
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">
        Live Bootcamps
        <span className="align-middle ml-3 inline-flex items-center gap-2 rounded-full bg-warning/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/40">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
          </span>
          Available Now
        </span>
        <a href="/mentoring" className="align-middle ml-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent ring-1 ring-accent/30 hover:bg-accent/25 hover:ring-accent/50 transition" aria-label="Book Your Mentorship Session">
          <span className="i-lucide-user-round h-4 w-4" />
          Book Your Mentorship Session
        </a>
      </h1>
      <p className="text-fg-muted text-base md:text-lg leading-relaxed">Hands-on, instructor-led programs designed to build practical cloud skills in real time. Choose the path that matches your career goals:</p>
      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4 pt-4">
        {trackCards.map((card, idx) => (
          <div key={card.title} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className={`h-10 w-10 inline-flex items-center justify-center rounded-xl bg-accent/15 text-accent ${card.icon}`} />
              <h3 className="font-semibold tracking-tight text-lg flex items-center gap-2">
                {card.title}
                <span className="inline-flex items-center rounded-full bg-warning/15 text-warning px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-warning/40">Live</span>
              </h3>
            </div>
            <p className="text-sm text-fg-muted leading-relaxed flex-1">{card.body}</p>
            <div className="mt-5 pt-1 flex items-center gap-4">
              <a href="#upcoming" className="text-xs font-medium text-accent hover:text-accent-alt transition">See cohorts →</a>
              <a
                href={`/bootcamps/register?track=${encodeURIComponent(card.title)}`}
                aria-label={`Register for ${card.title}`}
                data-cta="register"
                className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-5 py-2 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                </span>
                <span>Register Now</span>
                <span className="i-lucide-arrow-right text-[14px] -mr-1" />
                <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-warning/20 animate-pulse" />
              </a>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
          </div>
        ))}
      </div>
    </section>
  );
}
