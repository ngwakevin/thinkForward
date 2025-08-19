'use client';
import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface FormState { goal?: string; level?: string; email?: string; }
const goals = ['Land First Cloud Role','Transition to DevOps','Advance Toward Architect','Certification Readiness'];
const levels = ['Foundation','Intermediate','Advanced'];

export function GetStarted() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    try { const raw = localStorage.getItem('tfOnboarding'); if (raw) setForm(JSON.parse(raw)); } catch {}
  }, []);

  const canNext = step === 1 ? !!form.goal : step === 2 ? !!form.level : /.+@.+\..+/.test(form.email || '');
  const update = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canNext) return;
    try { localStorage.setItem('tfOnboarding', JSON.stringify(form)); } catch {}
    setSubmitted(true);
    const q = new URLSearchParams();
    if (form.goal) q.set('goal', form.goal);
    if (form.level) q.set('level', form.level);
    // Defer navigation to avoid any synchronous render edge
    startTransition(() => {
      setTimeout(() => router.push(`/roadmaps?${q.toString()}` as any), 0);
    });
  }

  return (
    <section id="get-started" className="relative py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text mb-4">Get Your 30‑Day Momentum Plan</h2>
        <p className="text-fg-muted text-sm md:text-base mb-10 max-w-prose">Answer three quick prompts. We tailor an initial focus plan you can iterate.</p>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-bg-alt/40 p-6 md:p-8 space-y-8">
          <div className="flex gap-2" aria-label="Progress">
            {[1,2,3].map(n => <div key={n} className={`h-1 flex-1 rounded-full ${step >= n ? 'bg-gradient-to-r from-accent to-accent-alt' : 'bg-border'}`} />)}
          </div>
          {step === 1 && (
            <div>
              <p className="text-sm font-semibold mb-4">1. Your Primary Goal</p>
              <div className="grid gap-3 md:grid-cols-2">
                {goals.map(g => (
                  <button key={g} type="button" onClick={() => update('goal', g)} className={`text-left rounded-xl border p-4 text-sm font-medium transition ${form.goal === g ? 'border-accent/70 bg-accent/10 text-accent' : 'border-border/60 hover:border-accent/50'}`}>{g}</button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <p className="text-sm font-semibold mb-4">2. Current Level</p>
              <div className="flex flex-wrap gap-3">
                {levels.map(l => (
                  <button key={l} type="button" onClick={() => update('level', l)} className={`rounded-full px-5 py-2 text-sm font-medium border transition ${form.level === l ? 'border-accent/70 text-accent bg-accent/10' : 'border-border/60 hover:border-accent/50 text-fg-muted'}`}>{l}</button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <p className="text-sm font-semibold mb-4">3. Email for Delivery</p>
              <input type="email" required placeholder="you@domain.com" value={form.email || ''} onChange={e => update('email', e.target.value)} className="w-full rounded-md border border-border/60 px-4 py-3 text-sm bg-bg-alt focus:outline-none focus:border-accent/70 focus:ring-1 focus:ring-accent/50" />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {step > 1 && !submitted && <button type="button" onClick={() => setStep(s => s - 1)} className="px-5 py-2 rounded-md text-sm font-medium border border-border/60 hover:border-accent/50 text-fg-muted hover:text-accent transition">Back</button>}
            {step < 3 && !submitted && <button type="button" disabled={!canNext} onClick={() => setStep(s => s + 1)} className="px-6 py-2 rounded-md text-sm font-semibold bg-accent text-white hover:bg-accent-alt disabled:opacity-40 transition">Continue</button>}
            {step === 3 && !submitted && <button type="submit" disabled={!canNext || isPending} className="px-6 py-2 rounded-md text-sm font-semibold bg-gradient-to-r from-accent to-accent-alt text-white hover:brightness-110 disabled:opacity-40 transition">Generate Plan</button>}
            {submitted && <span className="text-sm font-medium text-accent">Redirecting...</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
