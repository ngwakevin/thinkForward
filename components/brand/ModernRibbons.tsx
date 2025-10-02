import React from 'react';

export interface ModernRibbonsProps {
  className?: string;
}

export const ModernRibbons: React.FC<ModernRibbonsProps> = ({ className = '' }) => {
  return (
    <div className={`${className} relative overflow-hidden rounded-2xl border border-border bg-bg-alt/60`} aria-hidden>
      <svg viewBox="0 0 620 280" className="w-full h-[280px]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="mr-a" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent-alt)" />
          </linearGradient>
          <linearGradient id="mr-b" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-border)" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* subtle background grid */}
        <g opacity="0.1">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`h-${i}`} x1={0} x2={620} y1={10 + i * 12} y2={10 + i * 12} stroke="currentColor" />
          ))}
        </g>

        {/* layered ribbons */}
        <path d="M -20 220 C 120 160, 220 260, 360 200 C 480 150, 560 260, 660 210" fill="none" stroke="url(#mr-b)" strokeWidth={28} strokeLinecap="round" />
        <path d="M -40 180 C 80 140, 220 180, 320 150 C 460 110, 540 180, 720 150" fill="none" stroke="url(#mr-a)" strokeWidth={18} strokeLinecap="round" />
        <path d="M -60 130 C 40 120, 160 140, 280 120 C 420 100, 500 120, 700 100" fill="none" stroke="url(#mr-b)" strokeWidth={10} strokeLinecap="round" opacity="0.7" />

        {/* anchor dots */}
        <g>
          <circle cx={140} cy={170} r={3} fill="var(--color-accent)" />
          <circle cx={360} cy={150} r={3} fill="var(--color-accent-alt)" />
          <circle cx={520} cy={170} r={3} fill="var(--color-accent)" />
        </g>
      </svg>
    </div>
  );
};

export default ModernRibbons;
