"use client";
import React from "react";
// Removed reveal hook for new animation style

/**
 * Minimal, friendly illustrations inspired by the provided attachment.
 * - No animations
 * - Soft blob background + simple line figures
 * - Theme-aware via Tailwind tokens
 */

type SceneProps = {
  className?: string;
  ariaLabel?: string;
};

function Card({ children, className, ariaLabel }: React.PropsWithChildren<SceneProps>) {
  return (
    <figure aria-label={ariaLabel} className={("relative isolate overflow-visible " + (className ?? "")).trim()}>
      {children}
    </figure>
  );
}

export function StudentReader(props: SceneProps) {
  return (
    <Card ariaLabel={props.ariaLabel ?? "Decorative: reader"} className={props.className}>
      {/* soft blobs using site colors */}
      <div aria-hidden className="absolute -z-10 left-0 top-0 h-36 w-48 rounded-[46%] bg-accent-soft/40" />
      <div aria-hidden className="absolute -z-10 left-8 top-6 h-24 w-36 rounded-[48%] bg-accent/10" />
      {/* Figure */}
      <svg viewBox="0 0 120 120" className="h-28 w-28 text-fg" role="img" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* head */}
          <circle cx="60" cy="28" r="10" fill="var(--color-accent-soft)" stroke="currentColor" />
          {/* body */}
          <rect x="48" y="40" width="24" height="28" rx="5" fill="var(--color-bg-alt)" />
          {/* arms */}
          <path d="M48 48 H35" />
          <path d="M72 48 H85" />
          {/* legs */}
          <path d="M54 68 V86" />
          <path d="M66 68 V86" />
          {/* book */}
          <rect x="38" y="50" width="44" height="14" rx="3" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" />
          <path d="M60 50 V64" stroke="var(--color-accent-alt)" />
        </g>
      </svg>
    </Card>
  );
}

export function MentorTeacher(props: SceneProps) {
  return (
    <Card ariaLabel={props.ariaLabel ?? "Decorative: teacher"} className={props.className}>
  {/* soft blobs using site colors */}
  <div aria-hidden className="absolute -z-10 right-0 top-0 h-36 w-48 rounded-[46%] bg-accent-soft/40" />
  <div aria-hidden className="absolute -z-10 right-6 top-6 h-24 w-36 rounded-[48%] bg-accent-alt/10" />
      {/* Figure */}
      <svg viewBox="0 0 120 120" className="h-28 w-28 text-fg" role="img" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* head */}
          <circle cx="42" cy="28" r="10" fill="var(--color-accent-soft)" stroke="currentColor" />
          {/* body */}
          <rect x="30" y="40" width="24" height="28" rx="5" fill="var(--color-bg-alt)" />
          {/* legs */}
          <path d="M36 68 V86" />
          <path d="M48 68 V86" />
          {/* arm pointing */}
          <path d="M54 52 H78" />
          {/* board */}
          <rect x="78" y="38" width="26" height="22" rx="3" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent-alt)" />
          <path d="M82 44 H98" stroke="var(--color-accent-alt)" />
          <path d="M82 50 H95" stroke="var(--color-accent-alt)" />
        </g>
      </svg>
    </Card>
  );
}

export function LearningDuo() {
  return (
    <div className="grid gap-10 sm:gap-12 md:gap-14">
      <StudentReader />
      <MentorTeacher />
    </div>
  );
}

export default LearningDuo;

/* --- Refined set matching the reference image --- */

export function BriefcasePerson() {
  return (
    <figure aria-label="Decorative: person with briefcase" className="relative w-[220px] h-[180px] md:w-[240px] md:h-[190px] lg:w-[260px] lg:h-[210px]">
      {/* soft blobs using site colors */}
      <div aria-hidden className="absolute left-0 top-0 h-[150px] w-[190px] md:h-[160px] md:w-[200px] lg:h-[170px] lg:w-[220px] rounded-[46%] bg-accent-soft/40" />
      <div aria-hidden className="absolute left-6 top-8 h-24 w-36 md:h-28 md:w-40 lg:h-32 lg:w-44 rounded-[48%] bg-accent/10" />
      {/* blue dots accent */}
      <div aria-hidden className="absolute left-8 top-4 flex gap-1.5 text-accent">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      </div>
      {/* figure */}
      <svg viewBox="0 0 120 120" className="absolute left-6 top-6 h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 text-fg" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="40" cy="22" r="10" fill="var(--color-accent-soft)" />
          <rect x="28" y="34" width="24" height="28" rx="6" fill="var(--color-bg-alt)" />
          <path d="M28 42 H14" />
          <path d="M52 42 H66" />
          <path d="M34 62 V80" />
          <path d="M46 62 V80" />
          {/* briefcase */}
          <rect x="68" y="46" width="18" height="12" rx="2" fill="var(--color-accent)" stroke="currentColor" />
          <path d="M72 46 v-3 h10 v3" />
        </g>
      </svg>
    </figure>
  );
}

