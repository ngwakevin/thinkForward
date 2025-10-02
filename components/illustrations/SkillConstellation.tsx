"use client";
import React from "react";

// A fresh, token-only animation concept: a constellation of skill nodes connected by soft lines.
// Subtle twinkles and a slow orbiting marker add life while respecting reduced motion.
export function SkillConstellation() {
  return (
    <figure aria-label="Decorative: constellation of skills" className="relative w-full max-w-[600px]">
      {/* ground shadow to seat the graphic */}
      <svg viewBox="0 0 600 280" className="w-full h-auto text-fg" aria-hidden>
        <defs>
          <filter id="sc-softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
          <filter id="sc-ao" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* ground shadow */}
        <ellipse cx="300" cy="255" rx="220" ry="24" fill="var(--color-fg)" opacity="0.06" />

        {/* links between nodes (soft lines) */}
        <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" fill="none">
          <path d="M90,200 L200,170 L310,140 L420,160 L520,120" />
          <path d="M150,90 L200,170 L260,70 L420,160" />
          <path d="M90,200 L150,90 L520,120" />
        </g>

        {/* ambient occlusion under nodes */}
        <g opacity="0.08" style={{ filter: "url(#sc-ao)" }}>
          <circle cx="90" cy="200" r="12" fill="var(--color-fg)" />
          <circle cx="150" cy="90" r="12" fill="var(--color-fg)" />
          <circle cx="200" cy="170" r="12" fill="var(--color-fg)" />
          <circle cx="260" cy="70" r="12" fill="var(--color-fg)" />
          <circle cx="310" cy="140" r="12" fill="var(--color-fg)" />
          <circle cx="420" cy="160" r="12" fill="var(--color-fg)" />
          <circle cx="520" cy="120" r="12" fill="var(--color-fg)" />
        </g>

        {/* glow halos behind select nodes */}
        <g opacity="0.25" style={{ filter: "url(#sc-softGlow)" }}>
          <circle cx="150" cy="90" r="18" fill="var(--color-accent-soft)" />
          <circle cx="310" cy="140" r="18" fill="var(--color-accent-soft)" />
          <circle cx="520" cy="120" r="18" fill="var(--color-accent-soft)" />
        </g>

        {/* nodes */}
        <g>
          <circle cx="90" cy="200" r="9" fill="var(--color-accent)" className="animate-twinkle-slow" style={{ animationDelay: "0ms" }} />
          <circle cx="150" cy="90" r="10" fill="var(--color-accent-alt)" className="animate-twinkle-slow" style={{ animationDelay: "400ms" }} />
          <circle cx="200" cy="170" r="8" fill="var(--color-accent)" className="animate-twinkle-slow" style={{ animationDelay: "800ms" }} />
          <circle cx="260" cy="70" r="9" fill="var(--color-accent)" className="animate-twinkle-slow" style={{ animationDelay: "1200ms" }} />
          <circle cx="310" cy="140" r="10" fill="var(--color-accent-alt)" className="animate-twinkle-slow" style={{ animationDelay: "1600ms" }} />
          <circle cx="420" cy="160" r="9" fill="var(--color-accent)" className="animate-twinkle-slow" style={{ animationDelay: "2000ms" }} />
          <circle cx="520" cy="120" r="10" fill="var(--color-accent-alt)" className="animate-twinkle-slow" style={{ animationDelay: "2400ms" }} />
        </g>

        {/* slow orbit marker around center cluster */}
        <g className="animate-orbit-slow" style={{ transformOrigin: "310px 140px" }}>
          <circle cx="360" cy="140" r="3" fill="var(--color-warning)" />
        </g>
      </svg>
    </figure>
  );
}

export default SkillConstellation;
