import React from 'react';

// Simple wordmark: Cloudegree› with gradient + optional pulse dot over the first letter
// Usage: <Wordmark /> in Header (replace text brand) or larger hero.
// Props allow toggling pulse, compact mode, and size.

interface WordmarkProps {
  className?: string;
  pulseDot?: boolean;
  compact?: boolean; // if true, hides the trailing arrow for very tight spaces
  as?: keyof JSX.IntrinsicElements;
  arrow?: 'angle' | 'chevron' | 'caret' | 'none';
  arrowColorClass?: string; // e.g., 'text-warning' or custom
  // dotMode controls where/how the decorative dot appears
  // - 'default': above the Cloud segment (current style)
  // - 'aboveA': above the first letter A in Acers (as a stand-in for an "i" placement)
  // - 'hoverBracket': hidden by default; pulses near the bracket on hover
  // - 'none': no dot
  dotMode?: 'default' | 'aboveA' | 'hoverBracket' | 'none';
  // unified renders Cloudegree as a single continuous word without segment split
  unified?: boolean;
}

export function Wordmark({
  className = '',
  pulseDot = true,
  compact = false,
  as: Tag = 'span',
  arrow = 'angle',
  arrowColorClass = 'text-warning',
  dotMode = 'default',
  unified = false,
}: WordmarkProps) {
  const showDot = dotMode !== 'none' && pulseDot;
  if (unified) {
    // Single uninterrupted word with gradient, no arrow/dots by default
    return (
      <Tag className={`inline-flex items-baseline font-display font-semibold tracking-tight ${className}`}>
  <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">Cloudegree</span>
      </Tag>
    );
  }
  return (
    <Tag className={`inline-flex items-baseline font-display font-semibold tracking-tight ${dotMode === 'hoverBracket' ? 'group' : ''} ${className}`}>
      {/* Unified Cloudegree wordmark (keeps decorative dot behavior) */}
      <span className="relative pr-0.5">
        <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">Cloudegree</span>
        {showDot && dotMode === 'default' && (
          <span className="absolute -top-[6px] left-[6px] inline-flex h-[6px] w-[6px]">
            <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-accent/40" />
            <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-accent" />
          </span>
        )}
      </span>
      {/* Trailing arrow and optional hover-pulse dot near it */}
      {!compact && arrow !== 'none' && (
        <span className={`relative ml-0.5 ${arrowColorClass} translate-y-[-1px]`}>
          {arrow === 'angle' ? '›' : arrow === 'chevron' ? '»' : arrow === 'caret' ? '>' : ''}
          {dotMode === 'hoverBracket' && (
            <span className="absolute -top-2 -right-2 inline-flex h-2 w-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-accent/40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
          )}
        </span>
      )}
    </Tag>
  );
}

export default Wordmark;
