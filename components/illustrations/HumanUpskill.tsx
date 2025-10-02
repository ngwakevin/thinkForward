"use client";
import React from "react";

// HumanUpskill: human-centric learning/upskilling concept
// Center human silhouette, orbiting skill badges, and sequential progress arcs
export function HumanUpskill() {
  const cx = 300;
  const cy = 140;
  return (
    <figure aria-label="Decorative: human learning and upskilling" className="relative w-full max-w-[600px]">
      <svg viewBox="0 0 600 280" className="w-full h-auto text-fg" aria-hidden>
        <defs>
          <filter id="hu-softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          <filter id="hu-ao" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* ground shadow */}
        <ellipse cx={cx} cy={255} rx={220} ry={22} fill="var(--color-fg)" opacity="0.06" />

        {/* progress arcs (sequential glow) */}
        <g fill="none" strokeLinecap="round" strokeWidth="4">
          {/* inner ring segment */}
          <path d={`M ${cx-55} ${cy} a 55 55 0 0 1 110 0`} stroke="var(--color-accent)" className="animate-seg-1" opacity={0.5} />
          {/* mid ring segment */}
          <path d={`M ${cx-90} ${cy-10} a 90 90 0 0 1 160 -60`} stroke="var(--color-accent-alt)" className="animate-seg-2" opacity={0.45} />
          {/* outer ring segment */}
          <path d={`M ${cx+120} ${cy+10} a 120 120 0 0 1 -80 90`} stroke="var(--color-accent)" className="animate-seg-3" opacity={0.4} />
        </g>

        {/* human silhouette (abstract) */}
        <g>
          {/* halo glow behind head */}
          <g opacity="0.25" style={{ filter: "url(#hu-softGlow)" }}>
            <circle cx={cx} cy={cy-28} r={20} fill="var(--color-accent-soft)" />
          </g>
          {/* head */}
          <circle cx={cx} cy={cy-28} r={14} fill="var(--color-fg)" />
          {/* AO under torso */}
          <g opacity="0.08" style={{ filter: "url(#hu-ao)" }}>
            <rect x={cx-12} y={cy-8} width={24} height={46} rx={10} fill="var(--color-fg)" />
          </g>
          {/* torso */}
          <rect x={cx-12} y={cy-8} width={24} height={46} rx={10} fill="var(--color-accent)" />
          {/* arms (subtle) */}
          <path d={`M ${cx-12} ${cy+4} q -18 10 -28 0`} stroke="currentColor" strokeOpacity="0.35" strokeWidth="3" fill="none" />
          <path d={`M ${cx+12} ${cy+4} q 18 10 28 0`} stroke="currentColor" strokeOpacity="0.35" strokeWidth="3" fill="none" />
        </g>

        {/* orbiting skill badges */}
        <g className="animate-orbit-slow" style={{ transformOrigin: `${cx}px ${cy-10}px` }}>
          <circle cx={cx} cy={cy-10} r={70} fill="none" />
          <circle cx={cx+70} cy={cy-10} r={9} fill="var(--color-accent)" className="animate-twinkle-slow" style={{ animationDelay: "200ms" }} />
          <circle cx={cx} cy={cy-80} r={10} fill="var(--color-accent-alt)" className="animate-twinkle-slow" style={{ animationDelay: "800ms" }} />
          <circle cx={cx-70} cy={cy-10} r={9} fill="var(--color-accent)" className="animate-twinkle-slow" style={{ animationDelay: "1400ms" }} />
        </g>

        {/* static badges (completed skills) with glow */}
        <g opacity="0.25" style={{ filter: "url(#hu-softGlow)" }}>
          <circle cx={cx-120} cy={cy+10} r={18} fill="var(--color-accent-soft)" />
          <circle cx={cx+120} cy={cy+10} r={18} fill="var(--color-accent-soft)" />
        </g>
        <g>
          <circle cx={cx-120} cy={cy+10} r={10} fill="var(--color-accent-alt)" className="animate-sparkle-slow" style={{ animationDelay: "500ms" }} />
          <circle cx={cx+120} cy={cy+10} r={10} fill="var(--color-accent)" className="animate-sparkle-slow" style={{ animationDelay: "1100ms" }} />
        </g>
      </svg>
    </figure>
  );
}

export default HumanUpskill;
