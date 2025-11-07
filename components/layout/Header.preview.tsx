'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import AttachedLogo from '../brand/AttachedLogo';
import { useSession, signOut } from 'next-auth/react';

const nav = [
  { href: '/courses', label: 'Courses' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/docs', label: 'Resources' },
  { href: '/community', label: 'Community' },
  { href: '/bootcamps', label: 'Bootcamps', badge: 'Live' },
];

export function HeaderPreview() {
  const { status, data: session } = useSession();
  const aboutMenuRef = React.useRef<HTMLDetailsElement | null>(null);
  const closeAboutMenu = () => aboutMenuRef.current?.removeAttribute('open');

  return (
    <header
      className="relative z-[120] isolate overflow-visible text-[#243623]"
      style={{
        background: 'linear-gradient(140deg, #d9e3d5 0%, #cfe0d2 45%, #bed4c6 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.55),rgba(255,255,255,0)),radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.35),rgba(255,255,255,0))]" />
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link
          href={'/' as any}
          aria-label="Cloudegree home"
          className="inline-flex items-center gap-3 text-[#1b2a18] transition hover:opacity-90"
        >
          <AttachedLogo className="text-2xl font-semibold tracking-tight text-[#1b2a18]" text="Cloudegree" showDot />
        </Link>

        <nav
          className="hidden flex-1 justify-center lg:flex"
          aria-label="Main navigation"
        >
          <div className="inline-flex items-center gap-4 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#345034]">
            {nav.map((item) =>
              item.label === 'Community' ? (
                <div key={item.href} className="group relative inline-flex items-center gap-1 z-[130]">
                  <Link
                    href={item.href as any}
                    className="inline-flex items-center gap-1 transition hover:text-[#1b2a18]"
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3 w-3 transition group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 8l4 4 4-4" />
                    </svg>
                  </Link>
                  <div className="pointer-events-none absolute left-1/2 top-[calc(100%+12px)] z-[140] hidden w-44 -translate-x-1/2 rounded-xl border border-[#c7d6c2] bg-white/95 px-2 py-2 text-[13px] font-medium text-[#2e452d] shadow-lg backdrop-blur-sm group-hover:pointer-events-auto group-hover:block">
                    {[
                      { href: '/community', label: 'Community' },
                      { href: '/mentoring', label: 'Mentors' },
                      { href: '/events', label: 'Events' },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href as any}
                        className="block rounded-lg px-3 py-2 transition hover:bg-[#dde9d7] hover:text-[#1b2a18]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className="relative inline-flex items-center gap-1 transition hover:text-[#1b2a18]"
                >
                  {item.label}
                  {item.badge && (
                    <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#1b2a18]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            )}
            <details ref={aboutMenuRef} className="relative inline-flex cursor-pointer select-none items-center gap-1 transition hover:text-[#1b2a18] z-[130]">
              <summary className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.28em] [&::-webkit-details-marker]:hidden">
                About
                <svg viewBox="0 0 20 20" className="h-3 w-3 transition group-open:rotate-180" fill="currentColor">
                  <path d="M5.25 7.25 10 12l4.75-4.75" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </summary>
              <div className="absolute right-0 top-[calc(100%+8px)] w-40 rounded-xl border border-[#c7d6c2] bg-white shadow-lg z-[140]">
                {[
                  { href: '/about', label: 'About us' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/careers', label: 'Careers' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    onClick={closeAboutMenu}
                    href={link.href as any}
                    className="block px-3 py-2 text-sm font-medium text-[#345034] transition hover:bg-[#dde9d7]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {(status === 'unauthenticated' || status === 'loading') && (
            <Link
              href={'/login' as any}
              className="inline-flex items-center gap-2 rounded-full bg-[#233816] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#f5f7f2] transition hover:scale-[1.02]"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              {status === 'loading' ? 'Loading...' : 'Sign In'}
            </Link>
          )}

          {status === 'authenticated' && (
            <details className="relative z-[130]">
              <summary className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#1b2a18] transition hover:bg-white/95 [&::-webkit-details-marker]:hidden">
                {((session?.user as any)?.avatarUrl || (session?.user as any)?.image) ? (
                  <Image
                    src={(session?.user as any)?.avatarUrl || (session?.user as any)?.image}
                    alt="User avatar"
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full object-cover"
                    unoptimized={Boolean(((session?.user as any)?.avatarUrl || (session?.user as any)?.image)?.startsWith('http'))}
                  />
                ) : (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#233816] text-xs font-semibold text-[#f5f7f2]">
                    {(session?.user as any)?.displayName?.[0] || session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                  </span>
                )}
                Menu
              </summary>
              <div className="absolute right-0 top-[calc(100%+8px)] w-44 rounded-xl border border-[#c7d6c2] bg-white shadow-lg z-[140]">
                <Link
                  href={'/profile' as any}
                  className="block px-3 py-2 text-sm font-medium text-[#345034] transition hover:bg-[#dde9d7]"
                >
                  Profile
                </Link>
                <div className="h-px bg-[#d9e4d3]" />
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-[#345034] transition hover:bg-[#dde9d7]"
                >
                  Sign out
                </button>
              </div>
            </details>
          )}
        </div>
      </div>

      <nav
        className="block border-t border-[#c7d6c2]/70 bg-white/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#345034] backdrop-blur-sm lg:hidden"
        aria-label="Main navigation mobile"
      >
        <div className="flex items-center gap-3 overflow-x-auto">
          {nav.map((item) =>
            item.label === 'Community' ? (
              <React.Fragment key={item.href}>
                <Link href={item.href as any} className="flex-shrink-0">
                  Community
                </Link>
                <Link href={'/mentoring' as any} className="flex-shrink-0">
                  Mentors
                </Link>
                <Link href={'/events' as any} className="flex-shrink-0">
                  Events
                </Link>
              </React.Fragment>
            ) : (
              <Link
                key={item.href}
                href={item.href as any}
                className="flex-shrink-0"
              >
                {item.label}
              </Link>
            )
          )}
          <Link href={'/mentoring' as any} className="ml-auto flex-shrink-0">
            Book Session
          </Link>
        </div>
      </nav>
    </header>
  );
}
