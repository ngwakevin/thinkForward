'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import AttachedLogo from '../brand/AttachedLogo';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { status, data: session } = useSession();
  const aboutMenuRef = React.useRef<HTMLDetailsElement | null>(null);
  const closeAboutMenu = () => aboutMenuRef.current?.removeAttribute('open');
  
  // Log session state for debugging
  React.useEffect(() => {
    console.log('Session status in Header:', status, session);
  }, [status, session]);

  // Preview-style nav (to match app/preview/header)
  const nav = [
    { href: '/courses', label: 'Courses' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/docs', label: 'Resources' },
    { href: '/community', label: 'Community', badge: 'New' },
    { href: '/bootcamps', label: 'Bootcamps', badge: 'Live' },
  ];

  return (
    // BEGIN preview header parity (revert tag)
  <header className="sticky top-0 z-40 backdrop-blur-md bg-bg/85">
      <div className="mx-auto max-w-7xl px-6 h-16 md:h-20 flex items-center gap-8">
        {/* Brand (matches main site logo + preview chips) */}
  <Link href={'/' as any} aria-label="Cloudegree home" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md inline-flex items-center">
          {/* Desktop */}
          <span className="hidden md:flex flex-col items-start">
            <div className="flex items-center">
              <AttachedLogo className="text-xl font-semibold tracking-tight" text="Cloudegree" />
            </div>
            {/* BEGIN variant: colored dots only, muted labels (revert tag) */}
            <div className="mt-0.5 flex items-center gap-1.5" aria-label="Focus areas">
              {/* Cloud Training */}
              <span className="group relative inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted ring-[0.5px] ring-border/50 bg-bg/40">
                <span className="relative mr-1 inline-flex items-center justify-center" aria-hidden="true">
                  <span className="h-1 w-1 rounded-full bg-amber-500 ring-[1.5px] ring-amber-500/25" />
                  <span className="absolute inset-0 rounded-full ring-2 ring-amber-500/25 scale-100 opacity-0 transition-all duration-300 delay-200 ease-out group-hover:opacity-100 group-hover:scale-110 motion-reduce:transition-none motion-reduce:opacity-0" />
                </span>
                <span className="relative">
                  Cloud Training
                  <span aria-hidden="true" className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px bg-border/50 origin-left scale-x-0 transition-transform duration-300 delay-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:scale-x-100" />
                </span>
              </span>
              {/* Mentoring */}
              <span className="group relative inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted ring-[0.5px] ring-border/50 bg-bg/40">
                <span className="relative mr-1 inline-flex items-center justify-center" aria-hidden="true">
                  <span className="h-1 w-1 rounded-full bg-amber-500 ring-[1.5px] ring-amber-500/25" />
                  <span className="absolute inset-0 rounded-full ring-2 ring-amber-500/25 scale-100 opacity-0 transition-all duration-300 delay-200 ease-out group-hover:opacity-100 group-hover:scale-110 motion-reduce:transition-none motion-reduce:opacity-0" />
                </span>
                <span className="relative">
                  Mentoring
                  <span aria-hidden="true" className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px bg-border/50 origin-left scale-x-0 transition-transform duration-300 delay-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:scale-x-100" />
                </span>
              </span>
            </div>
            {/* END variant: colored dots only, muted labels (revert tag) */}
          </span>
          {/* Mobile */}
          <span className="md:hidden inline-flex items-center gap-2">
            <div className="flex flex-col items-start">
              <AttachedLogo className="text-lg font-semibold tracking-tight" text="Cloudegree" />
              {/* BEGIN variant: colored dots only, muted labels (revert tag) */}
              <div className="hidden" aria-label="Focus areas">
                <span className="group relative inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted ring-[0.5px] ring-border/50 bg-bg/40">
                  <span className="relative mr-1 inline-flex items-center justify-center" aria-hidden="true">
                    <span className="h-1 w-1 rounded-full bg-amber-500 ring-[1.5px] ring-amber-500/25" />
                    <span className="absolute inset-0 rounded-full ring-2 ring-amber-500/25 scale-100 opacity-0 transition-all duration-300 delay-200 ease-out group-hover:opacity-100 group-hover:scale-110 motion-reduce:transition-none motion-reduce:opacity-0" />
                  </span>
                  <span className="relative">
                    Cloud Training
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px bg-border/50 origin-left scale-x-0 transition-transform duration-300 delay-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:scale-x-100" />
                  </span>
                </span>
                <span className="group relative inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted ring-[0.5px] ring-border/50 bg-bg/40">
                  <span className="relative mr-1 inline-flex items-center justify-center" aria-hidden="true">
                    <span className="h-1 w-1 rounded-full bg-amber-500 ring-[1.5px] ring-amber-500/25" />
                    <span className="absolute inset-0 rounded-full ring-2 ring-amber-500/25 scale-100 opacity-0 transition-all duration-300 delay-200 ease-out group-hover:opacity-100 group-hover:scale-110 motion-reduce:transition-none motion-reduce:opacity-0" />
                  </span>
                  <span className="relative">
                    Mentoring
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px bg-border/50 origin-left scale-x-0 transition-transform duration-300 delay-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:scale-x-100" />
                  </span>
                </span>
              </div>
              {/* END variant: colored dots only, muted labels (revert tag) */}
            </div>
          </span>
        </Link>

        {/* Nav (preview style) */}
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

        {/* Actions cluster (preview style) */}
        <div className="flex items-center gap-4">
          {/* About us dropdown */}
          <details ref={aboutMenuRef} className="relative group">
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
          {(status === 'unauthenticated' || status === 'loading') && (
            <Link
              href={'/auth/signin' as any}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 h-9 text-sm font-medium text-fg hover:bg-bg-alt transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              {status === 'loading' ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Loading...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21v-6"/><path d="M8 21h8"/><path d="M5 10a7 7 0 0 1 14 0v4c0 3-2 5-5 5h-4c-3 0-5-2-5-5v-4Z"/></svg>
                  Log In
                </>
              )}
            </Link>
          )}
          {status === 'authenticated' && (
            <details className="relative group">
              <summary className="inline-flex items-center gap-2 rounded-md border border-border px-3 h-9 text-sm font-medium text-fg hover:bg-bg-alt transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                {/* Avatar or initials */}
                {((session?.user as any)?.avatarUrl || (session?.user as any)?.image) ? (
                  // Using next/image for automatic optimization. Width/height match Tailwind sizing (h-7 w-7 => 28px)
                  <Image
                    src={(session?.user as any)?.avatarUrl || (session?.user as any)?.image}
                    alt="User avatar"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover border border-border bg-bg"
                    unoptimized={Boolean(((session?.user as any)?.avatarUrl || (session?.user as any)?.image)?.startsWith('http'))}
                  />
                ) : (
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-600/15 text-teal-700 font-semibold text-xs">
                    {(session?.user as any)?.displayName?.[0] || session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                  </span>
                )}
                <span className="max-w-[140px] truncate text-fg-muted group-hover:text-fg">{(session?.user as any)?.displayName || session?.user?.name || session?.user?.email}</span>
                <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 8l4 4 4-4"/></svg>
              </summary>
              <div className="absolute right-0 mt-2 w-48 rounded-md border border-border/60 bg-bg shadow-lg p-1 z-50">
                <Link href={'/profile' as any} className="block rounded-[6px] px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">View profile</Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full text-left rounded-[6px] px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-bg-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >Sign out</button>
              </div>
            </details>
          )}
          <Link
            href={'/bootcamps' as any}
            className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 h-9 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 transition"
          >
            Apply Now
          </Link>
          {/* Theme toggle (icon-only style to match preview) */}
          <button
            aria-label="Toggle theme"
            className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-bg-alt text-fg-muted hover:text-fg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </button>
        </div>
      </div>
    </header>
    // END preview header parity (revert tag)
  );
}
