import React from 'react';

export interface AngledStacksProps {
  className?: string;
}

// Static, minimal, modern decoration with angled layered bands.
// Uses only site tokens via CSS variables. No animation.
const AngledStacks: React.FC<AngledStacksProps> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-bg-alt/60 ${className}`} aria-hidden>
      <svg viewBox="0 0 620 280" className="w-full h-[280px]" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="as-accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent-alt)" />
          </linearGradient>
          <linearGradient id="as-muted" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-border)" />
            <stop offset="100%" stopColor="var(--color-fg-muted)" />
          </linearGradient>
          <linearGradient id="as-bgshine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-bg-alt)" stopOpacity="0.0" />
            <stop offset="100%" stopColor="var(--color-bg-alt)" stopOpacity="0.6" />
          </linearGradient>
          <clipPath id="as-clip">
            <rect x="0" y="0" width="620" height="280" rx="16" ry="16" />
          </clipPath>
        </defs>

        {/* subtle background grid */}
        <g clipPath="url(#as-clip)" opacity="0.08">
          {Array.from({ length: 26 }).map((_, i) => (
            <line key={`g-${i}`} x1={0} x2={620} y1={i * 11} y2={i * 11} stroke="currentColor" />
          ))}
        </g>

        {/* angled bands (bottom-left to top-right) */}
        <g clipPath="url(#as-clip)">
          {/* base muted layers */}
          <polygon points="-120,260 40,280 520,-60 360,-80" fill="url(#as-muted)" opacity="0.55" />
          <polygon points="-160,220 20,240 520,-100 340,-120" fill="url(#as-muted)" opacity="0.35" />
          {/* accent layers */}
          <polygon points="-140,300 80,300 560,-40 340,-40" fill="url(#as-accent)" opacity="0.7" />
          <polygon points="-100,200 120,220 540,-60 320,-80" fill="url(#as-accent)" opacity="0.55" />
          {/* thin highlight line */}
          <polygon points="-90,238 -60,242 500,-80 470,-84" fill="var(--color-accent)" opacity="0.45" />
        </g>

        {/* top/bottom soft vignette for depth */}
        <rect x="0" y="0" width="620" height="280" fill="url(#as-bgshine)" />

        {/* minimal anchor dots */}
        <g>
          <circle cx={140} cy={200} r={2.5} fill="var(--color-accent)" />
          <circle cx={420} cy={120} r={2.5} fill="var(--color-accent-alt)" />
          <circle cx={520} cy={160} r={2} fill="var(--color-fg-muted)" />
        </g>
      </svg>
    </div>
  );
};

export default AngledStacks;
