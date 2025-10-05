'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// 30‑day starter tasks (already goal specific)
const goalHints: Record<string, string[]> = {
  'Land First Cloud Role': [
    'Complete a foundational cloud services lab (compute, storage, IAM).',
    'Build and document a small end‑to‑end project (deploy + README).',
    'Schedule weekly review of gaps surfaced during practice.'
  ],
  'Transition to DevOps': [
    'Containerize an existing app & add pipeline (build/test).',
    'Introduce IaC (Terraform) for core resources.',
    'Add observability basics (logs + metrics dashboard).'
  ],
  'Advance Toward Architect': [
    'Create reference architecture diagram for a multi‑tier workload.',
    'Run a trade‑off analysis (cost vs resilience) on two designs.',
    'Document threat model & mitigation notes.'
  ],
  'Certification Readiness': [
    'Map exam objectives to current strengths/weak areas.',
    'Do 2 timed practice sets; log incorrect rationale.',
    'Create flash deck for weak domains (spaced repetition).'
  ]
};

// 60‑day extension (Phase 2 builds on first 30 days)
const goalHints60: Record<string, { phase2: string[] }> = {
  'Land First Cloud Role': { phase2: [
    'Expand project with an additional service (queue, CDN, or monitoring).',
    'Implement basic CI (lint/test) & deployment script.',
    'Draft STAR stories for 3 implemented features.'
  ]},
  'Transition to DevOps': { phase2: [
    'Add automated security / vulnerability scan to pipeline.',
    'Introduce infra test (Terraform validate / plan in PR).',
    'Document runbook for environment provisioning.'
  ]},
  'Advance Toward Architect': { phase2: [
    'Prototype chaos / failure injection on a non‑prod stack.',
    'Design cost optimization proposal with projected savings.',
    'Lead internal review of reference architecture iteration.'
  ]},
  'Certification Readiness': { phase2: [
    'Target weakest 2 objective domains with deep lab reps.',
    'Run full timed mock exam and gap log.',
    'Refine flash deck with only persistent misses.'
  ]}
};

// Year (12‑month) macro progression – broken into quarterly themes
const yearPlan: Record<string, { quarter: string; focus: string[] }[]> = {
  'Land First Cloud Role': [
    { quarter: 'Q1', focus: ['Foundational services breadth', 'Hands‑on project shipping cadence', 'Git + basic CI familiarity'] },
    { quarter: 'Q2', focus: ['Deploy multi‑service project', 'Add monitoring & cost awareness', 'Interview narrative refinement'] },
    { quarter: 'Q3', focus: ['Scale patterns intro (autoscaling, caching)', 'Security/IAM deeper dives', '2 additional portfolio artifacts'] },
    { quarter: 'Q4', focus: ['Specialize (platform or DevOps path)', 'Mock interview loops', 'Offer negotiation prep'] }
  ],
  'Transition to DevOps': [
    { quarter: 'Q1', focus: ['Pipeline fundamentals', 'Containerization patterns', 'Terraform / infra as code basics'] },
    { quarter: 'Q2', focus: ['Observability (logs, metrics, traces)', 'Artifact versioning, promotion flow', 'Secrets & config management'] },
    { quarter: 'Q3', focus: ['Resilience & rollback strategies', 'Security scanning & policy as code', 'Cost + performance baselining'] },
    { quarter: 'Q4', focus: ['Platform maturity improvements', 'Team enablement docs & runbooks', 'Driving architectural reviews'] }
  ],
  'Advance Toward Architect': [
    { quarter: 'Q1', focus: ['Domain modeling & integration patterns', 'Trade‑off documentation habit', 'Scaling fundamentals refresher'] },
    { quarter: 'Q2', focus: ['Resilience / failover design', 'Security threat modeling regimen', 'Cost modeling & TCO estimation'] },
    { quarter: 'Q3', focus: ['Performance profiling + capacity planning', 'Platform evolution roadmap drafting', 'Cross‑team communication refinement'] },
    { quarter: 'Q4', focus: ['Strategic architecture vision doc', 'Mentoring / architecture guild facilitation', 'Executive narrative: value articulation'] }
  ],
  'Certification Readiness': [
    { quarter: 'Q1', focus: ['Objective mapping & baseline labs', 'Spaced repetition system setup', 'Time‑boxed focused domain sprints'] },
    { quarter: 'Q2', focus: ['Deep dives on weak domains', 'Scenario translation drills', 'Second practice exam score lift'] },
    { quarter: 'Q3', focus: ['Advanced scenario stitching', 'Exam simulation under time pressure', 'Peer teaching sessions'] },
    { quarter: 'Q4', focus: ['Final certification attempts', 'Knowledge consolidation notes', 'Transition to next role‑aligned specialization'] }
  ]
};

