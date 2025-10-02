"use client";
import React from "react";

// CapabilityRings: Concentric capability rings with gently rotating arc segments and sparkling nodes.
// Token-only colors; respects reduced-motion via global utilities.
export function CapabilityRings() {
  const cx = 300;
  const cy = 140;
  return (
    <figure aria-label="Decorative: capability rings" className="relative w-full max-w-[600px]">
      <svg viewBox="0 0 600 280" className="w-full h-auto text-fg" aria-hidden>
        <defs>
          <filter id="cr-softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" />
          </filter>
          <filter id="cr-ao" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* ground shadow */}
        <ellipse cx={cx} cy={255} rx={220} ry={22} fill="var(--color-fg)" opacity="0.06" />

        {/* base rings (subtle) */}
        <g stroke="currentColor" strokeOpacity="0.22" strokeWidth="2" fill="none">
          <circle cx={cx} cy={cy} r={40} />
          <circle cx={cx} cy={cy} r={70} />
          <circle cx={cx} cy={cy} r={100} />
          <circle cx={cx} cy={cy} r={130} />
        </g>

        {/* rotating arc segments */}
        <g className="animate-ring-rotate-slow" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <g stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6">
            <path d={`M ${cx-40} ${cy} a 40 40 0 0 1 60 0`} />
            <path d={`M ${cx-100} ${cy-20} a 100 100 0 0 1 80 -60`} />
          </g>
        </g>
        <g className="animate-ring-rotate-rev-slow" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <g stroke="var(--color-accent-alt)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6">
            <path d={`M ${cx+70} ${cy} a 70 70 0 0 1 -30 50`} />
            <path d={`M ${cx+130} ${cy} a 130 130 0 0 1 -60 90`} />
          </g>
        </g>

        {/* nodes with soft glow + sparkle */}
        <g opacity="0.25" style={{ filter: "url(#cr-softGlow)" }}>
          <circle cx={cx-100} cy={cy-20} r={18} fill="var(--color-accent-soft)" />
          <circle cx={cx+70} cy={cy} r={18} fill="var(--color-accent-soft)" />
          <circle cx={cx} cy={cy-100} r={18} fill="var(--color-accent-soft)" />
        </g>

        {/* AO under nodes */}
        <g opacity="0.08" style={{ filter: "url(#cr-ao)" }}>
          <circle cx={cx-100} cy={cy-20} r={12} fill="var(--color-fg)" />
          <circle cx={cx+70} cy={cy} r={12} fill="var(--color-fg)" />
          <circle cx={cx} cy={cy-100} r={12} fill="var(--color-fg)" />
        </g>

        {/* foreground nodes */}
        <g>
          <circle cx={cx-100} cy={cy-20} r={10} fill="var(--color-accent)" className="animate-sparkle-slow" style={{ animationDelay: "200ms" }} />
          <circle cx={cx+70} cy={cy} r={10} fill="var(--color-accent-alt)" className="animate-sparkle-slow" style={{ animationDelay: "700ms" }} />
          <circle cx={cx} cy={cy-100} r={10} fill="var(--color-accent)" className="animate-sparkle-slow" style={{ animationDelay: "1200ms" }} />
        </g>
      </svg>
    </figure>
  );
}

export default CapabilityRings;