export function BackpackReader() {
  return (
    <figure aria-label="Decorative: person with backpack handing a book" className="relative w-[220px] h-[180px] md:w-[240px] md:h-[190px] lg:w-[260px] lg:h-[210px]">
      {/* soft blobs */}
    <div aria-hidden className="absolute right-0 top-0 h-[150px] w-[190px] md:h-[160px] md:w-[200px] lg:h-[170px] lg:w-[220px] rounded-[46%] bg-accent-soft/40" />
    <div aria-hidden className="absolute right-6 top-8 h-24 w-36 md:h-28 md:w-40 lg:h-32 lg:w-44 rounded-[48%] bg-accent-alt/10" />
      <svg viewBox="0 0 140 120" className="absolute right-6 top-6 h-28 w-32 md:h-32 md:w-36 lg:h-36 lg:w-40 text-fg" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="70" cy="20" r="10" fill="var(--color-accent-soft)" />
          {/* body */}
          <rect x="58" y="32" width="24" height="28" rx="6" fill="var(--color-bg-alt)" />
          {/* legs */}
          <path d="M64 60 V78" />
          <path d="M76 60 V78" />
          {/* backpack */}
          <rect x="46" y="32" width="16" height="22" rx="5" fill="var(--color-accent-alt)" opacity="0.4" stroke="currentColor" />
          {/* arm to book */}
          <path d="M82 46 H98" />
          {/* book being handed */}
          <rect x="98" y="40" width="18" height="12" rx="2" fill="var(--color-accent)" stroke="currentColor" />
        </g>
      </svg>
    </figure>
  );
}

export function GroupChat() {
  return (
    <figure aria-label="Decorative: small group chat" className="relative w-[260px] h-[210px] md:w-[280px] md:h-[220px] lg:w-[300px] lg:h-[230px]">
      {/* mint blob using site colors */}
    <div aria-hidden className="absolute left-0 bottom-0 h-[170px] w-[220px] md:h-[180px] md:w-[240px] lg:h-[190px] lg:w-[260px] rounded-[46%] bg-accent-soft/40" />
    {/* small red badge and blue equals */}
  <div aria-hidden className="absolute left-[188px] top-[34px] h-3 w-4 rounded-b-full rounded-t-sm bg-danger/80" />
    <div aria-hidden className="absolute left-[206px] top-[52px] h-4 w-6 rounded-sm bg-accent-alt/60" />
      <svg viewBox="0 0 140 120" className="absolute left-8 bottom-8 h-28 w-36 md:h-32 md:w-40 lg:h-36 lg:w-44 text-fg" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* three heads */}
          <circle cx="50" cy="38" r="9" fill="var(--color-accent-soft)" />
          <circle cx="30" cy="46" r="9" fill="var(--color-accent-soft)" />
          <circle cx="70" cy="46" r="9" fill="var(--color-accent-soft)" />
          {/* three bodies */}
          <rect x="44" y="48" width="12" height="20" rx="4" fill="var(--color-bg-alt)" />
          <rect x="22" y="56" width="14" height="18" rx="4" fill="var(--color-bg-alt)" />
          <rect x="64" y="56" width="14" height="18" rx="4" fill="var(--color-bg-alt)" />
          {/* legs */}
          <path d="M26 74 V86" />
          <path d="M36 74 V86" />
          <path d="M66 74 V86" />
          <path d="M76 74 V86" />
          <path d="M50 68 V86" />
          <path d="M56 68 V86" />
        </g>
      </svg>
    </figure>
  );
}

export function LearningTriptych() {
  // Layout similar to the attachment: two at top row, one bottom-left
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-4">
        <BriefcasePerson />
        <BackpackReader />
      </div>
      <div className="mt-3 ml-2">
        <GroupChat />
      </div>
    </div>
  );
}

/* --- Animated variants (subtle, attachment-style) --- */

export function AnimatedBriefcasePerson() {
  return (
    <figure aria-label="Decorative: person with briefcase (animated)" className="relative w-[220px] h-[180px] md:w-[240px] md:h-[190px] lg:w-[260px] lg:h-[210px] select-none">
      {/* softly morphing blobs */}
      <div aria-hidden className="absolute left-0 top-0 h-[150px] w-[190px] md:h-[160px] md:w-[200px] lg:h-[170px] lg:w-[220px] bg-accent-soft/40 animate-blob-morph-slow" />
      <div aria-hidden className="absolute left-6 top-8 h-24 w-36 md:h-28 md:w-40 lg:h-32 lg:w-44 bg-accent/10 animate-blob-morph-slower" />
      {/* blue dots accent twinkling */}
      <div aria-hidden className="absolute left-8 top-4 flex gap-1.5 text-accent">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-twinkle-slow" style={{ animationDelay: "0ms" }} />
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-twinkle-slow" style={{ animationDelay: "300ms" }} />
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-twinkle-slow" style={{ animationDelay: "600ms" }} />
      </div>
      {/* floating figure */}
      <svg viewBox="0 0 120 120" className="absolute left-6 top-6 h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 text-fg animate-float-slow" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="40" cy="22" r="10" fill="var(--color-accent-soft)" />
          <rect x="28" y="34" width="24" height="28" rx="6" fill="var(--color-bg-alt)" />
          <path d="M28 42 H14" />
          <path d="M52 42 H66" />
          <path d="M34 62 V80" />
          <path d="M46 62 V80" />
          {/* briefcase */}
          <rect x="68" y="46" width="18" height="12" rx="2" fill="var(--color-accent)" stroke="currentColor" className="animate-pulse-soft" />
          <path d="M72 46 v-3 h10 v3" />
        </g>
      </svg>
    </figure>
  );
}