// 6‑month (Months 1‑6) trajectory summaries
const sixMonthPlan: Record<string, string[]> = {
  'Land First Cloud Role': [
    'Ship 2–3 incremental project expansions demonstrating service integration.',
    'Implement CI with tests + lint + basic security scan.',
    'Add monitoring dashboards & simple cost tracking notes.',
    'Iterate résumé / LinkedIn with STAR stories from shipped work.',
    'Begin light mock interview rotation (behavioral + technical).'
  ],
  'Transition to DevOps': [
    'Harden pipeline: build, test, scan, artifact versioning, deploy gating.',
    'Codify infra for multiple environments with drift detection.',
    'Establish observability stack (logs, metrics, traces) & SLO draft.',
    'Automate rollback / recovery playbooks and document runbooks.',
    'Lead one internal enablement session on new delivery workflow.'
  ],
  'Advance Toward Architect': [
    'Own evolution of a reference architecture with documented trade‑offs.',
    'Introduce resilience test (failure injection / chaos pilot).',
    'Produce cost optimization & capacity baseline artifacts.',
    'Facilitate cross‑team design review cadence.',
    'Mentor 1–2 engineers on design reasoning frameworks.'
  ],
  'Certification Readiness': [
    'Achieve stable >80% on targeted practice sets.',
    'Deep lab reps on historically weak domains until variance narrows.',
    'Translate objectives into scenario narratives & architectures.',
    'Complete 2 full timed mock exams with improvement deltas.',
    'Finalize exam date + taper plan (review / rest / light drills).'
  ]
};

// Generic default (no goal) content
const defaultMonth: string[] = [
  'Clarify objective & baseline current strengths / gaps.',
  'Set weekly cadence (planning, execution, review).',
  'Ship 1 small, end‑to‑end artifact to anchor learning.',
  'Establish lightweight tracking (hours, reps, blockers).',
  'Introduce feedback loop (mentor, peer, or self‑review rubric).'
];
const defaultSix: string[] = [
  'Scale project scope responsibly (complexity after reliability).',
  'Automate key lifecycle steps (build, test, deploy, observe).',
  'Integrate resilience & security fundamentals.',
  'Accumulate 2–4 portfolio artifacts showing progression.',
  'Refine narrative: problems solved, impact, and lessons.'
];
const defaultYear: { quarter: string; focus: string[] }[] = [
  { quarter: 'Q1', focus: ['Foundation breadth', 'Cadence discipline', 'First shipped artifact'] },
  { quarter: 'Q2', focus: ['Integration depth', 'Automation & observability', 'Second artifact w/ complexity'] },
  { quarter: 'Q3', focus: ['Resilience & performance awareness', 'Security & cost considerations', 'Public narrative & knowledge sharing'] },
  { quarter: 'Q4', focus: ['Specialization / differentiation', 'Interview / advancement readiness', 'Strategic retrospective & next charter'] }
];

