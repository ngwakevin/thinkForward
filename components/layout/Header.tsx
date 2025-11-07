'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import AttachedLogo from '../brand/AttachedLogo';
import { useSession, signOut } from 'next-auth/react';

const aboutCards = [
  {
    href: '/about',
    title: 'Our story',
    description: 'Meet the mentors, mission, and operating principles guiding Cloudegree.',
  },
  {
    href: '/contact',
    title: 'Contact team',
    description: 'Partnerships, press, or support—get routed to the right inbox quickly.',
  },
  {
    href: '/careers',
    title: 'Careers',
    description: 'Join the distributed faculty shaping modern cloud apprenticeships.',
  },
] as const;

const communityCards = [
  {
    href: '/community',
    title: 'Community Hub',
    description: 'Ship together inside curated cohorts, async prompts, and AMAs.',
  },
  {
    href: '/community/profile',
    title: 'Profiles',
    description: 'Spotlight alumni journeys and connect with mentor partners.',
  },
  {
    href: '/community/events',
    title: 'Live sessions',
    description: 'Weekly build-alongs, office hours, and lightning talks with mentors.',
  },
] as const;

export function Header() {
  const { status, data: session } = useSession();
  const aboutMenuRef = React.useRef<HTMLDetailsElement | null>(null);
  const communityMenuRef = React.useRef<HTMLDetailsElement | null>(null);
  const closeAboutMenu = () => aboutMenuRef.current?.removeAttribute('open');
  const closeCommunityMenu = () => communityMenuRef.current?.removeAttribute('open');
  
  const nav = [
    { href: '/courses', label: 'Courses' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/docs', label: 'Resources' },
    { href: '/community', label: 'Community' },
    { href: '/bootcamps', label: 'Bootcamps', badge: 'LIVE' },
  ];

  return (
    <header className="sticky top-0 z-[120] bg-[#0a1628]/95 backdrop-blur-md border-b border-gray-800/50">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex h-[72px] items-center justify-between gap-4">
          
          {/* Logo Section - LEFT */}
          <Link 
            href={'/' as any} 
            aria-label="Cloudegree home" 
            className="flex-shrink-0 group transition-all hover:scale-[1.02]"
          >
            <div className="flex flex-col items-start gap-1">
              {/* Logo with green glow */}
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/30 via-green-500/30 to-teal-500/30 blur-2xl rounded-lg" />
                <AttachedLogo 
                  className="relative text-xl font-bold tracking-tight" 
                  text="Cloudegree" 
                  showDot={true} 
                />
              </div>
              {/* Badges - Liquid glass style */}
              <div className="flex items-center gap-1.5">
                <span className="relative inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider overflow-hidden">
                  {/* Liquid glass background */}
                  <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-gray-400/15 to-white/10" />
                  <span className="absolute inset-0 backdrop-blur-md backdrop-saturate-150" />
                  <span className="absolute inset-0 border border-white/20 rounded-full" />
                  {/* Content */}
                  <span className="relative h-1 w-1 rounded-full bg-yellow-400" />
                  <span className="relative text-yellow-400 drop-shadow-sm">CLOUD</span>
                </span>
                <span className="relative inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider overflow-hidden">
                  {/* Liquid glass background */}
                  <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-gray-400/15 to-white/10" />
                  <span className="absolute inset-0 backdrop-blur-md backdrop-saturate-150" />
                  <span className="absolute inset-0 border border-white/20 rounded-full" />
                  {/* Content */}
                  <span className="relative h-1 w-1 rounded-full bg-yellow-400" />
                  <span className="relative text-yellow-400 drop-shadow-sm">MENTORING</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Spacer to push navigation far right */}
          <div className="flex-1" />

          {/* Center: Liquid Glass Navigation */}
          <div className="hidden lg:flex items-center">
            <nav className="relative inline-flex items-center gap-2 px-5 py-3 rounded-full overflow-hidden">
              {/* Enhanced liquid glass background layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600/60 via-gray-500/50 to-gray-600/60" />
              <div className="absolute inset-0 backdrop-blur-[50px] backdrop-saturate-[1.8]" />
              {/* Multiple glass reflection layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/8 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10" />
              {/* Subtle color tint */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5" />
              {/* Enhanced shimmer animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_4s_ease-in-out_infinite]" />
              {/* Inner glow */}
              <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]" />
              {/* Border with shadow */}
              <div className="absolute inset-0 border border-gray-400/40 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)]" />
              
              {/* Navigation Links */}
              {nav.map(item => (
                <Link 
                  key={item.href}
                  href={item.href as any}
                  className="relative inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-green-500 hover:text-green-400 rounded-full transition-all hover:bg-white/10"
                >
                  {item.label}
                  {item.badge && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-green-500 px-2 py-0.5 text-[9px] font-bold uppercase text-white shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {/* About Dropdown */}
            <details ref={aboutMenuRef} className="relative group z-[130]">
              <summary className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-green-500 hover:text-green-400 rounded-lg transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                About
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </summary>
              <div className="absolute right-0 mt-3 w-[360px] rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.45)] z-[140] border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-900/60 backdrop-blur-2xl p-4 space-y-3">
                <div className="grid gap-3">
                  {aboutCards.map(card => (
                    <Link
                      key={card.href}
                      onClick={closeAboutMenu}
                      href={card.href as any}
                      className="group/card relative rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-400/60 hover:bg-white/10"
                    >
                      <p className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 group-hover/card:scale-125 transition" />
                        {card.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-200/80 leading-relaxed">{card.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </details>

            {/* Community Dropdown */}
            <details ref={communityMenuRef} className="relative group z-[130]">
              <summary className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-green-500 hover:text-green-400 rounded-lg transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                Community
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </summary>
              <div className="absolute right-0 mt-3 w-[360px] rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.45)] z-[140] border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-900/60 backdrop-blur-2xl p-4 space-y-3">
                <div className="grid gap-3">
                  {communityCards.map(card => (
                    <Link
                      key={card.href}
                      onClick={closeCommunityMenu}
                      href={card.href as any}
                      className="group/card relative rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-400/60 hover:bg-white/10"
                    >
                      <p className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 group-hover/card:scale-125 transition" />
                        {card.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-200/80 leading-relaxed">{card.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </details>

            {/* Login/Profile */}
            {(status === 'unauthenticated' || status === 'loading') && (
              <Link
                href={'/login' as any}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all bg-gray-700/50 hover:bg-gray-700 border border-gray-600"
              >
                {status === 'loading' ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </Link>
            )}

            {status === 'authenticated' && (
              <details className="relative group z-[130]">
                <summary className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden bg-gray-700/50 hover:bg-gray-700 border border-gray-600">
                  {((session?.user as any)?.avatarUrl || (session?.user as any)?.image) ? (
                    <Image
                      src={(session?.user as any)?.avatarUrl || (session?.user as any)?.image}
                      alt="User avatar"
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover border border-gray-500"
                      unoptimized={Boolean(((session?.user as any)?.avatarUrl || (session?.user as any)?.image)?.startsWith('http'))}
                    />
                  ) : (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white font-semibold text-xs">
                      {(session?.user as any)?.displayName?.[0] || session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                    </span>
                  )}
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </summary>
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl p-1.5 z-[140] bg-gray-800/95 backdrop-blur-xl border border-gray-700">
                  <Link href={'/profile' as any} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-gray-700/50 transition-colors">Profile</Link>
                  <div className="my-1 h-px bg-gray-700" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-gray-700/50 transition-colors"
                  >Sign out</button>
                </div>
              </details>
            )}

            {/* Book Mentorship Button */}
            <Link
              href={'/mentoring' as any}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-lg transition-all bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 hover:shadow-xl hover:scale-105"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Book Mentorship</span>
            </Link>

            {/* Theme Toggle */}
            <button
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center h-10 w-10 text-gray-400 hover:text-white rounded-lg transition-colors bg-gray-700/50 hover:bg-gray-700 border border-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
