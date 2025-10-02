"use client";
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import AttachedLogo from '../../../components/brand/AttachedLogo';

/* PreviewHeader (restored)
   -------------------------
   This brings back the calmer preview header. Only the brand area now matches
   the main site exactly (AttachedLogo + tagline styling). Everything else
   remains as the preview style so you can compare.
*/

const nav = [
  { href: '/courses', label: 'Courses' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/docs', label: 'Resources' },
  { href: '/bootcamps', label: 'Bootcamps', badge: 'Live' },
];

export default function HeaderPreviewPage() {
  const [auth, setAuth] = useState<'none' | 'user'>('none');
  const user = auth === 'user' ? { name: 'Ada Lovelace', initials: 'A', avatarUrl: '' } : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-alt/60 text-fg">
      <PreviewHeader authState={auth} setAuthState={setAuth} user={user} />
      <main className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight">Header Redesign Preview</h1>
          <p className="text-sm text-fg-muted leading-relaxed max-w-2xl">
            This page lets us evaluate the proposed calmer header before applying it globally. Toggle auth state to review different layouts.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <button onClick={()=>setAuth('none')} className={`px-3 py-1.5 rounded-md border text-xs ${auth==='none' ? 'bg-teal-600 text-white border-teal-600' : 'border-border hover:bg-bg-alt'} transition`}>Logged Out</button>
            <button onClick={()=>setAuth('user')} className={`px-3 py-1.5 rounded-md border text-xs ${auth==='user' ? 'bg-teal-600 text-white border-teal-600' : 'border-border hover:bg-bg-alt'} transition`}>Logged In</button>
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-fg-muted">Design Notes</h2>
          <ul className="list-disc pl-5 text-xs space-y-1 text-fg-muted/80">
            <li>Primary accent: teal for CTAs and emphasis.</li>
            <li>Badge uses amber for scarcity without overpowering primary accent.</li>
            <li>Reduced button styles; subtle hover color shifts only.</li>
            <li>Nav spacing consistent via gap-x utilities.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function PreviewHeader({ authState, user }: { authState: 'none' | 'user'; setAuthState: (v: 'none' | 'user')=>void; user: any }) {
  const aboutMenuRef = useRef<HTMLDetailsElement | null>(null);
  const closeAboutMenu = () => aboutMenuRef.current?.removeAttribute('open');
  return (
  <header className="sticky top-0 z-40 backdrop-blur-md bg-bg/85">
      <div className="mx-auto max-w-7xl px-6 h-16 md:h-20 flex items-center gap-8">
        {/* Brand (matches main site) */}
  <Link href={'/' as any} aria-label="Cloudegree home" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md inline-flex items-center">
          {/* Desktop */}
          <span className="hidden md:flex flex-col items-start">
            <div className="flex items-center">
              <AttachedLogo className="text-xl font-semibold tracking-tight" text="Cloudegree" />
            </div>
            {/* BEGIN variant: colored dots only, muted labels (revert tag) */}
            <div className="mt-0.5 flex items-center gap-1.5" aria-label="Focus areas">
              {/* Cloud Training (muted label) */}
              {/* BEGIN animated underline on label (revert tag) */}
              <span className="group relative inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted ring-1 ring-border/60 bg-bg/60 shadow-sm">
                {/* BEGIN dot ring pulse (revert tag) */}
                <span className="relative mr-1 inline-flex items-center justify-center" aria-hidden="true">
                  <span className="h-1 w-1 rounded-full bg-amber-500 ring-[1.5px] ring-amber-500/25" />
                  <span className="absolute inset-0 rounded-full ring-2 ring-amber-500/25 scale-100 opacity-0 transition-all duration-300 delay-200 ease-out group-hover:opacity-100 group-hover:scale-110 motion-reduce:transition-none motion-reduce:opacity-0" />
                </span>
                {/* END dot ring pulse (revert tag) */}
                <span className="relative">
                  Cloud Training
                  <span aria-hidden="true" className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px bg-border/50 origin-left scale-x-0 transition-transform duration-300 delay-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:scale-x-100" />
                </span>
              </span>
              {/* END animated underline on label (revert tag) */}
              {/* Mentoring (muted label) */}
              {/* BEGIN animated underline on label (revert tag) */}
              <span className="group relative inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted ring-1 ring-border/60 bg-bg/60 shadow-sm">
                {/* BEGIN dot ring pulse (revert tag) */}
                <span className="relative mr-1 inline-flex items-center justify-center" aria-hidden="true">
                  <span className="h-1 w-1 rounded-full bg-amber-500 ring-[1.5px] ring-amber-500/25" />
                  <span className="absolute inset-0 rounded-full ring-2 ring-amber-500/25 scale-100 opacity-0 transition-all duration-300 delay-200 ease-out group-hover:opacity-100 group-hover:scale-110 motion-reduce:transition-none motion-reduce:opacity-0" />
                </span>
                {/* END dot ring pulse (revert tag) */}
                <span className="relative">
                  Mentoring
                  <span aria-hidden="true" className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px bg-border/50 origin-left scale-x-0 transition-transform duration-300 delay-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:scale-x-100" />
                </span>
              </span>
              {/* END animated underline on label (revert tag) */}
            </div>
            {/* END variant: colored dots only, muted labels (revert tag) */}
          </span>
          {/* Mobile */}
          <span className="md:hidden inline-flex items-center gap-2">
            <div className="flex flex-col items-start">
              <AttachedLogo className="text-lg font-semibold tracking-tight" text="Cloudegree" />
              {/* BEGIN variant: colored dots only, muted labels (revert tag) */}
              <div className="hidden" aria-label="Focus areas">
                {/* BEGIN animated underline on label (revert tag) */}
                <span className="group relative inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted ring-1 ring-border/60 bg-bg/60 shadow-sm">
                  {/* BEGIN dot ring pulse (revert tag) */}
                  <span className="relative mr-1 inline-flex items-center justify-center" aria-hidden="true">
                    <span className="h-1 w-1 rounded-full bg-amber-500 ring-[1.5px] ring-amber-500/25" />
                    <span className="absolute inset-0 rounded-full ring-2 ring-amber-500/25 scale-100 opacity-0 transition-all duration-300 delay-200 ease-out group-hover:opacity-100 group-hover:scale-110 motion-reduce:transition-none motion-reduce:opacity-0" />
                  </span>
                  {/* END dot ring pulse (revert tag) */}
                  <span className="relative">
                    Cloud Training
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px bg-border/50 origin-left scale-x-0 transition-transform duration-300 delay-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:scale-x-100" />
                  </span>
                </span>
                <span className="group relative inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted ring-1 ring-border/60 bg-bg/60 shadow-sm">
                  {/* BEGIN dot ring pulse (revert tag) */}
                  <span className="relative mr-1 inline-flex items-center justify-center" aria-hidden="true">
                    <span className="h-1 w-1 rounded-full bg-amber-500 ring-[1.5px] ring-amber-500/25" />
                    <span className="absolute inset-0 rounded-full ring-2 ring-amber-500/25 scale-100 opacity-0 transition-all duration-300 delay-200 ease-out group-hover:opacity-100 group-hover:scale-110 motion-reduce:transition-none motion-reduce:opacity-0" />
                  </span>
                  {/* END dot ring pulse (revert tag) */}
                  <span className="relative">
                    Mentoring
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px bg-border/50 origin-left scale-x-0 transition-transform duration-300 delay-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:scale-x-100" />
                  </span>
                </span>
                {/* END animated underline on label (revert tag) */}
              </div>
              {/* END variant: colored dots only, muted labels (revert tag) */}
            </div>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 flex items-center gap-7" aria-label="Preview main">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href as any}
              className="relative text-sm font-medium text-fg-muted hover:text-fg transition-colors inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md"
            >
              <span className="after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:origin-left after:bg-accent/50 after:transition-transform group-hover:after:scale-x-100">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-semibold rounded-full bg-amber-500/15 text-amber-600 px-2 py-0.5 leading-none">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Actions cluster */}
        <div className="flex items-center gap-4">
          {/* About us dropdown */}
          <details ref={aboutMenuRef as any} className="relative group">
            <summary className="inline-flex items-center gap-2 rounded-md border border-border px-3 h-9 text-sm font-medium text-fg-muted hover:text-fg hover:bg-bg-alt transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              About us
              <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 8l4 4 4-4"/></svg>
            </summary>
            <div className="absolute right-0 mt-2 w-44 rounded-md border border-border/60 bg-bg shadow-lg p-1 z-50">
              <Link onClick={closeAboutMenu} href={'/about' as any} className="block rounded-[6px] px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">About us</Link>
              <Link onClick={closeAboutMenu} href={'/contact' as any} className="block rounded-[6px] px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">Contact us</Link>
              <Link onClick={closeAboutMenu} href={'/careers' as any} className="block rounded-[6px] px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">Careers</Link>
            </div>
          </details>
          {authState === 'none' && (
            <Link
              href={'/auth/signin' as any}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 h-9 text-sm font-medium text-fg hover:bg-bg-alt transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21v-6"/><path d="M8 21h8"/><path d="M5 10a7 7 0 0 1 14 0v4c0 3-2 5-5 5h-4c-3 0-5-2-5-5v-4Z"/></svg>
              Log In
            </Link>
          )}
          {authState === 'user' && user && (
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 h-9 text-sm font-medium hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-600/15 text-teal-700 font-semibold text-xs">
                  {user.initials}
                </span>
                <span className="max-w-[140px] truncate text-fg-muted group-hover:text-fg">{user.name}</span>
              </button>
            </div>
          )}
          <button
            className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 h-9 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 transition"
          >
            Apply Now
          </button>
          {/* Theme toggle placeholder */}
          <button
            aria-label="Toggle theme"
            className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-bg-alt text-fg-muted hover:text-fg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
