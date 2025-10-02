"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

type Props = {
  /** Optional path or imported JSON for the Lottie animation */
  src?: object | string;
  /** Height of the animation container */
  height?: number;
  /** If true, will not auto-play; otherwise auto-plays when entering viewport. */
  autoPlay?: boolean;
  /** If true, animation will loop; recommended false for one pass. */
  loop?: boolean;
  /** Accessible label for the animation */
  ariaLabel?: string;
  /** Controls ambient glow strength: 'soft' | 'medium' | 'strong' */
  glowIntensity?: 'soft' | 'medium' | 'strong';
  /** Fallback layout style when animation is unavailable or reduced: 'diagonal' | 'radial' */
  layout?: 'diagonal' | 'radial';
};

/**
 * Clean, minimal 10–15s onboarding animation: Sign up → Pick course → Learn → Achieve
 * Behavior: Plays when in view, one pass by default (loop=false), with a static SVG fallback.
 */
export default function OnboardingAnimation({ src, height = 380, autoPlay = true, loop = false, ariaLabel = "Onboarding animation", glowIntensity = 'soft', layout = 'diagonal' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<LottieRefCurrentProps | null>(null);
  const [inView, setInView] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Provide a small built-in fallback if no src passed
  const fallbackSvg = useMemo(
    () => (
      <svg
        viewBox="0 0 640 240"
        role="img"
        aria-label="Sign up, pick course, learn, achieve"
        className="w-full h-full"
      >
        <defs>
          {/* Brand-aligned gradients using CSS vars */}
          <linearGradient id="oa-g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent-alt)" />
          </linearGradient>
          <linearGradient id="oa-g2" x1="1" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent-alt)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
          {/* Soft halo gradients and blur filter (unique ids) */}
          <radialGradient id="oa-haloAccent" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="oa-haloAlt" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent-alt)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-accent-alt)" stopOpacity="0" />
          </radialGradient>
          <filter id="oa-softGlow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          </filter>
        </defs>
        <rect width="100%" height="100%" rx="24" fill="transparent" />

        {layout === 'radial' ? (
          <>
            {/* Circular path with subtle direction arrow */}
            <defs>
              <marker id="arrowHeadOA" orient="auto" markerWidth="8" markerHeight="8" refX="6" refY="4">
                <path d="M0,0 L0,6 L6,3 z" fill="var(--color-accent)" />
              </marker>
            </defs>
            <g opacity="0.35" stroke="var(--color-border)" strokeWidth="2" fill="none">
              <circle cx="320" cy="120" r="74" strokeDasharray="4 6" />
              {/* Short arc with arrow to imply clockwise movement */}
              <path d="M 394 120 A 74 74 0 0 1 374 166" stroke="var(--color-border)" strokeWidth="2.5" marker-end="url(#arrowHeadOA)" />
            </g>
            {/* Soft halos behind each node/icon for decorative emphasis */}
            <g opacity="0.5" filter="url(#oa-softGlow)">
              {/* Sign up halo */}
              <circle cx="268" cy="72" r="26" fill="url(#oa-haloAccent)" />
              {/* Pick course halo (centered on the rounded rectangle) */}
              <circle cx="276" cy="158" r="24" fill="url(#oa-haloAlt)" />
              {/* Learn halo (behind progress bars) */}
              <circle cx="366" cy="68" r="24" fill="url(#oa-haloAccent)" />
              {/* Achieve halo (behind checkmark) */}
              <circle cx="396" cy="152" r="24" fill="url(#oa-haloAlt)" />
            </g>
            {/* Nodes around the circle with styled labels and subtle icons */}
            <g opacity="0.98">
              {/* Sign up (top-left quadrant) */}
              <circle cx="268" cy="72" r="18" fill="url(#oa-g1)" />
              {/* User icon */}
              <path d="M260 76 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
              <text x="268" y="48" textAnchor="middle" fill="white" fontSize="20" fontFamily="ui-sans-serif, system-ui, -apple-system" letterSpacing="0.3px">Sign up</text>
              {/* Pick course (bottom-left) */}
              <rect x="248" y="146" width="56" height="24" rx="10" fill="url(#oa-g2)" />
              {/* Book icon */}
              <path d="M254 150 h18 a6 6 0 0 1 6 6 v14 a6 6 0 0 0 -6 -6 h-18 z" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
              <text x="276" y="186" textAnchor="middle" fill="white" fontSize="20" fontFamily="ui-sans-serif, system-ui, -apple-system" letterSpacing="0.3px">Pick course</text>
              {/* Learn (top-right) */}
              <text x="364" y="48" textAnchor="middle" fill="white" fontSize="20" fontFamily="ui-sans-serif, system-ui, -apple-system" letterSpacing="0.3px">Learn</text>
              {/* Progress bars */}
              <rect x="336" y="64" width="56" height="8" rx="4" fill="url(#oa-g1)" />
              <rect x="396" y="64" width="56" height="8" rx="4" fill="url(#oa-g2)" />
              {/* Achieve (bottom-right) */}
              <text x="396" y="186" textAnchor="middle" fill="white" fontSize="20" fontFamily="ui-sans-serif, system-ui, -apple-system" letterSpacing="0.3px">Achieve</text>
              {/* Check mark icon */}
              <path d="M370 160 l14 14 30 -30" fill="none" stroke="url(#oa-g2)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </>
        ) : (
          <>
            {/* Dotted, diagonal connector path */}
            <g opacity="0.55" stroke="url(#oa-g1)" strokeWidth="2" fill="none">
              <path d="M140 60 C 260 80, 360 90, 480 120" strokeDasharray="4 6" />
            </g>
            {/* Subtle nodes on the connector */}
            <g opacity="0.8">
              <circle cx="140" cy="60" r="3" fill="var(--color-accent)" />
              <circle cx="320" cy="92" r="3" fill="var(--color-accent-alt)" />
              <circle cx="480" cy="120" r="3" fill="var(--color-accent)" />
            </g>
            {/* Left column: Sign up, Pick course */}
            <g transform="translate(48,36)" opacity="0.98">
              <circle cx="48" cy="40" r="30" fill="url(#oa-g1)" />
              <text x="96" y="46" fill="white" fontSize="16" fontFamily="system-ui, -apple-system">Sign up</text>
            </g>
            <g transform="translate(48,110)" opacity="0.98">
              <rect x="18" y="10" width="78" height="40" rx="12" fill="url(#oa-g2)" />
              <text x="116" y="38" fill="white" fontSize="16" fontFamily="system-ui, -apple-system">Pick course</text>
            </g>
            {/* Right column: Learn, Achieve */}
            <g transform="translate(332,48)" opacity="0.98">
              <text x="0" y="0" fill="white" fontSize="16" fontFamily="system-ui, -apple-system">Learn</text>
              <rect x="0" y="16" width="86" height="10" rx="5" fill="url(#oa-g1)" />
              <rect x="98" y="16" width="86" height="10" rx="5" fill="url(#oa-g2)" />
              <rect x="196" y="16" width="86" height="10" rx="5" fill="url(#oa-g1)" />
            </g>
            <g transform="translate(332,130)" opacity="0.98">
              <text x="0" y="0" fill="white" fontSize="16" fontFamily="system-ui, -apple-system">Achieve</text>
              <path d="M6 20 l18 18 44 -44" fill="none" stroke="url(#oa-g2)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </>
        )}
      </svg>
    ),
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mql.matches;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playerRef.current) return;
    const player = playerRef.current;

    if (inView) {
      if (autoPlay && !loop && !hasPlayed) {
        try { player.goToAndPlay?.(0, true); } catch {}
        setHasPlayed(true);
      } else if (autoPlay && loop) {
        try { player.play?.(); } catch {}
      }
    } else {
      try { player.pause?.(); } catch {}
    }
  }, [inView, autoPlay, loop, hasPlayed]);

  const prefersReducedMotion = usePrefersReducedMotion();

  const glowClass = glowIntensity === 'strong' ? 'bg-opacity-30' : glowIntensity === 'medium' ? 'bg-opacity-20' : 'bg-opacity-15';

  return (
    <section aria-labelledby="onboarding-title" className="relative py-16">
      {/* Ambient gradient glows for an embedded feel */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className={`absolute -top-20 -left-24 h-64 w-64 rounded-full blur-3xl ${glowClass}`} style={{ backgroundColor: 'var(--color-accent)' }} />
        <div className={`absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl ${glowClass}`} style={{ backgroundColor: 'var(--color-accent-alt)' }} />
      </div>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">How it works</p>
            <h2 id="onboarding-title" className="font-display text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">
              Sign up → Pick course → Learn → Achieve
            </h2>
            <p className="text-fg-muted text-base leading-relaxed">A 10–15 second visual that explains the journey at a glance. Plays once when visible, then rests.</p>
          </div>
          <div ref={containerRef} className="relative">
            {prefersReducedMotion ? (
              <div aria-hidden className="aspect-[3/2] grid place-items-center" style={{ height }}>
                {fallbackSvg}
              </div>
            ) : src ? (
              <Lottie
                lottieRef={playerRef}
                autoplay={false}
                loop={loop}
                animationData={typeof src === "object" ? (src as object) : undefined}
                src={typeof src === "string" ? (src as string) : undefined}
                style={{ width: "100%", height }}
                aria-label={ariaLabel}
              />
            ) : (
              <div aria-hidden className="aspect-[3/2] grid place-items-center" style={{ height }}>
                {fallbackSvg}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}
