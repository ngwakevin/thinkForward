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
  
  const nav = [
    { href: '/courses', label: 'Courses' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/docs', label: 'Resources' },
    { href: '/community', label: 'Community' },
    { href: '/bootcamps', label: 'Bootcamps', badge: 'Live' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-xl bg-bg/90 supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center gap-8">
          {/* Brand - Fixed spacing to prevent touching border */}
          <Link 
            href={'/' as any} 
            aria-label="Cloudegree home" 
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md inline-flex items-start pt-3 pb-3"
          >
            <span className="hidden md:flex flex-col items-start">
              <div className="flex items-center">
                <AttachedLogo className="text-xl font-semibold tracking-tight" text="Cloudegree" />
              </div>
              {/* Keep original decorative chips - with proper spacing */}
              <div className="mt-1.5 flex items-center gap-1.5" aria-label="Focus areas">
                <span className="group relative inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted ring-[0.5px] ring-border/50 bg-bg/40 whitespace-nowrap">
                  <span className="relative mr-1 inline-flex items-center justify-center" aria-hidden="true">
                    <span className="h-1 w-1 rounded-full bg-amber-500 ring-[1.5px] ring-amber-500/25" />
                    <span className="absolute inset-0 rounded-full ring-2 ring-amber-500/25 scale-100 opacity-0 transition-all duration-300 delay-200 ease-out group-hover:opacity-100 group-hover:scale-110 motion-reduce:transition-none motion-reduce:opacity-0" />
                  </span>
                  <span className="relative">
                    Cloud Training
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px bg-border/50 origin-left scale-x-0 transition-transform duration-300 delay-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:scale-x-100" />
                  </span>
                </span>
                <span className="group relative inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted ring-[0.5px] ring-border/50 bg-bg/40 whitespace-nowrap">
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
            </span>
            {/* Mobile */}
            <span className="md:hidden inline-flex items-center gap-2">
              <AttachedLogo className="text-lg font-semibold tracking-tight" text="Cloudegree" />
            </span>
          </Link>

          {/* Navigation - All items on straight line */}
          <nav className="flex-1 flex items-center gap-6" aria-label="Main navigation">
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href as any}
                className="relative text-sm font-medium text-fg-muted hover:text-fg transition-colors inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md"
              >
                <span className="after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:origin-left after:bg-accent/60 after:transition-transform group-hover:after:scale-x-100">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-semibold rounded-full bg-accent/15 text-accent px-2 py-0.5 leading-none">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Actions - All text on straight line */}
          <div className="flex items-center gap-3">
            {/* About us dropdown - text aligned */}
            <details ref={aboutMenuRef} className="relative group">
              <summary className="inline-flex items-center gap-2 rounded-md border border-border px-3 h-9 text-sm font-medium text-fg-muted hover:text-fg hover:bg-bg-alt transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="whitespace-nowrap">About us</span>
                <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8l4 4 4-4"/>
                </svg>
              </summary>
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border/60 bg-bg/95 backdrop-blur-xl shadow-xl p-1.5 z-50">
                <Link onClick={closeAboutMenu} href={'/about' as any} className="block rounded-lg px-3 py-2.5 text-sm text-fg-muted hover:text-fg hover:bg-bg-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">About us</Link>
                <Link onClick={closeAboutMenu} href={'/contact' as any} className="block rounded-lg px-3 py-2.5 text-sm text-fg-muted hover:text-fg hover:bg-bg-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">Contact us</Link>
                <Link onClick={closeAboutMenu} href={'/careers' as any} className="block rounded-lg px-3 py-2.5 text-sm text-fg-muted hover:text-fg hover:bg-bg-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">Careers</Link>
              </div>
            </details>

            {/* Log In - text on straight line */}
            {(status === 'unauthenticated' || status === 'loading') && (
              <Link
                href={'/login' as any}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 h-9 text-sm font-medium text-fg hover:bg-bg-alt transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                {status === 'loading' ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="whitespace-nowrap">Loading...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" x2="3" y1="12" y2="12"/>
                    </svg>
                    <span className="whitespace-nowrap">Log In</span>
                  </>
                )}
              </Link>
            )}

            {status === 'authenticated' && (
              <details className="relative group">
                <summary className="inline-flex items-center gap-2 rounded-md border border-border px-3 h-9 text-sm font-medium text-fg hover:bg-bg-alt transition cursor-pointer list-none [&::-webkit-details-marker]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
                  {((session?.user as any)?.avatarUrl || (session?.user as any)?.image) ? (
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
                  <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8l4 4 4-4"/>
                  </svg>
                </summary>
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border/60 bg-bg/95 backdrop-blur-xl shadow-xl p-1.5 z-50">
                  <Link href={'/profile' as any} className="block rounded-lg px-3 py-2.5 text-sm text-fg-muted hover:text-fg hover:bg-bg-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">View profile</Link>
                  <div className="my-1 h-px bg-border/60" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left rounded-lg px-3 py-2.5 text-sm text-fg-muted hover:text-fg hover:bg-bg-alt transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >Sign out</button>
                </div>
              </details>
            )}

            {/* Book Mentorship - text on straight line with others */}
            <Link
              href={'/mentoring' as any}
              className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 px-6 h-9 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/35 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span className="whitespace-nowrap">Book Mentorship</span>
            </Link>

            {/* Modern Theme toggle with gradient and animations */}
            <button
              aria-label="Toggle theme"
              className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 hover:border-violet-500/40 text-violet-600 dark:text-violet-400 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 group overflow-hidden"
            >
              {/* Animated background gradient */}
              <span className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/20 group-hover:to-fuchsia-500/20 transition-all duration-300" />
              
              {/* Moon icon with rotation animation */}
              <svg 
                viewBox="0 0 24 24" 
                className="relative h-5 w-5 transition-transform duration-300 group-hover:rotate-12" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
              
              {/* Sparkle effect on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="absolute top-1 right-1 h-1 w-1 rounded-full bg-violet-400 animate-pulse" />
                <span className="absolute bottom-1.5 left-1.5 h-0.5 w-0.5 rounded-full bg-fuchsia-400 animate-pulse delay-75" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
