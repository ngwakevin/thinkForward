"use client";
import { useState } from 'react';

interface Area { title: string; desc: string; }

const AREAS: Area[] = [
  { title: 'Architecture Reviews', desc: 'Get expert feedback on your cloud solution designs to ensure they follow best practices in scalability, security, and cost optimization.' },
  { title: 'Career Strategy', desc: 'Explore cloud career paths (architect, DevOps, data engineer, etc.), set long-term goals, and outline a step-by-step progression plan.' },
  { title: 'Skill Gap Mapping', desc: 'Assess your current cloud skills against industry benchmarks or certification paths to identify areas for growth.' },
  { title: 'Study Plan Design', desc: 'Build a structured learning roadmap with courses, labs, and resources tailored to your cloud certification or role goals.' },
  { title: 'Project Feedback', desc: 'Share your cloud projects or lab work and receive targeted feedback on design, implementation, and improvements.' },
  { title: 'Platform Roadmaps', desc: 'Stay updated on AWS, Azure, and GCP feature roadmaps to align your skills with upcoming changes in the ecosystem.' },
  { title: 'Interview Question', desc: 'Practice cloud-specific interview questions, from scenario-based architecture challenges to certification-style Q&A.' },
  { title: 'Open Conversation', desc: 'Have an open dialogue about any cloud-related topic, whether it’s career advice, new tools, or clarifying concepts.' }
];

export function FocusAreas() {
  const [open, setOpen] = useState<Area | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {AREAS.map(a => (
          <button
            key={a.title}
            type="button"
            onClick={() => setOpen(a)}
            className="rounded-full border border-border/60 bg-bg-alt/60 px-4 py-1.5 text-xs md:text-sm text-fg-muted hover:border-accent/50 hover:text-accent transition focus:outline-none focus:ring-2 focus:ring-accent/40"
            aria-haspopup="dialog"
            aria-controls="focus-area-dialog"
          >
            {a.title}
          </button>
        ))}
      </div>
      {open && (
        <div
          role="dialog"
          id="focus-area-dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(null)} aria-hidden />
          <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-bg-alt/95 p-6 shadow-xl">
            <h3 className="text-sm font-semibold tracking-tight mb-3 text-accent">{open.title}</h3>
            <p className="text-xs leading-relaxed text-fg-muted mb-6">{open.desc}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(null)}
                className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-bg-alt/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-fg-muted hover:text-accent hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                Close
              </button>
            </div>
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/40" />
          </div>
        </div>
      )}
    </div>
  );
}
