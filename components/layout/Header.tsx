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
    <header className="sticky top-0 z-50">
      {/* Transparent background - no full liquid glass */}
      <div className="relative bg-transparent">
        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex h-20 items-center justify-between gap-6">
            
            {/* Liquid Glass Bar - Centered portion only */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-16 rounded-full overflow-hidden pointer-events-none">
              {/* Frosted glass effect */}
              <div className="absolute inset-0 bg-white/60 dark:bg-bg/70" />
              <div className="absolute inset-0 backdrop-blur-[60px] backdrop-saturate-[2]" />
              {/* Liquid color tint */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 via-teal-50/20 to-green-100/30 dark:from-emerald-950/25 dark:via-teal-950/15 dark:to-green-950/25" />
              {/* Flowing shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]" />
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent" />
              {/* Subtle borders */}
              <div className="absolute inset-0 border border-emerald-300/20 dark:border-emerald-500/20 rounded-full" />
            </div>

            {/* Brand with refined glass badges */}
            <Link 
              href={'/' as any} 
              aria-label="Cloudegree home" 
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 rounded-xl inline-flex items-center py-2 transition-all hover:scale-[1.01]"
            >
              <span className="hidden md:flex flex-col items-start gap-1.5">
                <AttachedLogo className="text-xl font-bold tracking-tight" text="Cloudegree" />
                <div className="flex items-center gap-1.5">
                  {/* Liquid glass pill badges with green theme */}
                                    <span className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider overflow-hidden">
                    {/* Liquid glass background - Orange glow */}
                    <span className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-400/15 to-amber-400/10 backdrop-blur-xl" />
                    <span className="absolute inset-0 border border-orange-400/20" style={{ borderRadius: 'inherit' }} />
                    {/* Flowing shimmer effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out delay-100" />
                    {/* Glow effect */}
                    <span className="absolute inset-0 shadow-[inset_0_0_12px_rgba(251,146,60,0.15)]" style={{ borderRadius: 'inherit' }} />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)] animate-pulse" />
                    <span className="relative text-orange-700 dark:text-orange-300 drop-shadow-sm">Cloud</span>
                  </span>
                  
                  <span className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider overflow-hidden">
                    {/* Liquid glass background - Orange glow */}
                    <span className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-400/15 to-amber-400/10 backdrop-blur-xl" />
                    <span className="absolute inset-0 border border-orange-400/20" style={{ borderRadius: 'inherit' }} />
                    {/* Flowing shimmer effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out delay-100" />
                    {/* Glow effect */}
                    <span className="absolute inset-0 shadow-[inset_0_0_12px_rgba(251,146,60,0.15)]" style={{ borderRadius: 'inherit' }} />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)] animate-pulse" />
                    <span className="relative text-orange-700 dark:text-orange-300 drop-shadow-sm">Mentoring</span>
                  </span>
                </div>
              </span>
              <span className="md:hidden inline-flex items-center">
                <AttachedLogo className="text-lg font-bold tracking-tight" text="Cloudegree" />
              </span>
            </Link>

            {/* Center Navigation with bright green text and liquid glass hover */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center" aria-label="Main navigation">
              {nav.map(item => (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className="relative px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 rounded-lg transition-all inline-flex items-center gap-2 group overflow-hidden tracking-tight drop-shadow-sm"
                >
                  {/* Enhanced liquid glass hover effect */}
                  <span className="absolute inset-0 bg-white/0 dark:bg-white/0 group-hover:bg-white/70 dark:group-hover:bg-white/15 backdrop-blur-2xl transition-all duration-700 rounded-lg" />
                  <span className="absolute inset-0 bg-gradient-to-br from-emerald-200/0 via-green-200/0 to-teal-200/0 group-hover:from-emerald-200/20 group-hover:via-green-200/30 group-hover:to-teal-200/20 transition-all duration-700" />
                  <span className="absolute inset-0 border border-transparent group-hover:border-emerald-300/40 dark:group-hover:border-emerald-500/40 rounded-lg transition-all duration-500" />
                  {/* Flowing liquid shimmer on hover */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-emerald-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-out rounded-lg" />
                  {/* Enhanced inner glow */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[inset_0_0_24px_rgba(16,185,129,0.12)] dark:shadow-[inset_0_0_24px_rgba(16,185,129,0.2)] rounded-lg transition-opacity duration-700" />
                  <span className="relative font-semibold drop-shadow-sm">{item.label}</span>
                  {item.badge && (
                    <span className={`relative text-[9px] font-bold rounded-full px-1.5 py-0.5 text-white leading-none uppercase tracking-wide shadow-lg ${
                      item.badge === 'Cloud' 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-orange-500/40' 
                        : 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-emerald-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions with glass morphism */}
            <div className="flex items-center gap-2">
              <details ref={aboutMenuRef} className="relative group">
                <summary className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 rounded-lg transition-all cursor-pointer list-none [&::-webkit-details-marker]:hidden relative overflow-hidden tracking-tight drop-shadow-sm">
                  <span className="absolute inset-0 bg-white/0 dark:bg-white/0 group-hover:bg-white/70 dark:group-hover:bg-white/15 backdrop-blur-2xl transition-all duration-700 rounded-lg" />
                  <span className="absolute inset-0 bg-gradient-to-br from-emerald-200/0 via-green-200/0 to-teal-200/0 group-hover:from-emerald-200/20 group-hover:via-green-200/30 group-hover:to-teal-200/20 transition-all duration-700" />
                  <span className="absolute inset-0 border border-transparent group-hover:border-emerald-400/40 rounded-lg transition-all duration-500" />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[inset_0_0_24px_rgba(16,185,129,0.12)] rounded-lg transition-opacity duration-700" />
                  <span className="relative font-semibold drop-shadow-sm">About</span>
                  <svg viewBox="0 0 20 20" className="relative h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </summary>
                <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-2xl p-1.5 z-50 overflow-hidden">
                  {/* Enhanced ultra liquid glass dropdown background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-green-400/10 to-teal-500/15" />
                  <div className="absolute inset-0 backdrop-blur-[48px] backdrop-saturate-150 bg-bg/40" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent" />
                  <div className="absolute inset-0 border border-emerald-400/30 rounded-xl shadow-[0_8px_32px_rgba(16,185,129,0.2)]" />
                  <div className="relative">
                    <Link onClick={closeAboutMenu} href={'/about' as any} className="block rounded-lg px-3 py-2 text-sm text-fg-muted hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors relative">About us</Link>
                    <Link onClick={closeAboutMenu} href={'/contact' as any} className="block rounded-lg px-3 py-2 text-sm text-fg-muted hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors relative">Contact</Link>
                    <Link onClick={closeAboutMenu} href={'/careers' as any} className="block rounded-lg px-3 py-2 text-sm text-fg-muted hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors relative">Careers</Link>
                  </div>
                </div>
              </details>

              {(status === 'unauthenticated' || status === 'loading') && (
                <Link
                  href={'/login' as any}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-fg rounded-lg transition-all relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-green-400/0 to-emerald-400/0 group-hover:from-emerald-400/10 group-hover:via-green-400/15 group-hover:to-teal-400/10 backdrop-blur-xl transition-all duration-500 rounded-lg" />
                  <span className="absolute inset-0 border border-emerald-400/20 group-hover:border-emerald-400/40 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]" />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[inset_0_0_12px_rgba(16,185,129,0.1)] rounded-lg transition-opacity duration-500" />
                  {status === 'loading' ? (
                    <>
                      <span className="relative inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="relative whitespace-nowrap">Loading...</span>
                    </>
                  ) : (
                    <span className="relative whitespace-nowrap">Log In</span>
                  )}
                </Link>
              )}

              {status === 'authenticated' && (
                <details className="relative group">
                  <summary className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-fg rounded-lg transition-all cursor-pointer list-none [&::-webkit-details-marker]:hidden relative overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-green-400/0 to-emerald-400/0 group-hover:from-emerald-400/10 group-hover:via-green-400/15 group-hover:to-teal-400/10 backdrop-blur-xl transition-all duration-500 rounded-lg" />
                    <span className="absolute inset-0 border border-transparent group-hover:border-emerald-400/20 rounded-lg transition-all duration-300" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[inset_0_0_12px_rgba(16,185,129,0.1)] rounded-lg transition-opacity duration-500" />
                    {((session?.user as any)?.avatarUrl || (session?.user as any)?.image) ? (
                      <Image
                        src={(session?.user as any)?.avatarUrl || (session?.user as any)?.image}
                        alt="User avatar"
                        width={24}
                        height={24}
                        className="relative h-6 w-6 rounded-full object-cover border-2 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        unoptimized={Boolean(((session?.user as any)?.avatarUrl || (session?.user as any)?.image)?.startsWith('http'))}
                      />
                    ) : (
                      <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 via-green-400/25 to-teal-400/20 text-emerald-600 dark:text-emerald-300 font-semibold text-xs border border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                        {(session?.user as any)?.displayName?.[0] || session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                      </span>
                    )}
                    <svg viewBox="0 0 20 20" className="relative h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </summary>
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl p-1.5 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-400/5 to-teal-500/10" />
                    <div className="absolute inset-0 backdrop-blur-3xl bg-bg/30" />
                    <div className="absolute inset-0 border border-emerald-400/20 rounded-xl shadow-[0_8px_32px_rgba(16,185,129,0.15)]" />
                    <div className="relative">
                      <Link href={'/profile' as any} className="block rounded-lg px-3 py-2 text-sm text-fg-muted hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors">Profile</Link>
                      <div className="my-1 h-px bg-emerald-400/20" />
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left rounded-lg px-3 py-2 text-sm text-fg-muted hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                      >Sign out</button>
                    </div>
                  </div>
                </details>
              )}

              {/* Liquid Glass CTA Button - Complete Green Theme */}
              <Link
                href={'/mentoring' as any}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-lg transition-all relative overflow-hidden group"
              >
                {/* Vibrant green liquid glass button */}
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
                <span className="absolute inset-0 bg-gradient-to-br from-emerald-300/0 via-green-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {/* Flowing liquid shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                {/* Inner glow */}
                <span className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.1)]" />
                {/* Outer glow */}
                <span className="absolute -inset-1 bg-gradient-to-r from-emerald-500/40 via-green-500/40 to-teal-500/40 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <svg className="relative h-4 w-4 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span className="relative whitespace-nowrap text-white drop-shadow-md font-semibold">Book Mentorship</span>
              </Link>

              {/* Liquid Glass Theme Toggle */}
              <button
                aria-label="Toggle theme"
                className="inline-flex items-center justify-center h-9 w-9 text-fg-muted hover:text-fg rounded-lg transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-green-400/0 to-emerald-400/0 group-hover:from-emerald-400/10 group-hover:via-green-400/15 group-hover:to-teal-400/10 backdrop-blur-xl transition-all duration-500 rounded-lg" />
                <span className="absolute inset-0 border border-transparent group-hover:border-emerald-400/20 rounded-lg transition-all duration-300" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[inset_0_0_12px_rgba(16,185,129,0.1)] rounded-lg transition-opacity duration-500" />
                <svg viewBox="0 0 24 24" className="relative h-4 w-4 transition-transform group-hover:rotate-12 duration-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
                {/* Subtle sparkle on hover */}
                <span className="absolute top-2 right-2 h-1 w-1 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
