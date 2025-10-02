"use client";
import React from "react";

export function LearningPath() {
  return (
    <figure aria-label="Decorative: learning path milestones" className="relative w-full max-w-[600px]">
      {/* background blob */}
      <div aria-hidden className="absolute -z-10 left-2 top-2 h-[260px] w-[420px] rounded-[46%] bg-accent-soft/30 animate-blob-morph-slow" />
      <svg viewBox="0 0 600 280" className="w-full h-auto text-fg" aria-hidden>
        <defs>
          {/* soft blur for glows */}
          <filter id="lp-softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          {/* gentle AO for small shadows */}
          <filter id="lp-ao" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          {/* wide ground shadow */}
          <filter id="lp-ground" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
          </filter>
          {/* subtle stroke gradient to hint depth */}
          <linearGradient id="lp-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--color-border)" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        {/* ground shadow under composition */}
        <ellipse cx="300" cy="255" rx="240" ry="28" fill="var(--color-fg)" opacity="0.06" style={{ filter: "url(#lp-ground)" }} />
        {/* dashed path */}
        <path
          d="M20,240 C120,160 180,180 240,120 C300,60 380,60 460,120 C520,165 560,160 580,140"
          fill="none"
          stroke="url(#lp-stroke)"
          strokeWidth="3"
          strokeDasharray="12 10"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-dash-slow"
          opacity="0.9"
        />

        {/* milestone glows (behind) */}
        <g opacity={0.25} style={{ filter: "url(#lp-softGlow)" }}>
          <circle cx="20" cy="240" r="18" fill="var(--color-accent-soft)" />
          <circle cx="240" cy="120" r="18" fill="var(--color-accent-soft)" />
          <circle cx="460" cy="120" r="18" fill="var(--color-accent-soft)" />
          <circle cx="580" cy="140" r="18" fill="var(--color-accent-soft)" />
        </g>

        {/* ambient occlusion under milestones (subtle) */}
        <g opacity={0.08} style={{ filter: "url(#lp-ao)" }}>
          <circle cx="20" cy="240" r="12" fill="var(--color-fg)" />
          <circle cx="240" cy="120" r="12" fill="var(--color-fg)" />
          <circle cx="460" cy="120" r="12" fill="var(--color-fg)" />
          <circle cx="580" cy="140" r="12" fill="var(--color-fg)" />
        </g>

        {/* milestones (foreground) */}
        <g>
          <circle cx="20" cy="240" r="10" fill="var(--color-accent)" className="animate-pulse-soft" />
          <circle cx="240" cy="120" r="10" fill="var(--color-accent-alt)" className="animate-pulse-soft" />
          <circle cx="460" cy="120" r="10" fill="var(--color-accent)" className="animate-pulse-soft" />
          <circle cx="580" cy="140" r="10" fill="var(--color-accent-alt)" className="animate-pulse-soft" />
        </g>

        {/* tiny badges */}
        <g>
          <rect x="95" y="155" width="24" height="12" rx="3" fill="var(--color-bg-alt)" stroke="currentColor" opacity="0.8" />
          <rect x="325" y="78" width="24" height="12" rx="3" fill="var(--color-bg-alt)" stroke="currentColor" opacity="0.8" />
          <rect x="515" y="108" width="24" height="12" rx="3" fill="var(--color-bg-alt)" stroke="currentColor" opacity="0.8" />
        </g>
      </svg>
    </figure>
  );
}

export default LearningPath;
