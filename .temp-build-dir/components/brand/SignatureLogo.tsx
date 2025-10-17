import React, { useId } from 'react';

interface SignatureLogoProps {
  className?: string; // controls text size (e.g., 'text-3xl')
  showUnderline?: boolean;
  // Positions: 'aboveC' places cloud above the start of "Cloud"; 'integratedC' would place cloud overlapping the C
  cloudPosition?: 'aboveC' | 'integratedC' | 'none';
  showBracket?: boolean; // show amber angle bracket after Acers
  bracketChar?: '>' | '›' | '»';
  // New: place a dot inside the "C" of Cloud
  showDotInC?: boolean;
  dotColorClass?: string; // e.g., 'bg-accent', 'bg-accent-alt'
  // New: place a dot above the "C" of Cloud (matches attachment)
  showDotAboveC?: boolean;
}

/**
 * SignatureLogo: Unified "CloudAcers" wordmark with:
 * - Cloud glyph above/integrated with the "C" (default: above)
 * - Growth arrow at the apex of the "A" in Acers
 * - Thin underline under "Acers" for stability
 *
 * Use Tailwind gradient tokens (from-accent, to-accent-alt) for text and strokes.
 */
export function SignatureLogo({
  className = 'text-3xl',
  showUnderline = true,
  cloudPosition = 'aboveC',
  showBracket = true,
  bracketChar = '>',
  showDotInC = false,
  dotColorClass = 'bg-accent',
  showDotAboveC = false,
}: SignatureLogoProps) {
  const gradId = useId();
  return (
    <span className={`relative inline-flex items-baseline font-display font-semibold tracking-tight ${className}`} aria-label="CloudAcers">
      {/* Cloud + Cloud text */}
      <span className="relative inline-block pr-0.5 align-baseline">
        <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent select-none">Cloud</span>
        {/* Optional dot above the "C" */}
        {showDotAboveC && (
          <span
            className={`absolute -top-[0.6em] left-[0.02em] h-[0.38em] w-[0.38em] rounded-full ${dotColorClass}`}
            aria-hidden
          />
        )}
        {/* Optional dot inside the "C" */}
        {showDotInC && (
          <span
            className={`absolute ${/* fine-tuned position for inside the C */''} top-[0.05em] left-[0.08em] h-[0.35em] w-[0.35em] rounded-full ${dotColorClass}`}
            aria-hidden
          />
        )}
        {/* Cloud glyph above/integrated near the C (hidden if cloudPosition === 'none') */}
        {cloudPosition !== 'none' && (
          <svg
            className={`absolute ${cloudPosition === 'aboveC' ? '-top-4 -left-1' : '-top-1 -left-1'} h-5 w-8`}
            viewBox="0 0 64 32"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-accent)" />
                <stop offset="100%" stopColor="var(--color-accent-alt)" />
              </linearGradient>
            </defs>
            <path
              d="M44 14c-.6-4.1-4.2-7.2-8.5-7.2-3.2 0-6 1.7-7.5 4.3-3.6.3-6.5 3.2-6.5 6.9 0 3.8 3.1 6.9 6.9 6.9H45c3.4 0 6.1-2.7 6.1-6.1 0-3.2-2.4-5.8-5.5-6.1Z"
              fill={`url(#${gradId})`}
              opacity={cloudPosition === 'integratedC' ? 0.25 : 1}
            />
          </svg>
        )}
      </span>

  {/* Acers with growth arrow and underline */}
      <span className="relative inline-block align-baseline">
        <span className="bg-gradient-to-r from-accent-alt via-accent to-accent-alt bg-clip-text text-transparent select-none">Acers</span>
        {/* Growth arrow over the A */}
        <svg
          className="pointer-events-none absolute -top-4 right-0 h-4 w-10 text-warning transform -translate-x-1"
          viewBox="0 0 64 32"
          aria-hidden="true"
        >
          {/* Upward chevron/curve implying growth above first letter position */}
          <path d="M22 24 L34 8 L46 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {showUnderline && (
          <span className="pointer-events-none absolute left-0 right-0 translate-y-[0.35em]">
            <span className="block h-px rounded-full bg-border/70" />
          </span>
        )}
      </span>
      {showBracket && (
        <span aria-hidden className="ml-1 text-warning translate-y-[-1px]">{bracketChar}</span>
      )}
    </span>
  );
}

export default SignatureLogo;
