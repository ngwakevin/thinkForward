"use client";
import React, { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

type Props = {
  src?: object | string; // Lottie JSON object or URL
  height?: number;
  loop?: boolean; // default false (play once)
  ariaLabel?: string;
  className?: string;
  /** Controls ambient glow strength: 'soft' | 'medium' | 'strong' */
  glowIntensity?: 'soft' | 'medium' | 'strong';
  /** Fallback layout style when animation is unavailable or reduced: 'diagonal' | 'radial' */
  layout?: 'diagonal' | 'radial';
};

export default function OnboardingClip({ src, height = 340, loop = false, ariaLabel = "Onboarding: Sign up → Pick course → Learn → Achieve", className = "", glowIntensity = 'soft', layout = 'diagonal' }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<LottieRefCurrentProps | null>(null);
  const [inView, setInView] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  // prefers-reduced-motion
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting);
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    if (reduced) return; // skip animation
    if (inView) {
      if (!loop && !hasPlayed) {
        ref.current.goToAndPlay?.(0, true);
        setHasPlayed(true);
      } else if (loop) {
        ref.current.play?.();
      }
    } else {
      ref.current.pause?.();
    }
  }, [inView, loop, hasPlayed, reduced]);

  const glowClass = glowIntensity === 'strong' ? 'bg-opacity-30' : glowIntensity === 'medium' ? 'bg-opacity-20' : 'bg-opacity-15';

  return (
    <div ref={wrapRef} className={"relative overflow-hidden rounded-2xl " + className}>
      {/* Ambient color glows behind animation for an embedded look */}
      <div className={`pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl ${glowClass}`} style={{ backgroundColor: 'var(--color-accent)' }} aria-hidden />
      <div className={`pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl ${glowClass}`} style={{ backgroundColor: 'var(--color-accent-alt)' }} aria-hidden />
      <div className="relative z-10">
        {reduced || !src ? (
          <div className="grid place-items-center" style={{ height }} aria-hidden>
            <svg viewBox="0 0 640 240" className="w-full h-full">
              <defs>
                {/* Brand-aligned gradients using CSS vars */}
                <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" />
                  <stop offset="100%" stopColor="var(--color-accent-alt)" />
                </linearGradient>
                <linearGradient id="g2" x1="1" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent-alt)" />
                  <stop offset="100%" stopColor="var(--color-accent)" />
                </linearGradient>
                {/* Soft halo gradients and blur filter */}
                <radialGradient id="haloAccent" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="haloAlt" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-accent-alt)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--color-accent-alt)" stopOpacity="0" />
                </radialGradient>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                </filter>
              </defs>
              <rect width="100%" height="100%" rx="24" fill="transparent" />

              {layout === 'radial' ? (
                <>
                  {/* Circular path with subtle direction arrow */}
                  <defs>
                    <marker id="arrowHead" orient="auto" markerWidth="8" markerHeight="8" refX="6" refY="4">
                      <path d="M0,0 L0,6 L6,3 z" fill="var(--color-border)" />
                    </marker>
                  </defs>
                  <g opacity="0.35" stroke="var(--color-border)" strokeWidth="2" fill="none">
                    <circle cx="320" cy="120" r="74" strokeDasharray="4 6" />
                    {/* Short arc with arrow to imply clockwise movement */}
                    <path d="M 394 120 A 74 74 0 0 1 374 166" stroke="var(--color-border)" strokeWidth="2.5" marker-end="url(#arrowHead)" />
                  </g>
                  {/* Soft halos behind each node/icon for decorative emphasis */}
                  <g opacity="0.5" filter="url(#softGlow)">
                    {/* Sign up halo */}
                    <circle cx="268" cy="72" r="26" fill="url(#haloAccent)" />
                    {/* Pick course halo (centered on the rounded rectangle) */}
                    <circle cx="276" cy="158" r="24" fill="url(#haloAlt)" />
                    {/* Learn halo (behind progress bars) */}
                    <circle cx="366" cy="68" r="24" fill="url(#haloAccent)" />
                    {/* Achieve halo (behind checkmark) */}
                    <circle cx="396" cy="152" r="24" fill="url(#haloAlt)" />
                  </g>
                  {/* Nodes around the circle with styled labels and subtle icons */}
                  <g opacity="0.98">
                    {/* Sign up (top-left quadrant) */}
                    <circle cx="268" cy="72" r="18" fill="url(#g1)" />
                    {/* User icon */}
                    <path d="M260 76 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
                    <text x="268" y="48" textAnchor="middle" fill="white" fontSize="20" fontFamily="ui-sans-serif, system-ui, -apple-system" letterSpacing="0.3px">Sign up</text>
                    {/* Pick course (bottom-left) */}
                    <rect x="248" y="146" width="56" height="24" rx="10" fill="url(#g2)" />
                    {/* Book icon */}
                    <path d="M254 150 h18 a6 6 0 0 1 6 6 v14 a6 6 0 0 0 -6 -6 h-18 z" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
                    <text x="276" y="186" textAnchor="middle" fill="white" fontSize="20" fontFamily="ui-sans-serif, system-ui, -apple-system" letterSpacing="0.3px">Pick course</text>
                    {/* Learn (top-right) */}
                    <text x="364" y="48" textAnchor="middle" fill="white" fontSize="20" fontFamily="ui-sans-serif, system-ui, -apple-system" letterSpacing="0.3px">Learn</text>
                    {/* Progress bars */}
                    <rect x="336" y="64" width="56" height="8" rx="4" fill="url(#g1)" />
                    <rect x="396" y="64" width="56" height="8" rx="4" fill="url(#g2)" />
                    {/* Achieve (bottom-right) */}
                    <text x="396" y="186" textAnchor="middle" fill="white" fontSize="20" fontFamily="ui-sans-serif, system-ui, -apple-system" letterSpacing="0.3px">Achieve</text>
                    {/* Check mark icon */}
                    <path d="M370 160 l14 14 30 -30" fill="none" stroke="url(#g2)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </>
              ) : (
                <>
                  {/* Dotted, diagonal connector path */}
                  <g opacity="0.55" stroke="url(#g1)" strokeWidth="2" fill="none">
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
                    <circle cx="48" cy="40" r="30" fill="url(#g1)" />
                    <text x="96" y="46" fill="white" fontSize="16" fontFamily="system-ui,-apple-system">Sign up</text>
                  </g>
                  <g transform="translate(48,110)" opacity="0.98">
                    <rect x="18" y="10" width="78" height="40" rx="12" fill="url(#g2)" />
                    <text x="116" y="38" fill="white" fontSize="16" fontFamily="system-ui,-apple-system">Pick course</text>
                  </g>
                  {/* Right column: Learn, Achieve */}
                  <g transform="translate(332,48)" opacity="0.98">
                    <text x="0" y="0" fill="white" fontSize="16" fontFamily="system-ui,-apple-system">Learn</text>
                    <rect x="0" y="16" width="86" height="10" rx="5" fill="url(#g1)" />
                    <rect x="98" y="16" width="86" height="10" rx="5" fill="url(#g2)" />
                    <rect x="196" y="16" width="86" height="10" rx="5" fill="url(#g1)" />
                  </g>
                  <g transform="translate(332,130)" opacity="0.98">
                    <text x="0" y="0" fill="white" fontSize="16" fontFamily="system-ui,-apple-system">Achieve</text>
                    <path d="M6 20 l18 18 44 -44" fill="none" stroke="url(#g2)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </>
              )}
            </svg>
          </div>
        ) : (
          <Lottie
            lottieRef={ref}
            autoplay={false}
            loop={loop}
            animationData={typeof src === "object" ? (src as object) : undefined}
            src={typeof src === "string" ? (src as string) : undefined}
            style={{ width: "100%", height }}
            aria-label={ariaLabel}
          />
        )}
      </div>
    </div>
  );
}
