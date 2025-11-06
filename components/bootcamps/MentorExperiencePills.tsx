"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type CardKey = 'green' | 'white' | 'yellow';

export function MentorExperiencePills() {
  const [activeCard, setActiveCard] = useState<CardKey | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastScrollYRef = useRef<number>(0);

  const handleClick = (card: CardKey) => {
    setActiveCard((prev) => (prev === card ? null : card));
  };

  // Keyboard navigation across the three pills
  const handleKeyNav = (e: React.KeyboardEvent) => {
    const order: CardKey[] = ['green', 'white', 'yellow'];
    const current = activeCard ?? 'white';
    const i = order.indexOf(current);
    if (e.key === 'ArrowRight') setActiveCard(order[(i + 1) % order.length]);
    if (e.key === 'ArrowLeft') setActiveCard(order[(i + order.length - 1) % order.length]);
    if (e.key === 'Escape') setActiveCard(null);
  };

  // Auto-scroll the content panel into view when opening
  useEffect(() => {
    if (!activeCard || !panelRef.current) return;
    panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeCard]);

  // Collapse when clicking outside (but not inside the panel)
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Don't close if clicking inside the panel or container
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setActiveCard(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Auto-collapse pills when user scrolls down
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY || 0;
      const delta = currentY - (lastScrollYRef.current || 0);
      // Collapse only on downward intent and when a panel is open
      if (activeCard && delta > 12) {
        setActiveCard(null);
      }
      lastScrollYRef.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeCard]);

  const getColor = (card: CardKey) => {
    switch (card) {
      case 'green':
        return '#00A977';
      case 'white':
        return '#ffffff';
      case 'yellow':
        return '#FFB347';
      default:
        return 'transparent';
    }
  };

  const getShadow = (card: CardKey) => {
    switch (card) {
      case 'green':
        return '0 25px 80px rgba(0,169,119,0.4)';
      case 'white':
        return '0 25px 80px rgba(0,0,0,0.1)';
      case 'yellow':
        return '0 25px 80px rgba(255,179,71,0.4)';
      default:
        return 'none';
    }
  };

  // Rich content blocks
  const contentUpskill = (
    <div className="space-y-6">
      <p className="text-lg sm:text-xl leading-relaxed">
        For experienced IT or cloud professionals. Move fast with project-based bootcamps that
        deliver outcomes in weeks, not months.
      </p>
      <ul className="space-y-2 text-lg sm:text-xl">
        <li className="flex gap-2"><span>-</span><span>Fast-paced, portfolio-ready build cycles.</span></li>
        <li className="flex gap-2"><span>-</span><span>Hands-on coaching from senior architects.</span></li>
      </ul>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-emerald-700/25 px-6 py-5 border border-emerald-500/40 shadow-[0_20px_45px_rgba(250,204,21,0.25)] ring-2 ring-yellow-300/50">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-yellow-300 mb-3">Bootcamps</h4>
          <ul className="space-y-2 text-base sm:text-lg text-emerald-50/90">
            <li>Cloud Engineering Bootcamp</li>
            <li>Cloud Solution Architect Bootcamp</li>
            <li>Cloud Networking Bootcamp</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-emerald-700/25 px-6 py-5 border border-emerald-500/40 shadow-[0_20px_45px_rgba(250,204,21,0.25)] ring-2 ring-yellow-300/50">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-yellow-300 mb-3">Certification Bootcamps Targets</h4>
          <ul className="space-y-2 text-base sm:text-lg text-emerald-50/90">
            <li>AWS Certified Solutions Architect - Professional</li>
            <li>Microsoft AZ-305: Infrastructure Expert</li>
            <li>Microsoft AZ-400: DevOps Engineer Expert</li>
            <li>Microsoft SC-100: Cybersecurity Architect</li>
            <li>Google Cloud Professional Cloud Architect</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 pt-6">
        <Link
          href="/bootcamps#upcoming"
          className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-yellow-300 shadow-[0_12px_30px_rgba(250,204,21,0.35)] ring-2 ring-yellow-300/50 transition hover:bg-white/25"
        >
          View Bootcamps
        </Link>
        <Link
          href="/bootcamps#certificate-tracks"
          className="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-yellow-300 shadow-[0_12px_30px_rgba(250,204,21,0.35)] ring-2 ring-yellow-300/50 transition hover:border-white/60 hover:bg-white/10"
        >
          Certification Bootcamps
        </Link>
      </div>
    </div>
  );

  const contentFoundational = (
    <div className="space-y-5">
      <p className="text-base sm:text-lg leading-relaxed">
        Build core cloud skills, then focus on the certification pathway that fits your destination role in 3-6 months.
      </p>
      
      {/* Compact two-column layout */}
      <div className="grid md:grid-cols-[1fr,1px,1fr] gap-5 items-start">
        {/* Left: Foundation Path */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-300/60">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-base font-bold text-slate-900 shadow-sm">1</div>
            <h4 className="text-base font-semibold text-slate-900">Start: Cloud Foundation</h4>
          </div>
          
          <div className="flex items-start gap-3 rounded-xl bg-emerald-50/80 border border-emerald-200/60 px-4 py-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600" aria-hidden="true">
              <span className="i-lucide-sparkles text-base" />
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">For beginners building complete cloud skills with mentor guidance.</p>
          </div>

          <Link
            href="/bootcamps/register?track=Cloud%20Foundation"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-emerald-600 transition"
          >
            Register Foundation Bootcamp
            <span className="i-lucide-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        {/* Divider */}
        <div className="hidden md:block bg-gradient-to-b from-slate-200/0 via-slate-300/60 to-slate-200/0 h-full" />

        {/* Right: Certificate Path */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-300/60">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300 text-base font-bold text-slate-900 shadow-sm">2</div>
            <h4 className="text-base font-semibold text-slate-900">Then: Pick Certificate</h4>
          </div>

          <div className="rounded-xl bg-slate-50/90 border border-slate-200/60 px-4 py-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                <span>AWS Solutions Architect</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                <span>GCP Cloud Engineer</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                <span>Azure Administrator</span>
              </div>
            </div>
          </div>

          <Link
            href="/bootcamps#certificate-tracks"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-50/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 hover:bg-emerald-100 transition"
          >
            View All Tracks
            <span className="i-lucide-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Compact CTA footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-200/70 bg-emerald-50/40 px-5 py-3 mt-4">
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-medium text-slate-900">Ready to start your journey?</p>
          <p className="text-xs text-slate-600 mt-1">Get accountability, coaching & a tailored roadmap.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/bootcamps/register?track=Foundational%20Path"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-emerald-600 transition"
          >
            <span className="i-lucide-rocket text-sm" />
            Register
          </Link>
          <Link
            href="/mentoring?type=one-on-one"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700 hover:bg-emerald-100 transition"
          >
            <span className="i-lucide-user-round text-sm" />
            Mentorship
          </Link>
        </div>
      </div>
    </div>
  );

  const contentLongTerm = (
    <div className="space-y-8">
      <p className="text-lg sm:text-xl leading-relaxed">
        For absolute beginners in IT. Build momentum with structured phases that take you from
        foundational knowledge to specialized certification tracks over 12+ months.
      </p>
      <div className="grid gap-8 md:grid-cols-3">
        {[
          {
            phase: 'Foundation',
            blurb: 'Establish technical fundamentals, workflows, and confidence.',
            certifications: [
              'AWS Certified Solutions Architect - Associate',
              'Microsoft AZ-500: Security Engineer Associate',
              'Google Associate Cloud Engineer',
            ],
          },
          {
            phase: 'Intermediate',
            blurb: 'Layer in platform depth, automation, and security design.',
            certifications: [
              'AWS Certified Solutions Architect - Professional',
              'Microsoft AZ-305: Infrastructure Expert',
              'Microsoft AZ-400: DevOps Engineer Expert',
            ],
          },
          {
            phase: 'Advanced',
            blurb: 'Lead architecture strategy across multi-cloud environments.',
            certifications: [
              'Microsoft SC-100: Cybersecurity Architect',
              'Google Cloud Professional Cloud Architect',
            ],
          },
        ].map((level, idx) => (
          <div
            key={level.phase}
            className="relative rounded-3xl border border-emerald-200/70 bg-white/95 px-6 py-7 shadow-[0_18px_40px_rgba(16,185,129,0.22)]"
          >
            <div className="absolute -top-6 left-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white text-lg font-semibold shadow-lg">
              {idx + 1}
            </div>
            <h4 className="text-xl font-semibold text-slate-900">{level.phase}</h4>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{level.blurb}</p>
            <div className="mt-5 space-y-3 text-sm text-slate-800">
              {level.certifications.map((cert) => (
                <div key={cert} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-emerald-200/70 bg-white/95 px-6 py-6 shadow-[0_20px_50px_rgba(16,185,129,0.22)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h5 className="text-lg font-semibold text-slate-900">Stay committed for the full journey</h5>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              Secure your spot in the long-term cohort or schedule dedicated mentorship to tailor the 12+ month roadmap to your goals.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/bootcamps/register?track=Long-Term%20Path"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow hover:bg-emerald-600 transition"
            >
              <span className="i-lucide-rocket" aria-hidden="true" />
              Register for Program
            </Link>
            <Link
              href="/mentoring?type=one-on-one"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/70 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-emerald-600 hover:bg-emerald-100 transition"
            >
              <span className="i-lucide-user-round" aria-hidden="true" />
              Book 1-on-1 Mentorship
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-6 pt-12 pb-0">
      <div
        ref={containerRef}
        className="relative z-10 flex w-full flex-wrap items-center justify-center gap-6 md:gap-10"
        onKeyDown={handleKeyNav}
        aria-label="Mentor Experience Options"
      >
        {/* Green pill */}
        <motion.button
          id="pill-green"
          aria-expanded={activeCard === 'green'}
          aria-controls="mentor-panel"
          className={`relative -rotate-2 flex min-w-[220px] items-center gap-4 rounded-[6rem] bg-[#00A977] px-12 py-8 text-white shadow-[0_15px_40px_rgba(0,169,119,0.5)] focus:outline-none focus:ring-4 focus:ring-[#00A977]/40 ${
            activeCard === 'green' ? 'z-30 ring-4 ring-white' : ''
          }`}
          whileHover={{ scale: 1.03, rotate: 0 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => handleClick('green')}
        >
          <span className="text-lg">→</span>
          <div className="text-center text-sm font-semibold uppercase tracking-[0.25em]">
            Professional <br /> Upskill (1–2 Weeks)
          </div>
        </motion.button>

        {/* White pill */}
        <motion.button
          id="pill-white"
          aria-expanded={activeCard === 'white'}
          aria-controls="mentor-panel"
          className={`relative flex min-w-[220px] items-center gap-4 rounded-[6rem] bg-white px-12 py-8 text-black shadow-[0_15px_40px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-4 focus:ring-[#00A977]/40 ${
            activeCard === 'white' ? 'z-40 ring-4 ring-[#00A977]/40' : ''
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => handleClick('white')}
        >
          <span className="text-lg">→</span>
          <div className="text-center text-sm font-semibold uppercase tracking-[0.25em]">
            Foundational + <br /> Certificate (3–6 Months)
          </div>
        </motion.button>

        {/* Yellow pill */}
        <motion.button
          id="pill-yellow"
          aria-expanded={activeCard === 'yellow'}
          aria-controls="mentor-panel"
          className={`relative rotate-2 flex min-w-[220px] items-center gap-4 rounded-[6rem] bg-[#FFB347] px-12 py-8 text-black shadow-[0_15px_40px_rgba(255,179,71,0.5)] focus:outline-none focus:ring-4 focus:ring-[#FFB347]/40 ${
            activeCard === 'yellow' ? 'z-30 ring-4 ring-white' : ''
          }`}
          whileHover={{ scale: 1.03, rotate: 0 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => handleClick('yellow')}
        >
          <span className="text-lg">→</span>
          <div className="text-center text-sm font-semibold uppercase tracking-[0.25em]">
            Long‑Term <br /> Path (12+ Months)
          </div>
        </motion.button>
      </div>

      {/* Description panel with smooth expansion */}
      <AnimatePresence initial={false}>
        {activeCard && (
          <motion.div
            key={activeCard}
            id="mentor-panel"
            ref={panelRef}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="mt-8"
            role="region"
            aria-labelledby={`pill-${activeCard}`}
          >
            <motion.div
              layout
              className={`mx-auto max-w-5xl rounded-[2rem] px-8 py-8 ${
                activeCard === 'white' ? 'text-slate-900' : 'text-white'
              }`}
              style={{ backgroundColor: getColor(activeCard), boxShadow: getShadow(activeCard) }}
            >
              {activeCard === 'green' && contentUpskill}
              {activeCard === 'white' && contentFoundational}
              {activeCard === 'yellow' && contentLongTerm}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