// Level adjustment descriptor (re-added)
const levelAdjust: Record<string, string> = {
  Foundation: 'Focus on breadth + consistent repetition before deep specialization.',
  Intermediate: 'Shift toward integration work and failure scenario drills.',
  Advanced: 'Prioritize architecture trade‑offs, scaling patterns and mentoring others.'
};

// Weekly learning hour guidance (re-added)
const levelHours: Record<string, { range: string; distribution: { label: string; pct: number; why: string }[] }> = {
  Foundation: {
    range: '7–10 hrs / week',
    distribution: [
      { label: 'Practice / Labs', pct: 40, why: 'Muscle memory & fundamentals anchoring.' },
      { label: 'Guided Study', pct: 25, why: 'Concept acquisition & filling gaps.' },
      { label: 'Project / Portfolio', pct: 20, why: 'Evidence of applied capability.' },
      { label: 'Reflection / Notes', pct: 10, why: 'Retention + error analysis.' },
      { label: 'Feedback / Review', pct: 5, why: 'Course‑correct early.' }
    ]
  },
  Intermediate: {
    range: '8–12 hrs / week',
    distribution: [
      { label: 'Practice / Labs', pct: 30, why: 'Refine & expand patterns.' },
      { label: 'Guided Study', pct: 20, why: 'Targeted conceptual depth.' },
      { label: 'Project / Portfolio', pct: 30, why: 'Ship integrated systems.' },
      { label: 'Reflection / Notes', pct: 10, why: 'Consolidate lessons.' },
      { label: 'Feedback / Review', pct: 10, why: 'Accelerate iteration quality.' }
    ]
  },
  Advanced: {
    range: '10–14 hrs / week',
    distribution: [
      { label: 'Architecture / Design Docs', pct: 25, why: 'Strategic system shaping.' },
      { label: 'Deep Dives & Research', pct: 20, why: 'Explore edge trade‑offs & scaling.' },
      { label: 'Platform / Project Evolution', pct: 25, why: 'Deliver compounding technical leverage.' },
      { label: 'Mentoring / Feedback', pct: 15, why: 'Solidify understanding via teaching.' },
      { label: 'Reflection / Metrics', pct: 15, why: 'Assess performance & adjust strategy.' }
    ]
  }
};

// Helper to split month tasks into weekly cycles
function buildMonthlyCycles(all: string[]): { title: string; items: string[] }[] {
  const cycles: { title: string; items: string[] }[] = [];
  const weeks = 4;
  const per = Math.ceil(all.length / weeks);
  for (let i = 0; i < weeks; i++) {
    const slice = all.slice(i * per, (i + 1) * per);
    if (slice.length) cycles.push({ title: `Week ${i + 1}`, items: slice });
  }
  return cycles;
}

// Helper to split 6‑month plan into 3 bi‑monthly cycles
function buildSixMonthCycles(all: string[]): { title: string; items: string[] }[] {
  const cyclesLabels = ['Cycle 1 (Months 1‑2)', 'Cycle 2 (Months 3‑4)', 'Cycle 3 (Months 5‑6)'];
  const cycles: { title: string; items: string[] }[] = [];
  const per = Math.ceil(all.length / cyclesLabels.length);
  cyclesLabels.forEach((label, idx) => {
    const slice = all.slice(idx * per, (idx + 1) * per);
    if (slice.length) cycles.push({ title: label, items: slice });
  });
  return cycles;
}

// Progress data model
interface ProgressData {
  month: Record<string, boolean>;
  six: Record<string, boolean>;
  updated: number;
}

const emptyProgress = (monthTasks: string[], sixTasks: string[]): ProgressData => ({
  month: monthTasks.reduce((a, t) => { a[t] = false; return a; }, {} as Record<string, boolean>),
  six: sixTasks.reduce((a, t) => { a[t] = false; return a; }, {} as Record<string, boolean>),
  updated: Date.now()
});