export function AnimatedBackpackReader() {
  return (
    <figure aria-label="Decorative: person with backpack handing a book (animated)" className="relative w-[220px] h-[180px] md:w-[240px] md:h-[190px] lg:w-[260px] lg:h-[210px] select-none">
      {/* soft blobs morph */}
      <div aria-hidden className="absolute right-0 top-0 h-[150px] w-[190px] md:h-[160px] md:w-[200px] lg:h-[170px] lg:w-[220px] bg-accent-soft/40 animate-blob-morph-slow" />
      <div aria-hidden className="absolute right-6 top-8 h-24 w-36 md:h-28 md:w-40 lg:h-32 lg:w-44 bg-accent-alt/10 animate-blob-morph-slower" />
      <svg viewBox="0 0 140 120" className="absolute right-6 top-6 h-28 w-32 md:h-32 md:w-36 lg:h-36 lg:w-40 text-fg animate-float-slower" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="70" cy="20" r="10" fill="var(--color-accent-soft)" />
          {/* body */}
          <rect x="58" y="32" width="24" height="28" rx="6" fill="var(--color-bg-alt)" />
          {/* legs */}
          <path d="M64 60 V78" />
          <path d="M76 60 V78" />
          {/* backpack */}
          <rect x="46" y="32" width="16" height="22" rx="5" fill="var(--color-accent-alt)" opacity="0.4" stroke="currentColor" />
          {/* arm to book */}
          <path d="M82 46 H98" />
          {/* book being handed */}
          <rect x="98" y="40" width="18" height="12" rx="2" fill="var(--color-accent)" stroke="currentColor" className="animate-pulse-soft" />
        </g>
      </svg>
    </figure>
  );
}

export function AnimatedGroupChat() {
  return (
    <figure aria-label="Decorative: small group chat (animated)" className="relative w-[260px] h-[210px] md:w-[280px] md:h-[220px] lg:w-[300px] lg:h-[230px] select-none">
      {/* mint blob morphing */}
      <div aria-hidden className="absolute left-0 bottom-0 h-[170px] w-[220px] md:h-[180px] md:w-[240px] lg:h-[190px] lg:w-[260px] bg-accent-soft/40 animate-blob-morph-slow" />
      {/* small red badge and blue equals with motion */}
      <div aria-hidden className="absolute left-[188px] top-[34px] h-3 w-4 rounded-b-full rounded-t-sm bg-danger/80 animate-pulse-soft" />
      <div aria-hidden className="absolute left-[206px] top-[52px] h-4 w-6 rounded-sm bg-accent-alt/60 animate-float-slowest" />
      <svg viewBox="0 0 140 120" className="absolute left-8 bottom-8 h-28 w-36 md:h-32 md:w-40 lg:h-36 lg:w-44 text-fg animate-float-slow" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* three heads */}
          <circle cx="50" cy="38" r="9" fill="var(--color-accent-soft)" />
          <circle cx="30" cy="46" r="9" fill="var(--color-accent-soft)" />
          <circle cx="70" cy="46" r="9" fill="var(--color-accent-soft)" />
          {/* three bodies */}
          <rect x="44" y="48" width="12" height="20" rx="4" fill="var(--color-bg-alt)" />
          <rect x="22" y="56" width="14" height="18" rx="4" fill="var(--color-bg-alt)" />
          <rect x="64" y="56" width="14" height="18" rx="4" fill="var(--color-bg-alt)" />
          {/* legs */}
          <path d="M26 74 V86" />
          <path d="M36 74 V86" />
          <path d="M66 74 V86" />
          <path d="M76 74 V86" />
          <path d="M50 68 V86" />
          <path d="M56 68 V86" />
        </g>
      </svg>
    </figure>
  );
}

export function AnimatedLearningTriptych() {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-4">
        <AnimatedBriefcasePerson />
        <AnimatedBackpackReader />
      </div>
      <div className="mt-3 ml-2">
        <AnimatedGroupChat />
      </div>
    </div>
  );
}
