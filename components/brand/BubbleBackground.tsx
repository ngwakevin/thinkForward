import React from 'react';

export interface BubbleBackgroundProps {
  className?: string;
  accentCount?: number; // number of small accent rings to draw
}

export const BubbleBackground: React.FC<BubbleBackgroundProps> = ({ className = '', accentCount = 5 }) => {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Predefined candidate positions for accent rings — we will slice this array to the requested count
  const positions: Array<{ x: number; y: number; r?: number }> = [
    { x: 30, y: 110 },
    { x: 62, y: 110 },
    { x: 94, y: 110 },
    { x: 46, y: 138 },
    { x: 78, y: 138 },
    { x: 16, y: 92 },
    { x: 110, y: 118 },
    { x: 26, y: 140 },
    { x: 88, y: 92 },
  ];

  const chosen = positions.slice(0, Math.max(0, Math.min(accentCount, positions.length)));

  return (
    <div className={`${className} relative overflow-hidden`} aria-hidden>
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="bb-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent-alt)" />
          </linearGradient>
          <filter id="bb-s" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Large filled bubbles */}
        <circle cx="220" cy="40" r="40" fill="url(#bb-g)" filter="url(#bb-s)" />
        <circle cx="80" cy="40" r="36" fill="url(#bb-g)" filter="url(#bb-s)" />
        <circle cx="120" cy="140" r="60" fill="url(#bb-g)" filter="url(#bb-s)" />

        {/* Small outlined accents (configurable count) */}
        <g stroke="rgba(255,255,255,0.85)" strokeWidth="2" fill="none">
          {chosen.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r ?? 12} />
          ))}
        </g>

        {/* Optional gentle float animation */}
        {!prefersReduced && (
          <g>
            <animateTransform xlinkHref="#" attributeName="transform" type="translate" dur="8s" values="0 0;0 6;0 0" repeatCount="indefinite" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default BubbleBackground;
