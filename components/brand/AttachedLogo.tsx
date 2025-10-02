import React from 'react';
import { LogoLockup } from './Logo';

interface AttachedLogoProps {
  className?: string; // control size, e.g. 'text-4xl'
  text?: string; // brand text
  compact?: boolean;
}

// AttachedLogo: compact lockup (icon + wordmark) used in header/footer
export function AttachedLogo({ className = 'text-4xl', text = 'Cloudegree', compact = false }: AttachedLogoProps) {
  return (
    <span className={className}>
      <LogoLockup className="inline-flex items-center gap-3" iconClassName="h-7 w-7" wordmarkClassName={className} compact={compact} />
    </span>
  );
}

export default AttachedLogo;
