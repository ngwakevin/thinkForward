'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import AttachedLogo from '../brand/AttachedLogo';
import { useSession, signOut } from 'next-auth/react';

export function HeaderLiquidGlass() {
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
    <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-2xl bg-gradient-to-b from-white/80 via-white/60 to-white/40 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/40 shadow-lg shadow-black/5">
      {/* Liquid glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50" />
      <div className="absolute inset-0 backdrop-saturate-150" />
      
      {/* Subtle animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" 
           style={{
             backgroundSize: '200% 100%',
             animation: 'shimmer 8s ease-in-out infinite'
           }} />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Brand - Clean and minimal */}
          <Link 
            href={'/' as any} 
            aria-label="Cloudegree home" 
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-lg inline-flex items-center py-3 transition-all hover:scale-[1.02]"
          >
            <span className="hidden md:flex flex-col items-start gap-2">
              <AttachedLogo className="text-xl font-bold tracking-tight" text="Cloudegree" />
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Cloud
                </span>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-teal-500/15 to-cyan-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/20 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                  Mentoring
                </span>
              </div>
            </span>
            <span className="md:hidden inline-flex items-center">
              <AttachedLogo className="text-lg font-bold tracking-tight" text="Cloudegree" />
            </span>
          </Link>

          {/* Center Navigation - Floating glass pills */}
          <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center" aria-label="Main navigation">
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href as any}
                className="relative px-4 py-2 text-sm font-medium text-fg-muted hover:text-fg rounded-full transition-all inline-flex items-center gap-2 hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm"
              >
                {item.label}
                {item.badge && (
                  <span className="text-[9px] font-bold rounded-full bg-gradient-to-r from-accent to-accent/80 px-1.5 py-0.5 text-white leading-none uppercase tracking-wide shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions - Glass morphism */}
          <div className="flex items-center gap-2">
            <details ref={aboutMenuRef} className="relative group">
              <summary className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg rounded-full transition-all cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm">
                About
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </summary>
              <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-2xl shadow-black/10 p-2 z-50">
                <Link onClick={closeAboutMenu} href={'/about' as any} className="block rounded-xl px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-white/60 dark:hover:bg-white/10 transition-colors backdrop-blur-sm">About us</Link>
                <Link onClick={closeAboutMenu} href={'/contact' as any} className="block rounded-xl px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-white/60 dark:hover:bg-white/10 transition-colors backdrop-blur-sm">Contact</Link>
                <Link onClick={closeAboutMenu} href={'/careers' as any} className="block rounded-xl px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-white/60 dark:hover:bg-white/10 transition-colors backdrop-blur-sm">Careers</Link>
              </div>
            </details>

            {(status === 'unauthenticated' || status === 'loading') && (
              <Link
                href={'/login' as any}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-fg rounded-full transition-all border border-white/20 hover:border-white/40 hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm"
              >
                {status === 'loading' ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="whitespace-nowrap">Loading...</span>
                  </>
                ) : (
                  <span className="whitespace-nowrap">Log In</span>
                )}
              </Link>
            )}

            {status === 'authenticated' && (
              <details className="relative group">
                <summary className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-fg rounded-full transition-all cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm">
                  {((session?.user as any)?.avatarUrl || (session?.user as any)?.image) ? (
                    <Image
                      src={(session?.user as any)?.avatarUrl || (session?.user as any)?.image}
                      alt="User avatar"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover border border-white/20 shadow-sm"
                      unoptimized={Boolean(((session?.user as any)?.avatarUrl || (session?.user as any)?.image)?.startsWith('http'))}
                    />
                  ) : (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-600/20 text-teal-700 dark:text-teal-400 font-semibold text-xs border border-teal-500/20">
                      {(session?.user as any)?.displayName?.[0] || session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                    </span>
                  )}
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </summary>
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-2xl shadow-black/10 p-2 z-50">
                  <Link href={'/profile' as any} className="block rounded-xl px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-white/60 dark:hover:bg-white/10 transition-colors backdrop-blur-sm">Profile</Link>
                  <div className="my-1 h-px bg-white/20" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left rounded-xl px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-white/60 dark:hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >Sign out</button>
                </div>
              </details>
            )}

            <Link
              href={'/mentoring' as any}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 rounded-full shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all backdrop-blur-sm"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span className="whitespace-nowrap">Book Session</span>
            </Link>

            <button
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center h-9 w-9 text-fg-muted hover:text-fg rounded-full transition-all hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </header>
  );
}
