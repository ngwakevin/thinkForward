import React from 'react';

export interface ProfessionalDecoProps {
  className?: string;
  variant?: 'subtle' | 'distinct';
  animate?: boolean; // if false, no floating animation
}

const ProfessionalDeco: React.FC<ProfessionalDecoProps> = ({ className = '', variant = 'subtle', animate = true }) => {
  const isSubtle = variant === 'subtle';

  return (
    <div className={`${className} relative overflow-hidden`} aria-hidden>
      <svg viewBox="0 0 160 96" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="pd-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent-alt)" />
          </linearGradient>
          <filter id="pd-s" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* subtle geometric background grid */}
        <g opacity={isSubtle ? 0.18 : 0.28}>
          <rect x="0" y="0" width="160" height="96" fill="none" />
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              x2={160}
              y1={8 + i * 14}
              y2={8 + i * 14}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`v-${i}`}
              y1={0}
              y2={96}
              x1={8 + i * 18}
              x2={8 + i * 18}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* primary refined mark: a rounded 'G' inspired form built from a ring + notch */}
        <g transform="translate(44,18)">
          <circle cx="28" cy="22" r="20" fill="url(#pd-g)" filter="url(#pd-s)" />
          <path
            d="M34 22 a8 8 0 0 0 -8 -8"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity={isSubtle ? 0.95 : 1}
          />
          {/* accent dot / aperture */}
          <circle cx="44" cy="10" r={isSubtle ? 2.2 : 3.5} fill="rgba(255,255,255,0.95)" />
        </g>

        {/* optional stronger framing ring for distinct variant */}
        {!isSubtle && (
          <g>
            <circle cx="80" cy="48" r="46" stroke="rgba(255,255,255,0.06)" strokeWidth="2" fill="none" />
          </g>
        )}

        {/* gentle floating animation for the accent dot when reduced motion is not preferred */}
        {animate && (
          <style>{`@media (prefers-reduced-motion: no-preference) { svg g circle:nth-of-type(3) { animation: pd-float 3s ease-in-out infinite; } @keyframes pd-float { 0% { transform: translateY(0); } 50% { transform: translateY(-3px); } 100% { transform: translateY(0); } } }`}</style>
        )}
      </svg>
    </div>
  );
};

export default ProfessionalDeco;
