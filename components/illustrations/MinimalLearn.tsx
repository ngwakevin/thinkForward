"use client";
import React from "react";

// MinimalLearn: minimal modern hero visual
// Three outlined cards, a dashed progress path, and a subtle sheen overlay
export function MinimalLearn() {
  return (
    <figure aria-label="Decorative: minimal learning steps" className="relative w-full max-w-[620px]">
      <svg viewBox="0 0 600 280" className="w-full h-auto" aria-hidden>
        <defs>
          <clipPath id="ml-clip">
            <rect x="40" y="30" width="520" height="220" rx="16" />
          </clipPath>
          <pattern id="ml-grid" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke="var(--color-border)" strokeOpacity="0.15" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* subtle ground */}
        <ellipse cx={300} cy={255} rx={230} ry={20} fill="var(--color-fg)" opacity="0.04" />

        {/* background grid + soft accents (static) */}
        <g clipPath="url(#ml-clip)">
          <rect x={40} y={30} width={520} height={220} fill="url(#ml-grid)" />
          {/* soft tokens accents */}
          <circle cx={120} cy={80} r={60} fill="var(--color-accent-soft)" opacity="0.06" />
          <circle cx={520} cy={180} r={50} fill="var(--color-accent-soft)" opacity="0.05" />
        </g>

        {/* cards */}
        <g stroke="var(--color-border)" fill="var(--color-bg-alt)">
          <rect x={80} y={60} width={160} height={90} rx={12} />
          <rect x={240} y={100} width={160} height={90} rx={12} />
          <rect x={400} y={50} width={120} height={80} rx={12} />
        </g>

        {/* card labels (minimal lines) */}
        <g stroke="var(--color-border)" opacity="0.5">
          <line x1={100} y1={88} x2={220} y2={88} />
          <line x1={100} y1={108} x2={180} y2={108} />
          <line x1={260} y1={130} x2={380} y2={130} />
          <line x1={260} y1={150} x2={340} y2={150} />
          <line x1={420} y1={76} x2={500} y2={76} />
          <line x1={420} y1={96} x2={480} y2={96} />
        </g>

  {/* dashed connector path (static) */}
  <path d="M180,105 C230,105 260,115 300,145 C340,175 380,120 420,90" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="3" strokeDasharray="10 10" />

        {/* progress dots */}
        <g>
          <circle cx={180} cy={105} r={6} fill="var(--color-accent)" />
          <circle cx={300} cy={145} r={6} fill="var(--color-accent-alt)" />
          <circle cx={420} cy={90} r={6} fill="var(--color-accent)" />
        </g>

        {/* no animated sheen; minimal static decorations only */}
      </svg>
    </figure>
  );
}

export default MinimalLearn;
