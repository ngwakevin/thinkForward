import React, { useId } from 'react';
import { Wordmark } from './Wordmark';

/**
 * Cloudegree Logo (renamed from CloudAcers)
 * - LogoIcon: icon-only scalable SVG mark
 * - LogoLockup: icon + wordmark horizontal lockup
 *
 * Design: A stylized cloud shape with an upward "A" chevron in negative space,
 * using the brand gradient (from-accent to-accent-alt). Works on dark/light.
 */

type Variant = 'gradient' | 'mono' | 'outline';

export interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  variant?: Variant;
  title?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({
  variant = 'gradient',
  title = 'Cloudegree',
  className = 'h-7 w-7',
  ...props
}) => {
  const gradId = useId();
  const titleId = useId();

  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-labelledby={titleId}
      className={className}
      {...props}
    >
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-alt)" />
        </linearGradient>
      </defs>

  {/* cloud removed (per design) */}

  {/* Upward "A" chevron removed per user request */}
    </svg>
  );
};

export interface LogoLockupProps {
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
  variant?: Variant;
  compact?: boolean; // pass to Wordmark to hide arrow on tight spaces
}

export const LogoLockup: React.FC<LogoLockupProps> = ({
  className = 'inline-flex items-center gap-2',
  iconClassName = 'h-7 w-7',
  wordmarkClassName = 'text-xl',
  variant = 'gradient',
  compact = false,
}) => {
  return (
  <span className={className} aria-label="Cloudegree logo">
      <LogoIcon className={iconClassName} variant={variant} />
      <Wordmark className={wordmarkClassName} pulseDot={!compact} compact={compact} arrow="angle" />
    </span>
  );
};

export default LogoIcon;

/**
 * AltLogoIcon: An alternate mark inspired by the user's attachment
 * - Small cloud glyph + floating dot + angled bracket accent
 */
export const AltLogoIcon: React.FC<LogoIconProps> = ({
  variant = 'gradient',
  title = 'Cloudegree',
  className = 'h-8 w-8',
  ...props
}) => {
  const gradId = useId();
  const titleId = useId();
  return (
    <svg viewBox="0 0 120 40" role="img" aria-labelledby={titleId} className={className} {...props}>
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-alt)" />
        </linearGradient>
      </defs>
  {/* alt cloud removed per design */}
    </svg>
  );
};

/**
 * AltLogoLockup: Alternate lockup combining AltLogoIcon + Wordmark
 */
export const AltLogoLockup: React.FC<LogoLockupProps> = ({
  className = 'inline-flex items-center gap-2',
  iconClassName = 'h-8 w-[120px]',
  wordmarkClassName = 'text-2xl',
  variant = 'gradient',
  compact = false,
}) => {
  return (
  <span className={className} aria-label="Cloudegree logo alt">
      <AltLogoIcon className={iconClassName} variant={variant} />
      <Wordmark className={wordmarkClassName} pulseDot={!compact} compact={compact} arrow="angle" />
    </span>
  );
};

/**
 * CALigatureIcon: Bold uppercase "C A" monogram, geometric and scalable.
 */
export const CALigatureIcon: React.FC<LogoIconProps> = ({
  variant = 'gradient',
  title = 'Cloudegree CA',
  className = 'h-10 w-10',
  ...props
}) => {
  const gradId = useId();
  const titleId = useId();
  const stroke = variant === 'mono' ? 'currentColor' : `url(#${gradId})`;
  return (
    <svg viewBox="0 0 64 64" role="img" aria-labelledby={titleId} className={className} {...props}>
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-alt)" />
        </linearGradient>
      </defs>
      {/* Bold C (arc) */}
      <path
        d="M46 18a14 14 0 1 0 0 28"
        fill="none"
        stroke={stroke}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bold A (chevron + crossbar) */}
      <path
        d="M24 48 L32 28 L40 48 M28 40 L36 40"
        fill="none"
        stroke={stroke}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {variant === 'gradient' ? null : variant === 'outline' ? (
        <></>
      ) : (
        <></>
      )}
    </svg>
  );
};

export const CALigatureLockup: React.FC<LogoLockupProps> = ({
  className = 'inline-flex items-center gap-3',
  iconClassName = 'h-10 w-10',
  wordmarkClassName = 'text-2xl',
  variant = 'gradient',
  compact = false,
}) => {
  return (
  <span className={className} aria-label="Cloudegree CA ligature">
      <CALigatureIcon className={iconClassName} variant={variant} />
      <Wordmark className={wordmarkClassName} pulseDot={!compact} compact={compact} arrow="angle" />
    </span>
  );
};

/**
 * ApexLogoIcon: Mountain "A" apex emerging from a soft cloud base.
 */
