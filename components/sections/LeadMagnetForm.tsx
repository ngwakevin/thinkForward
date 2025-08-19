"use client";
import { useState } from 'react';

export function LeadMagnetForm() {
  const [status, setStatus] = useState<'idle'|'loading'|'success'>('idle');
  const [email, setEmail] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    // Simulate async signup
    setTimeout(() => setStatus('success'), 800);
  }

  if (status === 'success') {
    return <div className="mt-4 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-3 py-3 text-sm text-emerald-300">Check your inbox for the download link.</div>;
  }

  return (
    <form className="mt-4 space-y-3" onSubmit={onSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-md border border-border/60 bg-bg-alt/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40 text-fg placeholder:text-fg-muted/60"
      />
      <button disabled={status==='loading'} className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-alt disabled:opacity-60 disabled:cursor-not-allowed">
        {status==='loading' ? 'Sending...' : 'Get the Plan'}
      </button>
      <p className="text-[10px] text-fg-muted/70">No spam. One-click unsubscribe.</p>
    </form>
  );
}
