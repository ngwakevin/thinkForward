'use client';
import { useState } from 'react';

interface StepState { role: string; hours: string; goal: string; }

const roles = ['Cloud Engineer','DevOps Engineer','Cloud Architect','Security','Data'];
const weeklyHours = ['<5','5-8','8-12','12+'];
const primaryGoals = ['Land first role','Promotion','Certification','Skill breadth'];

export function SolutionsWizard() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<StepState>({ role: '', hours: '', goal: '' });
  const next = () => setStep(s => Math.min(s+1, 3));
  const prev = () => setStep(s => Math.max(s-1, 0));
  const done = step === 3;

  const recommend = () => {
    const picks: string[] = [];
    if (state.role.includes('Architect')) picks.push('mentorship','roadmaps','interview-prep');
    else if (state.role.includes('DevOps')) picks.push('roadmaps','motivation','mentorship');
    else picks.push('roadmaps','mentorship','motivation');
    if (state.goal.includes('Certification')) picks.push('interview-prep');
    return Array.from(new Set(picks)).slice(0,4);
  };

  return (
    <div id="wizard" className="rounded-2xl border border-border/60 bg-bg-alt/40 p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold tracking-tight">Choose Your Path</h3>
        <div className="text-[10px] uppercase tracking-wide text-fg-muted">Step {Math.min(step+1,3)} / 3</div>
      </div>
      {!done && step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-muted">Which target role aligns best with your immediate focus?</p>
          <div className="flex flex-wrap gap-2">
            {roles.map(r => (
              <button key={r} onClick={() => { setState(s => ({ ...s, role: r })); next(); }} className={`px-3 py-2 rounded-md text-xs font-medium border transition ${state.role===r ? 'bg-accent text-white border-accent' : 'border-border/60 hover:border-accent/60 text-fg-muted'}`}>{r}</button>
            ))}
          </div>
        </div>
      )}
      {!done && step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-muted">How many focused hours per week can you consistently invest?</p>
          <div className="flex flex-wrap gap-2">
            {weeklyHours.map(h => (
              <button key={h} onClick={() => { setState(s => ({ ...s, hours: h })); next(); }} className={`px-3 py-2 rounded-md text-xs font-medium border transition ${state.hours===h ? 'bg-accent text-white border-accent' : 'border-border/60 hover:border-accent/60 text-fg-muted'}`}>{h}</button>
            ))}
          </div>
          <button onClick={prev} className="text-xs text-fg-muted hover:text-accent">Back</button>
        </div>
      )}
      {!done && step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-fg-muted">Primary outcome you care about right now?</p>
          <div className="flex flex-wrap gap-2">
            {primaryGoals.map(g => (
              <button key={g} onClick={() => { setState(s => ({ ...s, goal: g })); next(); }} className={`px-3 py-2 rounded-md text-xs font-medium border transition ${state.goal===g ? 'bg-accent text-white border-accent' : 'border-border/60 hover:border-accent/60 text-fg-muted'}`}>{g}</button>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={prev} className="text-xs text-fg-muted hover:text-accent">Back</button>
            <button onClick={next} className="text-xs text-fg-muted hover:text-accent">Skip</button>
          </div>
        </div>
      )}
      {done && (
        <div className="space-y-5">
          <p className="text-sm text-fg-muted">Recommended focus based on your inputs:</p>
          <div className="flex flex-wrap gap-2">
            {recommend().map(r => (
              <span key={r} className="rounded-md bg-bg-alt/60 border border-border/60 px-3 py-1 text-[11px] tracking-wide">{r}</span>
            ))}
          </div>
          <p className="text-xs text-fg-muted/80">Refine further as you progress. Your roadmap adapts with validated milestones.</p>
          <div className="pt-2">
            <a href="/contact" className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent-alt">Start Mentorship</a>
          </div>
        </div>
      )}
    </div>
  );
}
