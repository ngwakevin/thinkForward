'use client';

import React from 'react';
import Link from 'next/link';

type PathConfig = {
  id: number;
  label: string;
  description: string;
  tabColor: string;
  tabColorInactive: string;
  textColor: string;
  arrowColor: string;
  baseColor: string;
  content: React.ReactNode;
};

const TAB_RADIUS = '3rem';

const paths: PathConfig[] = [
  {
    id: 1,
    label: 'PROFESSIONAL UPSKILL (1-2 WEEKS)',
    description:
      'For experienced IT or cloud professionals ready to accelerate outcomes through focused project sprints.',
    tabColor: '#15803d',
    tabColorInactive: '#166534',
    textColor: 'text-white',
    arrowColor: 'text-white',
    baseColor: '#14532d',
    content: (
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
    ),
  },
  {
    id: 2,
    label: 'FOUNDATIONAL + CERTIFICATE (3-6 MONTHS)',
    description:
      'Foundational + Certificate (3-6 months) for beginners building complete cloud skills with guided progression.',
    tabColor: '#facc15',
    tabColorInactive: '#eab308',
    textColor: 'text-slate-900',
    arrowColor: 'text-slate-900',
    baseColor: '#facc15',
    content: (
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
            <p className="text-emerald-50/95 leading-relaxed">
              For beginners building complete cloud skills.
            </p>
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
    ),
  },
  {
    id: 3,
    label: 'LONG-TERM PATH (12+ MONTHS)',
    description:
      'For absolute beginners in IT ready to commit to a year-long transformation with guided milestones from zero to certified professional.',
    tabColor: '#22c55e',
    tabColorInactive: '#bbf7d0',
    textColor: 'text-slate-900',
    arrowColor: 'text-slate-900',
    baseColor: '#22c55e',
    content: (
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
                {level.certifications.map(cert => (
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
    ),
  },
];

export function BootcampPaths() {
  const [selectedPath, setSelectedPath] = React.useState<number>(2);

  const activePath = paths.find((path) => path.id === selectedPath) ?? paths[0];

  return (
    <section className="rounded-3xl border border-border/60 bg-bg px-4 py-12 shadow-2xl sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-fg-muted">
            Guided Pathways
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Choose the journey that fits your momentum
          </h2>
          <p className="text-base text-fg-muted">
            Three clear tracks to level up cloud talent from rapid upskill to long-term mastery.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-3">
          {paths.map((path) => {
            const isActive = path.id === selectedPath;
            return (
              <button
                key={path.id}
                onClick={() => setSelectedPath(path.id)}
                type="button"
                className={`inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${isActive ? 'shadow-lg' : 'shadow-sm'} ${path.textColor}`}
                style={{
                  backgroundColor: isActive ? path.tabColor : path.tabColorInactive,
                }}
              >
                <span className={`text-sm ${path.arrowColor}`}>→</span>
                <span className="text-center leading-tight sm:text-sm">{path.label}</span>
              </button>
            );
          })}
        </div>

        <div
          className="rounded-3xl border border-border/60 px-8 py-10 shadow-xl transition-colors"
          style={{
            background:
              selectedPath === 1
                ? 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)'
                : selectedPath === 2
                ? 'linear-gradient(180deg, #fde047 0%, #facc15 45%, #eab308 100%)'
                : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          <div className={activePath.textColor}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-2xl sm:text-3xl font-semibold uppercase tracking-wide">
                {activePath.label}
              </h3>
            </div>
            {activePath.content}
          </div>
        </div>
      </div>
    </section>
  );
}
