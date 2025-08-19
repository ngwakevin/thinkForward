'use client';
import { useEffect, useState } from 'react';

interface Props {
  category: string;
  count: number;
  intro?: string;
  icon?: string; // per-category icon
  children?: React.ReactNode;
}

export default function CategorySection({ category, count, intro, icon, children }: Props) {
  const storageKey = `docs:cat:collapsed:${category}`;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCollapsed(raw === '1');
    } catch {}
  }, [storageKey]);

  const toggle = () => {
    setCollapsed(c => {
      const next = !c;
      try { localStorage.setItem(storageKey, next ? '1' : '0'); } catch {}
      return next;
    });
  };

  return (
    <section id={category.replace(/\s+/g,'-').toLowerCase()} className="space-y-4 doc-category-section" data-category={category}>
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-lg md:text-xl font-semibold tracking-tight text-fg flex items-center gap-2">
            <button aria-label={collapsed ? 'Expand section' : 'Collapse section'} onClick={toggle} className="h-6 w-6 inline-flex items-center justify-center rounded-md border border-border/60 text-[11px] text-fg-muted hover:border-accent/60 hover:text-accent transition">
              {collapsed ? '+' : '–'}
            </button>
            {icon && <span className="text-base md:text-lg" aria-hidden>{icon}</span>}
            {category}
          </h2>
          <span className="text-[11px] uppercase tracking-wide text-fg-muted/70">{count}</span>
        </div>
        {intro && <p className="text-[12px] text-fg-muted/80 leading-relaxed max-w-xl">{intro}</p>}
      </header>
      <div className={collapsed ? 'hidden' : 'grid gap-5 md:grid-cols-2 lg:grid-cols-3'}>
        {count === 0 ? (
          <div className="col-span-full rounded-xl border border-border/60 bg-bg-alt/40 p-6 text-[13px] text-fg-muted">
            <p className="font-medium mb-1">Coming Soon</p>
            <p>Playbooks will provide actionable, end‑to‑end execution patterns (e.g. Incident Response, Cost Optimization, Pipeline Hardening). Stay tuned.</p>
          </div>
        ) : children}
      </div>
    </section>
  );
}