export const ApexLogoIcon: React.FC<LogoIconProps> = ({
  variant = 'gradient',
  title = 'Cloudegree Apex',
  className = 'h-10 w-10',
  ...props
}) => {
  const gradId = useId();
  const titleId = useId();
  const stroke = variant === 'mono' ? 'currentColor' : `url(#${gradId})`;
  const fill = variant === 'mono' ? 'currentColor' : `url(#${gradId})`;
  return (
    <svg viewBox="0 0 64 64" role="img" aria-labelledby={titleId} className={className} {...props}>
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-alt)" />
        </linearGradient>
      </defs>
      {/* Cloud base */}
      <path
        d="M44 28c-.9-6-6.4-10.6-12.7-10.6-4.6 0-8.8 2.5-11 6.4-5.4.4-9.6 4.9-9.6 10.4 0 5.8 4.7 10.5 10.6 10.5h27.8c5.2 0 9.4-4.2 9.4-9.4 0-4.9-3.8-8.8-8.5-9.3Z"
        fill={variant === 'outline' ? 'none' : fill}
        opacity={variant === 'mono' ? 0.16 : 1}
        stroke={variant === 'outline' ? stroke : 'none'}
        strokeWidth={3}
      />
      {/* Mountain A apex */}
      <path d="M20 46 L32 24 L44 46 M26.5 39 h11" fill="none" stroke={stroke} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {/* Achievement star near apex */}
      <circle cx="34" cy="21" r="2.2" fill="hsl(38, 90%, 60%)" />
    </svg>
  );
};

export const ApexLogoLockup: React.FC<LogoLockupProps> = ({
  className = 'inline-flex items-center gap-3',
  iconClassName = 'h-10 w-10',
  wordmarkClassName = 'text-2xl',
  variant = 'gradient',
  compact = false,
}) => {
  return (
  <span className={className} aria-label="Cloudegree Apex lockup">
      <ApexLogoIcon className={iconClassName} variant={variant} />
      <Wordmark className={wordmarkClassName} pulseDot={!compact} compact={compact} arrow="angle" />
    </span>
  );
};

/**
 * MomentumLogoIcon: Three forward chevrons for momentum + a subtle cloud horizon.
 */
export const MomentumLogoIcon: React.FC<LogoIconProps> = ({
  variant = 'gradient',
  title = 'Cloudegree Momentum',
  className = 'h-10 w-12',
  ...props
}) => {
  const gradId = useId();
  const titleId = useId();
  const stroke = variant === 'mono' ? 'currentColor' : `url(#${gradId})`;
  return (
    <svg viewBox="0 0 72 64" role="img" aria-labelledby={titleId} className={className} {...props}>
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-alt)" />
        </linearGradient>
      </defs>
      {/* Chevrons */}
      <polyline points="12,22 26,32 12,42" fill="none" stroke={stroke} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22,18 36,28 22,38" fill="none" stroke={stroke} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="32,14 46,24 32,34" fill="none" stroke={stroke} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Cloud horizon */}
      <path d="M10 50 C 26 46, 46 54, 62 50" fill="none" stroke={stroke} strokeOpacity="0.35" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
};

export const MomentumLogoLockup: React.FC<LogoLockupProps> = ({
  className = 'inline-flex items-center gap-3',
  iconClassName = 'h-10 w-12',
  wordmarkClassName = 'text-2xl',
  variant = 'gradient',
  compact = false,
}) => {
  return (
  <span className={className} aria-label="Cloudegree Momentum lockup">
      <MomentumLogoIcon className={iconClassName} variant={variant} />
      <Wordmark className={wordmarkClassName} pulseDot={!compact} compact={compact} arrow="angle" />
    </span>
  );
};

/**
 * ProLogoIcon: Professional refined cloud + integrated apex chevron
 */
export const ProLogoIcon: React.FC<LogoIconProps> = ({
  variant = 'gradient',
  title = 'Cloudegree Logo',
  className = 'h-10 w-10',
  ...props
}) => {
  const gradId = useId();
  const titleId = useId();
  const stroke = variant === 'mono' ? 'currentColor' : `url(#${gradId})`;
  const fill = variant === 'mono' ? 'currentColor' : `url(#${gradId})`;
  return (
    <svg viewBox="0 0 64 64" role="img" aria-labelledby={titleId} className={className} {...props}>
      <title id={titleId}>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-alt)" />
        </linearGradient>
      </defs>
      {/* Refined cloud (rounded, balanced) */}
      <path
        d="M46 28c-1-6.4-6.9-11.3-13.6-11.3-5 0-9.5 2.7-11.8 6.8-5.8.4-10.3 5.3-10.3 11.2 0 6.2 5 11.3 11.3 11.3h29.6c5.5 0 10-4.5 10-10 0-5.2-4.1-9.6-9.2-10Z"
        fill={variant === 'outline' ? 'none' : fill}
        opacity={variant === 'mono' ? 0.16 : 1}
        stroke={variant === 'outline' ? stroke : 'none'}
        strokeWidth={3}
      />
      {/* Integrated apex chevron inside cloud */}
      <path d="M24 45 L32 30 L40 45 M28 40 h8" fill="none" stroke={stroke} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ProLogoLockup: React.FC<LogoLockupProps> = ({
  className = 'inline-flex items-center gap-3',
  iconClassName = 'h-10 w-10',
  wordmarkClassName = 'text-2xl',
  variant = 'gradient',
  compact = false,
}) => {
  return (
  <span className={className} aria-label="Cloudegree professional lockup">
      <ProLogoIcon className={iconClassName} variant={variant} />
      <Wordmark className={wordmarkClassName} unified />
    </span>
  );
};
