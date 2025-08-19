import React from 'react';

// Simple wordmark: thinkForward› with gradient + optional pulse dot over the first i
// Usage: <Wordmark /> in Header (replace text brand) or larger hero.
// Props allow toggling pulse, compact mode, and size.

interface WordmarkProps {
  className?: string;
  pulseDot?: boolean;
  compact?: boolean; // if true, hides the trailing arrow for very tight spaces
  as?: keyof JSX.IntrinsicElements;
}

export function Wordmark({ className = '', pulseDot = true, compact = false, as: Tag = 'span' }: WordmarkProps) {
  return (
    <Tag className={`inline-flex items-baseline font-display font-semibold tracking-tight ${className}`}>      
      <span className="relative pr-0.5">
        <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">think</span>
        {pulseDot && (
          <span className="absolute -top-2 left-2 inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
        )}
      </span>
      <span className="bg-gradient-to-r from-accent-alt via-accent to-accent-alt bg-clip-text text-transparent">Forward</span>
      {!compact && <span className="ml-0.5 text-warning translate-y-[-1px]">›</span>}
    </Tag>
  );
}

export default Wordmark;
