import React from "react";

type Props = {
  className?: string;
  ariaLabel?: string;
};

/**
 * Decorative learning flow used inline in the Hero. Static (no animation), small arrowheads.
 * Steps: Sign up → Pick course → Learn → Achieve
 */
export default function DecorativeFlowInline({ className = "", ariaLabel = "Sign up, Pick course, Learn, Achieve" }: Props) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 900 300" role="img" aria-label={ariaLabel} className="w-full h-auto">
        <defs>
          <linearGradient id="df-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "var(--color-accent, #3ae68b)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "var(--color-accent-alt, #00c6ff)", stopOpacity: 1 }} />
          </linearGradient>
          <marker id="df-arrow" orient="auto" markerWidth="8" markerHeight="8" refX="6" refY="4">
            <path d="M0,0 L0,8 L7,4 z" fill="var(--color-accent, #3ae68b)" />
          </marker>
        </defs>

        {/* Step 1 */}
        <rect x="50" y="80" width="180" height="140" rx="20" ry="20" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
        <circle cx="140" cy="120" r="25" fill="url(#df-grad)" />
        <text x="140" y="180" textAnchor="middle" fontSize="16" fill="#fff" fontWeight={500} fontFamily="ui-sans-serif, system-ui, -apple-system">Sign up</text>

        {/* Arrow 1 */}
        <path d="M230,150 H320" stroke="var(--color-accent, #3ae68b)" strokeWidth="3" fill="none" markerEnd="url(#df-arrow)" />

        {/* Step 2 */}
        <rect x="340" y="80" width="180" height="140" rx="20" ry="20" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
        <circle cx="430" cy="120" r="25" fill="url(#df-grad)" />
        <text x="430" y="180" textAnchor="middle" fontSize="16" fill="#fff" fontWeight={500} fontFamily="ui-sans-serif, system-ui, -apple-system">Pick course</text>

        {/* Arrow 2 */}
        <path d="M520,150 H610" stroke="var(--color-accent, #3ae68b)" strokeWidth="3" fill="none" markerEnd="url(#df-arrow)" />

        {/* Step 3 */}
        <rect x="630" y="80" width="180" height="140" rx="20" ry="20" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
        <circle cx="720" cy="120" r="25" fill="url(#df-grad)" />
        <text x="720" y="180" textAnchor="middle" fontSize="16" fill="#fff" fontWeight={500} fontFamily="ui-sans-serif, system-ui, -apple-system">Learn</text>

        {/* Arrow 3 */}
        <path d="M810,150 h40 v-40" stroke="var(--color-accent, #3ae68b)" strokeWidth="3" fill="none" markerEnd="url(#df-arrow)" />

        {/* Step 4 */}
        <rect x="750" y="20" width="120" height="60" rx="16" ry="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
        <circle cx="810" cy="50" r="18" fill="url(#df-grad)" />
        <text x="810" y="80" textAnchor="middle" fontSize="16" fill="#fff" fontWeight={500} fontFamily="ui-sans-serif, system-ui, -apple-system">Achieve</text>
      </svg>
    </div>
  );
}
