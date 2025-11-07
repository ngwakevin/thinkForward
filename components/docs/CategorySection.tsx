'use client';
import { useEffect, useState } from 'react';

interface Props {
  category: string;
  count: number;
  intro?: string;
  icon?: string; // per-category icon
  children?: React.ReactNode;
}

const CATEGORY_STYLES: Record<string, { gradient: string; accent: string }> = {
  'Getting Started': {
    gradient: 'linear-gradient(140deg, rgba(255,241,250,0.9), rgba(233,240,255,0.9))',
    accent: '#5638ff'
  },
  Concepts: {
    gradient: 'linear-gradient(140deg, rgba(233,240,255,0.9), rgba(237,233,254,0.9))',
    accent: '#ff754c'
  },
  Guides: {
    gradient: 'linear-gradient(140deg, rgba(255,244,231,0.9), rgba(255,229,241,0.9))',
    accent: '#00aa87'
  },
  Playbooks: {
    gradient: 'linear-gradient(140deg, rgba(237,252,215,0.9), rgba(221,214,254,0.92))',
    accent: '#311f49'
  },
  FAQ: {
    gradient: 'linear-gradient(140deg, rgba(229,231,235,0.9), rgba(219,234,254,0.9))',
    accent: '#5638ff'
  },
  Other: {
    gradient: 'linear-gradient(140deg, rgba(224,231,255,0.9), rgba(240,249,255,0.9))',
    accent: '#311f49'
  },
  default: {
    gradient: 'linear-gradient(140deg, rgba(255,244,255,0.9), rgba(232,248,255,0.9))',
    accent: '#311f49'
  }
};

export default function CategorySection({ category, count, intro, icon, children }: Props) {
  const storageKey = `docs:cat:collapsed:${category}`;
  const [collapsed, setCollapsed] = useState(false);
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.default;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCollapsed(raw === '1');
    } catch {}
  }, [storageKey]);

  const toggle = () => {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(storageKey, next ? '1' : '0');
      } catch {}
      return next;
    });
  };

  return (
    <section
      id={category.replace(/\s+/g, '-').toLowerCase()}
      className="doc-category-section"
      data-category={category}
    >
      <div className="relative overflow-hidden rounded-[48px] border border-white/40 bg-white/30 p-5 sm:p-8 shadow-[0_45px_120px_rgba(49,31,73,0.22)] backdrop-blur">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{ background: style.gradient }}
        />
        <div className="relative space-y-6">
          <header className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-3 rounded-full bg-white/75 px-6 py-3 text-[#271445] shadow-[0_18px_40px_rgba(49,31,73,0.2)] backdrop-blur">
                  <button
                    aria-label={collapsed ? 'Expand section' : 'Collapse section'}
                    onClick={toggle}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[14px] font-semibold text-[#271445]/75 shadow-[0_10px_24px_rgba(49,31,73,0.2)] transition hover:-translate-y-[1px] hover:text-[#271445]"
                    style={{ color: style.accent }}
                  >
                    {collapsed ? '+' : '–'}
                  </button>
                  {icon && (
                    <span className="text-lg" aria-hidden>
                      {icon}
                    </span>
                  )}
                  <h2 className="font-display text-xl font-semibold tracking-tight text-[#271445] sm:text-2xl">
                    {category}
                  </h2>
                  <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#271445]/70 shadow-[0_10px_24px_rgba(49,31,73,0.18)]">
                    {count}
                  </span>
                </div>
                {intro && (
                  <p className="max-w-xl text-[12px] leading-relaxed text-[#271445]/75 md:ml-4">
                    {intro}
                  </p>
                )}
              </div>
            </div>
          </header>

          <div className={collapsed ? 'hidden' : 'grid gap-5 md:grid-cols-2 lg:grid-cols-3'}>
            {count === 0 ? (
              <div className="relative col-span-full overflow-hidden rounded-[28px] border border-white/70 bg-white/75 p-6 text-[13px] text-[#271445]/75 shadow-[0_22px_60px_rgba(49,31,73,0.18)] backdrop-blur">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{ background: style.gradient }}
                />
                <div className="relative space-y-2">
                  <p className="font-display text-lg font-semibold text-[#261942]">Coming Soon</p>
                  <p>
                    Playbooks will provide actionable, end-to-end execution patterns (e.g. Incident
                    Response, Cost Optimization, Pipeline Hardening). Stay tuned.
                  </p>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
