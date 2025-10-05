import React from 'react';

interface AttachedLogoProps {
  className?: string; // control font size, e.g. 'text-4xl'
  text?: string; // default to 'thinkForward' per attachment
  showDot?: boolean;
  bracketChar?: '>' | '›' | '»';
}

// AttachedLogo: matches the provided reference
// - Gradient wordmark (site greens)
// - Small green dot above the left
// - Amber angle bracket at the end
export function AttachedLogo({
  className = 'text-4xl',
  text = 'thinkForward',
  showDot = true,
  bracketChar = '›',
}: AttachedLogoProps) {
  return (
    <span className={`relative inline-flex items-baseline font-display font-semibold tracking-tight ${className}`}>
      {/* Floating dot near the start */}
      {showDot && (
        <span className="absolute -top-3 -left-2 inline-flex h-3 w-3">
          <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
        </span>
      )}
      {/* Word */}
      <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent select-none">
        {text}
      </span>
      {/* Amber bracket */}
      <span aria-hidden className="ml-1 text-warning translate-y-[-1px]">
        {bracketChar}
      </span>
    </span>
  );
}

export default AttachedLogo;
