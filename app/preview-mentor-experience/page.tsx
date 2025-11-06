"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { events } from '../../data/events';
import { computeStatus } from '../../components/events/StatusBadge';
import { EventCard } from '../../components/events/EventCard';
import { BootcampsClient } from '../bootcamps/BootcampsClient';

type CardKey = 'green' | 'white' | 'yellow';

export default function MentorExperienceSection() {
  const [activeCard, setActiveCard] = useState<CardKey | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastScrollYRef = useRef<number>(0);
  const bootcamps = events
    .filter((e) => e.type === 'bootcamp')
    .map((e) => ({ ...e, status: computeStatus(e) }));

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

  // Collapse when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveCard(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // (Reverted) No auto-collapse on scroll in this version
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

  // Rich content blocks copied from main BootcampPaths for exact parity
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
          href="/bootcamps"
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
    <div className="space-y-6">
      <p className="text-lg sm:text-xl leading-relaxed">
        Build core cloud skills, then focus on the certification pathway that fits your destination
        role in 3-6 months.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 text-base sm:text-lg">
        <div
          className="flex items-start gap-4 rounded-3xl border border-emerald-500/50 px-5 py-4 shadow-[0_18px_35px_rgba(21,128,61,0.28)]"
          style={{
            background:
              'linear-gradient(135deg, rgba(20,83,45,0.95) 0%, rgba(21,128,61,0.88) 45%, rgba(22,163,74,0.82) 100%)',
          }}
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-yellow-300 ring-2 ring-emerald-300/40" aria-hidden="true">
            <span className="i-lucide-sparkles text-xl" />
          </span>
          <p className="text-emerald-50/95 leading-relaxed">For beginners building complete cloud skills.</p>
        </div>
        <div
          className="flex items-start gap-4 rounded-3xl border border-emerald-500/50 px-5 py-4 shadow-[0_18px_35px_rgba(21,128,61,0.28)]"
          style={{
            background:
              'linear-gradient(135deg, rgba(20,83,45,0.95) 0%, rgba(21,128,61,0.88) 45%, rgba(22,163,74,0.82) 100%)',
          }}
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-yellow-300 ring-2 ring-emerald-300/40" aria-hidden="true">
            <span className="i-lucide-compass text-xl" />
          </span>
          <p className="text-emerald-50/95 leading-relaxed">
            Guided by mentors through foundation and certification sprints.
          </p>
        </div>
      </div>
      <div className="relative rounded-3xl bg-white/80 px-6 py-8 border border-yellow-300/60 shadow-[0_25px_55px_rgba(250,204,21,0.25)]">
        <div className="space-y-10">
          <div className="grid gap-4 md:grid-cols-[auto,1fr] items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-2xl font-bold text-slate-900 shadow-inner">1</div>
            <div className="space-y-3">
              <p className="text-xl font-semibold text-slate-900">Cloud Foundation</p>
              <div className="flex flex-wrap items-center gap-3 text-lg text-slate-900/90">
                <span className="font-medium">Cloud Foundation</span>
                <span className="i-lucide-arrow-right text-2xl" aria-hidden="true" />
                <Link
                  href="/bootcamps/register?track=Cloud%20Foundation"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-emerald-600 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/25 hover:text-emerald-700"
                >
                  Register for Bootcamp
                  <span className="i-lucide-arrow-up-right" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[auto,1fr]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-300 text-2xl font-bold text-slate-900 shadow-inner">2</div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xl font-semibold text-slate-900">
                Choose Your Certificate Track
                <span className="i-lucide-arrow-right text-2xl" aria-hidden="true" />
                <Link
                  href="/bootcamps#certificate-tracks"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-emerald-600 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/25 hover:text-emerald-700"
                >
                  Register for Bootcamp
                  <span className="i-lucide-arrow-up-right" aria-hidden="true" />
                </Link>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 bottom-1 border-l-2 border-dashed border-slate-500/40" aria-hidden="true" />
                <ul className="space-y-3 text-base sm:text-lg text-slate-800">
                  <li className="flex items-center gap-3">
                    <span className="i-lucide-corner-right-down text-lg text-slate-500" aria-hidden="true" />
                    <span>AWS Associate Solution Architect</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="i-lucide-corner-right-down text-lg text-slate-500" aria-hidden="true" />
                    <span>GCP Associate Cloud Engineer</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="i-lucide-corner-right-down text-lg text-slate-500" aria-hidden="true" />
                    <span>Microsoft Certified: Azure Administrator Associate</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-emerald-200/70 bg-white/90 px-6 py-6 shadow-[0_20px_50px_rgba(16,185,129,0.25)]">
              <h5 className="text-lg font-semibold text-slate-900">Ready to commit?</h5>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Register for the full program to unlock accountability, expert coaching, and a tailored roadmap for the next 3-6 months.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
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

  // Certificate tracks copied from main bootcamps page (condensed meta)
  const certificateTracks = [
    {
      title: 'AZ-305: Designing Microsoft Azure Infrastructure Solutions',
      provider: 'Microsoft Azure',
      level: 'Expert',
      icon: 'Cloud',
      description:
        'Design identity, governance, monitoring, data storage, business continuity, and infrastructure solutions.',
      duration: '120-160h',
      tags: ['Azure', 'Architecture', 'Design'],
      color: 'accent',
      curriculum: [
        'Identity, governance, and monitoring',
        'Data storage and business continuity',
        'Infrastructure and network architecture',
      ],
    },
    {
      title: 'AZ-400: Designing and Implementing Microsoft DevOps Solutions',
      provider: 'Microsoft Azure',
      level: 'Expert',
      icon: 'GitBranch',
      description:
        'Source control, build and release pipelines, security and compliance, instrumentation and monitoring.',
      duration: '100-140h',
      tags: ['DevOps', 'CI/CD', 'Azure'],
      color: 'accent',
      curriculum: ['Source control and processes', 'Pipelines', 'Security, compliance, instrumentation'],
    },
    {
      title: 'SC-100: Microsoft Certified: Cybersecurity Architect Expert',
      provider: 'Microsoft',
      level: 'Expert',
      icon: 'Shield',
      description:
        'Security operations, identity and compliance, infra/app/data security aligned to best practices.',
      duration: '80-120h',
      tags: ['Security', 'Architecture', 'Compliance'],
      color: 'danger',
      curriculum: ['Operations and identity', 'Infrastructure security', 'App/data protection'],
    },
    {
      title: 'AZ-500: Microsoft Certified: Azure Security Engineer Associate',
      provider: 'Microsoft Azure',
      level: 'Associate',
      icon: 'Lock',
      description:
        'Identity and access, network security, compute/storage/db protection, Defender and Sentinel.',
      duration: '60-90h',
      tags: ['Security', 'Azure', 'Identity'],
      color: 'accent',
      curriculum: ['Identity and networking', 'Compute/storage/db', 'Defender and Sentinel'],
    },
    {
      title: 'Google Cloud Professional Cloud Architect',
      provider: 'Google Cloud',
      level: 'Professional',
      icon: 'Building2',
      description:
        'Plan architecture, manage infrastructure, design for security/compliance, and ensure reliability.',
      duration: '100-140h',
      tags: ['GCP', 'Architecture', 'Design'],
      color: 'warning',
      curriculum: ['Architecture and planning', 'Infra and security', 'Implementation and reliability'],
    },
    {
      title: 'Google Cloud Associate Cloud Engineer',
      provider: 'Google Cloud',
      level: 'Associate',
      icon: 'Settings',
      description:
        'Set up environments, implement solutions, operate workloads, and configure access/security.',
      duration: '60-90h',
      tags: ['GCP', 'Operations', 'Engineering'],
      color: 'warning',
      curriculum: ['Environment setup', 'Implementation', 'Operations and security'],
    },
    {
      title: 'AWS Certified Solutions Architect - Associate',
      provider: 'Amazon Web Services',
      level: 'Associate',
      icon: 'LayoutGrid',
      description:
        'Design secure, resilient, high-performing, and cost-optimized architectures on AWS.',
      duration: '60-90h',
      tags: ['AWS', 'Architecture', 'Cloud'],
      color: 'warning',
      curriculum: ['Security and resilience', 'Performance', 'Cost optimization'],
    },
    {
      title: 'AWS Certified Solutions Architect - Professional',
      provider: 'Amazon Web Services',
      level: 'Professional',
      icon: 'Network',
      description:
        'Design for complexity, new solutions, continuous improvements, and modernization/migration.',
      duration: '120-160h',
      tags: ['AWS', 'Architecture', 'Advanced'],
      color: 'warning',
      curriculum: ['Org complexity', 'New solutions', 'Migration and modernization'],
    },
  ];

  return (
    <>
      {/* New design preview on site background (no gradients) */}
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

      {/* Full Bootcamps content preview */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 space-y-20">
        <BootcampsClient />

        {/* Certificate Tracks Section */}
        <section id="certificate-tracks" className="space-y-10">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold tracking-tight">Bootcamp Certificate Tracks</h2>
            <p className="text-fg-muted text-base leading-relaxed max-w-3xl">
              Prepare for industry-recognized certifications with our structured bootcamp programs. Each track includes hands-on labs, practice exams, and expert guidance.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {certificateTracks.map((cert, idx) => {
              const levelColors: Record<string, string> = {
                Expert: 'bg-danger/15 text-danger',
                Professional: 'bg-warning/15 text-warning',
                Associate: 'bg-accent/15 text-accent',
              };
              return (
                <div
                  key={idx}
                  className="relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/20 p-6 shadow-sm group min-h-[420px]"
                >
                  <div className="flex flex-col w-full h-full">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg bg-${cert.color}/15 text-${cert.color} grid place-items-center`}>
                          <span className={`i-lucide-${cert.icon.toLowerCase()} h-5 w-5`} />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-semibold tracking-tight leading-snug">{cert.title}</h3>
                          <p className="mt-1 text-[10px] uppercase tracking-wide text-fg-muted">{cert.provider}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`inline-block rounded-md px-2 py-1 text-[10px] font-medium tracking-wide ${levelColors[cert.level]}`}>
                          {cert.level}
                        </span>
                      </div>
                    </div>
                    <p className="text-fg-muted leading-relaxed text-sm line-clamp-3">{cert.description}</p>
                    <div className="mt-4 space-y-2">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-fg">Curriculum</h4>
                      <ul className="space-y-1.5">
                        {cert.curriculum.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-fg-muted">
                            <span className="mt-1 h-1 w-1 rounded-full bg-accent flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cert.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-md bg-bg-alt/60 border border-border/50 px-2 py-0.5 text-[10px] tracking-wide text-fg-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs">
                      <span className="text-fg-muted">≈ {cert.duration}</span>
                      <a
                        href={`/bootcamps/register?track=${encodeURIComponent(cert.title)}`}
                        className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent ring-1 ring-accent/40 hover:bg-accent/25 transition"
                      >
                        Register Now
                      </a>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
                </div>
              );
            })}
          </div>
        </section>

        <section id="upcoming" className="space-y-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Upcoming Cohorts</h2>
          {bootcamps.length === 0 && (
            <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 text-sm text-fg-muted">
              No bootcamps open right now. Join the waitlist via any event page.
            </div>
          )}
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {bootcamps.map((b: any) => (
              <EventCard key={b.slug} evt={b} />
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/30 p-10 flex flex-col md:flex-row md:items-center gap-10">
            <div className="md:flex-1 space-y-4">
              <h2 className="font-display text-2xl font-bold tracking-tight">Need a different focus?</h2>
              <p className="text-sm text-fg-muted leading-relaxed">
                Explore live sessions, workshops, and strategy events to complement your cohort experience or warm up before applying.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="/events"
                  className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-xs font-semibold tracking-wide text-white shadow hover:bg-accent-alt transition"
                >
                  Browse Events
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center rounded-md border border-border/70 px-5 py-2.5 text-xs font-semibold tracking-wide hover:border-accent hover:text-accent transition"
                >
                  Ask a Question
                </a>
              </div>
            </div>
            <ul className="grid gap-4 text-xs md:w-72">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Small cohort sizes for focused feedback
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Structured weekly execution rhythm
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Portfolio and scenario based assessment
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Accountability & momentum reinforcement
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