export default function RoadmapsPage() {
  const searchParams = useSearchParams();
  const goal = searchParams.get('goal') || undefined;
  const level = searchParams.get('level') || undefined;

  // Core task arrays (before splitting)
  const monthTasks = useMemo(() => goal ? goalHints[goal] || [] : defaultMonth, [goal]);
  const sixTasks = useMemo(() => goal ? sixMonthPlan[goal] || [] : defaultSix, [goal]);

  // Derived cycles
  const monthCycles = useMemo(() => buildMonthlyCycles(monthTasks), [monthTasks]);
  const sixCycles = useMemo(() => buildSixMonthCycles(sixTasks), [sixTasks]);
  const personalized = Boolean(goal);

  const storageKey = useMemo(() => `roadmapProgress:${goal || '_default'}:${level || '_any'}`, [goal, level]);

  const [progress, setProgress] = useState<ProgressData>(() => emptyProgress(monthTasks, sixTasks));
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      if (raw) {
        const parsed: ProgressData = JSON.parse(raw);
        // Merge with current tasks (handle text changes)
        const base = emptyProgress(monthTasks, sixTasks);
        const merged: ProgressData = {
          month: { ...base.month, ...parsed.month },
          six: { ...base.six, ...parsed.six },
          updated: Date.now()
        };
        setProgress(merged);
      } else {
        setProgress(emptyProgress(monthTasks, sixTasks));
      }
    } catch {
      setProgress(emptyProgress(monthTasks, sixTasks));
    } finally {
      setLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, monthTasks.join('|'), sixTasks.join('|')]);

  // Persist
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(storageKey, JSON.stringify({ ...progress, updated: Date.now() })); } catch { /* ignore */ }
  }, [progress, loaded, storageKey]);

  const toggleTask = useCallback((scope: 'month' | 'six', task: string) => {
    setProgress(p => ({ ...p, [scope]: { ...p[scope], [task]: !p[scope][task] }, updated: Date.now() }));
  }, []);

  // Progress helpers
  const cyclePct = (items: string[], scope: 'month' | 'six') => {
    if (!items.length) return 0;
    const done = items.filter(t => progress[scope][t]).length;
    return Math.round((done / items.length) * 100);
  };

  const monthCycleDescriptions = [
    'Establish baselines & environment.',
    'Ship first artifact & feedback loop.',
    'Refine accuracy & reduce friction.',
    'Consolidate wins & prep next phase.'
  ];
  const sixCycleDescriptions = [
    'Foundation: activation habits & core automation.',
    'Expansion: integration depth & observability.',
    'Credibility: resilience, narrative, differentiation.'
  ];

  const progressBarBase = 'h-1 rounded-full bg-border overflow-hidden';
  const progressFill = 'h-full bg-gradient-to-r from-accent to-accent-alt transition-all';

  return (
    <main className="max-w-5xl mx-auto px-6 py-24 space-y-14">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Momentum Plans</h1>
        {!goal && (
          <div className="space-y-4 text-sm text-fg-muted">
            <p>Three complementary horizons to compound growth: <span className="text-accent font-medium">1‑Month</span> (activation & quick wins), <span className="text-accent font-medium">6‑Month</span> (systemization & credibility), and <span className="text-accent font-medium">12‑Month</span> (strategic differentiation).</p>
            <p>Select a goal (e.g. via Mentorship intake) to personalize— or explore the generic framework below.</p>
          </div>
        )}
        {goal && <p className="text-fg-muted text-sm md:text-base">Personalized outline for <span className="text-accent font-medium">{goal}</span>{level && <> · Level: <span className="text-accent font-medium">{level}</span></>}.</p>}
        {loaded && (
          <p className="text-[11px] text-fg-muted/60">Progress saves locally (browser). Clearing site data resets completion.</p>
        )}
      </div>

      {/* 1‑Month Plan */}
      <section className="space-y-8">
        <header className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-fg-muted">1‑Month Plan (Activation) – Cycles</h2>
          {personalized && level && <p className="text-[13px] text-fg-muted/80">Level lens: {levelAdjust[level]}</p>}
          {!personalized && <p className="text-[12px] text-fg-muted/70">Generic activation blueprint — personalize by selecting a goal.</p>}
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {monthCycles.map((c, idx) => {
            const pct = cyclePct(c.items, 'month');
            return (
              <div key={c.title} className="group relative rounded-xl border border-border/60 p-5 bg-gradient-to-br from-bg-alt/60 to-bg-alt/30 flex flex-col gap-3 hover:shadow-md hover:border-accent/50 transition">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent-rgb),0.15),transparent_70%)] transition" />
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xs font-semibold tracking-wide text-accent uppercase">{c.title}</h3>
                  <div className="relative">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-bg-alt/70 border border-border/50 text-fg-muted/80 cursor-help">Info</span>
                    <div className="absolute right-0 mt-1 z-10 w-52 origin-top-right scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition bg-bg-alt border border-border/60 rounded-lg p-3 shadow-xl backdrop-blur-sm text-[11px] leading-relaxed text-fg-muted/90">
                      {monthCycleDescriptions[idx] || 'Focused execution slice.'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-medium text-fg-muted/70">
                  <span>Progress</span><span>{pct}%</span>
                </div>
                <div className={progressBarBase}><div className={progressFill} style={{ width: pct + '%' }} /></div>
                <ul className="space-y-2 text-[13px] leading-relaxed text-fg-muted list-none pl-0 relative z-[1]">
                  {c.items.map(it => {
                    const done = progress.month[it];
                    return (
                      <li key={it} className="flex items-start gap-2 group/task">
                        <button
                          aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                          onClick={() => toggleTask('month', it)}
                          className={`mt-0.5 h-4 w-4 rounded-sm border flex items-center justify-center text-[10px] transition focus:outline-none focus:ring-2 focus:ring-accent/60 focus:ring-offset-1 focus:ring-offset-bg ${done ? 'bg-accent border-accent text-white' : 'border-border/60 hover:border-accent/60 text-transparent'}`}
                        >
                          ✓
                        </button>
                        <span className={done ? 'line-through text-fg-muted/50' : ''}>{it}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6‑Month Plan */}
      <section className="space-y-6">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-fg-muted">6‑Month Trajectory (Systemize & Credibility) – Cycles</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {sixCycles.map((c, idx) => {
            const pct = cyclePct(c.items, 'six');
            return (
              <div key={c.title} className="group relative rounded-xl border border-border/60 p-5 bg-gradient-to-br from-bg-alt/60 to-bg-alt/30 flex flex-col gap-3 hover:shadow-md hover:border-accent/50 transition">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-[radial-gradient(circle_at_70%_30%,rgba(var(--accent-alt-rgb),0.15),transparent_70%)] transition" />
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[11px] font-semibold tracking-wide text-accent uppercase">{c.title}</h3>
                  <div className="relative">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-bg-alt/70 border border-border/50 text-fg-muted/80 cursor-help">Info</span>
                    <div className="absolute right-0 mt-1 z-10 w-56 origin-top-right scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition bg-bg-alt border border-border/60 rounded-lg p-3 shadow-xl backdrop-blur-sm text-[11px] leading-relaxed text-fg-muted/90">
                      {sixCycleDescriptions[idx] || 'Bi‑monthly progression slice.'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-medium text-fg-muted/70">
                  <span>Progress</span><span>{pct}%</span>
                </div>
                <div className={progressBarBase}><div className={progressFill} style={{ width: pct + '%' }} /></div>
                <ul className="space-y-2 text-[12px] leading-relaxed text-fg-muted list-none pl-0 relative z-[1]">
                  {c.items.map(it => {
                    const done = progress.six[it];
                    return (
                      <li key={it} className="flex items-start gap-2 group/task">
                        <button
                          aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                          onClick={() => toggleTask('six', it)}
                          className={`mt-0.5 h-4 w-4 rounded-sm border flex items-center justify-center text-[10px] transition focus:outline-none focus:ring-2 focus:ring-accent/60 focus:ring-offset-1 focus:ring-offset-bg ${done ? 'bg-accent border-accent text-white' : 'border-border/60 hover:border-accent/60 text-transparent'}`}
                        >
                          ✓
                        </button>
                        <span className={done ? 'line-through text-fg-muted/50' : ''}>{it}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        {!personalized && <p className="text-[12px] text-fg-muted/70">Cycles stack: activation habits → automation & integration → credibility & narrative.</p>}
      </section>

      {/* Weekly Hours (only if personalized) */}
      {goal && level && (
        <section className="space-y-6">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-fg-muted">Weekly Learning Hours</h2>
          <p className="text-sm text-fg-muted">Recommended allocation: <span className="text-accent font-medium">{levelHours[level].range}</span></p>
          <div className="grid gap-4 md:grid-cols-2">
            {levelHours[level].distribution.map(d => (
              <div key={d.label} className="rounded-xl border border-border/60 p-4 bg-bg-alt/40 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-medium"><span>{d.label}</span><span className="text-accent">{d.pct}%</span></div>
                <p className="text-[12px] text-fg-muted leading-relaxed">{d.why}</p>
                <div className="h-1 rounded-full bg-border overflow-hidden"><div className="h-full bg-gradient-to-r from-accent to-accent-alt" style={{ width: `${d.pct}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 12‑Month Plan (unchanged logic except still server-agnostic) */}
      {goal ? (
        <section className="space-y-6">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-fg-muted">12‑Month Roadmap (Differentiation)</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {yearPlan[goal]?.map(q => (
              <div key={q.quarter} className="relative rounded-xl border border-border/60 bg-bg-alt/40 p-5 overflow-hidden group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-accent/10 to-accent-alt/10" />
                <h3 className="font-medium mb-2 text-accent">{q.quarter}</h3>
                <ul className="space-y-2 text-[13px] text-fg-muted leading-relaxed list-disc pl-5">
                  {q.focus.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-fg-muted/70">Run quarterly retros: consolidate wins, prune low‑yield activities, set next leverage bet.</p>
        </section>
      ) : (
        <section className="space-y-6">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-fg-muted">12‑Month Roadmap (Differentiation)</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {defaultYear.map(q => (
              <div key={q.quarter} className="relative rounded-xl border border-border/60 bg-bg-alt/40 p-5 overflow-hidden group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-accent/10 to-accent-alt/10" />
                <h3 className="font-medium mb-2 text-accent">{q.quarter}</h3>
                <ul className="space-y-2 text-[13px] text-fg-muted leading-relaxed list-disc pl-5">
                  {q.focus.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-fg-muted/70">Adjust each quarter: focus shifts from activation → integration → resilience → differentiation.</p>
        </section>
      )}

      {goal && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-fg-muted">Next Conversion Steps</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/contact" className="group rounded-xl border border-border/60 p-5 bg-bg-alt/40 hover:border-accent/60 transition relative overflow-hidden">
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-accent/10 to-accent-alt/10 transition" />
              <h3 className="font-medium mb-1">Mentorship Fit Call</h3>
              <p className="text-sm text-fg-muted leading-relaxed">Validate assumptions & accelerate weak domains.</p>
            </Link>
            <Link href="/docs/quick-start" className="group rounded-xl border border-border/60 p-5 bg-bg-alt/40 hover:border-accent/60 transition relative overflow-hidden">
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-accent/10 to-accent-alt/10 transition" />
              <h3 className="font-medium mb-1">Quick Start Guide</h3>
              <p className="text-sm text-fg-muted leading-relaxed">Execute the initial environment & workflow setup.</p>
            </Link>
          </div>
        </section>
      )}

      <div className="pt-6"><Link href="/" className="text-xs font-medium text-accent hover:underline">← Back to Home</Link></div>
    </main>
  );
}
