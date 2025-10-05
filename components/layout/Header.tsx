'use client';
import Link from 'next/link';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { events } from '../../data/events'; // added for bootcamp highlighting logic
import AttachedLogo from '../brand/AttachedLogo';
import React from 'react';

// Inline icons (avoid reliance on external icon font in production)
const IconMenu: React.FC<{className?: string}> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" x2="21" y1="6" y2="6" />
    <line x1="3" x2="21" y1="12" y2="12" />
    <line x1="3" x2="21" y1="18" y2="18" />
  </svg>
);
const IconClose: React.FC<{className?: string}> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.documentElement.classList.add('overflow-hidden');
    } else {
      document.documentElement.classList.remove('overflow-hidden');
    }
    return () => document.documentElement.classList.remove('overflow-hidden');
  }, [mobileOpen]);

  useEffect(() => { if (mobileOpen) { const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); } }, [mobileOpen]);
  useEffect(() => { // close on route change
    setMobileOpen(false);
  }, [pathname]);

  // Determine bootcamp urgency state (dynamic label + style)
  const bootcampMeta = useMemo(() => {
    const upcoming = events
      .filter(e => e.type === 'bootcamp' && new Date(e.startDate).getTime() > Date.now())
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    if (!upcoming.length) return null;
    const next = upcoming[0];
    const capacity = next.capacity || 0;
    const registered = next.registered || 0;
    const fill = capacity ? registered / capacity : 0;
    const ms = new Date(next.startDate).getTime() - Date.now();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    let label = 'New';
    if (fill >= 1) label = 'Waitlist';
    else if (fill >= 0.85) label = 'Last Seats';
    else if (days <= 7) label = 'Starting Soon';
    else if (days <= 14) label = 'Cohort Soon';
    return { label, fill, days, capacity, registered };
  }, []);

  const nav = [
  { href: '/courses', label: 'Courses' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/docs', label: 'Resources' },
    { href: '/bootcamps', label: 'Live Bootcamps', highlight: true },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b border-border/60 bg-bg/90 backdrop-blur transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-6">
  <Link href="/" aria-label="CloudAcers home" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-md inline-flex items-center">
          {/* Desktop: AttachedLogo in CloudAcers style */}
          <span className="hidden md:inline-flex items-center">
            <AttachedLogo className="text-2xl" text="CloudAcers" />
          </span>
          {/* Mobile: smaller AttachedLogo */}
          <span className="md:hidden inline-flex items-center gap-2">
            <AttachedLogo className="text-xl" text="CloudAcers" />
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm flex-1" aria-label="Primary">
          {nav.map(item => {
            const active = pathname.startsWith(item.href);
            if (!item.highlight) {
              return (
                <Link key={item.href} href={item.href as any} className={`relative font-medium transition ${active ? 'text-fg' : 'text-fg-muted hover:text-fg'}`}>
                  {item.label}
                  {active && <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-accent to-accent-alt" />}
                </Link>
              );
            }
            // Highlighted Live Bootcamps nav item (combines effects 1-5)
            return (
              <Link
                key={item.href}
                href={item.href as any}
                className={`group relative inline-flex items-center gap-2 font-semibold transition rounded-full px-4 py-2 ring-1 ${active ? 'ring-accent/60 bg-accent/10' : 'ring-border/70 hover:ring-accent/50 hover:bg-accent/5'} overflow-hidden`}
                aria-label={item.label}
              >
                {/* Pulse dot */}
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                {/* Gradient text */}
                <span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">{item.label}</span>
                {/* Dynamic badge */}
                {bootcampMeta && (
                  <span
                    className={`text-[10px] font-bold tracking-wide uppercase rounded-full px-2 py-0.5 ring-1 ${
                      bootcampMeta.label === 'Last Seats'
                        ? 'bg-warning/15 text-warning ring-warning/40'
                        : bootcampMeta.label === 'Waitlist'
                        ? 'bg-fg-muted/15 text-fg-muted ring-fg-muted/30'
                        : bootcampMeta.label === 'Starting Soon'
                        ? 'bg-accent-alt/15 text-accent-alt ring-accent-alt/40'
                        : 'bg-accent/15 text-accent ring-accent/30'
                    }`}
                  >
                    {bootcampMeta.label}
                  </span>
                )}
                {/* Capacity bar (thin) */}
                {bootcampMeta && bootcampMeta.capacity > 0 && (
                  <span className="absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full bg-border/50 overflow-hidden">
                    <span
                      className={`h-full block transition-all duration-700 ${
                        bootcampMeta.fill >= 1
                          ? 'bg-fg-muted'
                          : bootcampMeta.fill >= 0.85
                          ? 'bg-warning'
                          : 'bg-accent'
                      }`}
                      style={{ width: `${Math.min(bootcampMeta.fill * 100, 100)}%` }}
                    />
                  </span>
                )}
                {active && <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-accent/40" />}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-5">
          <Link
            href={'/contact' as any}
            className="group relative inline-flex items-center gap-2 rounded-full border border-accent/40 px-6 py-2 text-sm font-semibold text-accent transition-colors hover:border-accent/60 hover:bg-accent/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label="Contact CloudAcers team"
          >
            <span className="i-lucide-message-circle text-accent group-hover:text-accent" />
            Let’s Chat
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-accent/30 motion-reduce:hidden"
              style={{ animation: 'pulse 5s ease-in-out infinite' }}
            />
            <span className="pointer-events-none absolute -inset-1 rounded-full bg-accent/10 opacity-0 blur-lg transition-opacity group-hover:opacity-70 motion-reduce:hidden" aria-hidden />
          </Link>
          <Link
            href={'/mentoring' as any}
            className="group relative inline-flex items-center gap-2 rounded-full border border-accent-alt/40 px-6 py-2 text-sm font-semibold text-accent-alt transition-colors hover:border-accent-alt/60 hover:bg-accent-alt/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-alt/40"
            aria-label="Book 1-on-1 mentoring"
          >
            <span className="i-lucide-user-round text-accent-alt group-hover:text-accent-alt" />
            Book 1‑on‑1 Mentoring
            <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-accent-alt/30" />
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 md:hidden ml-auto">
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border/70 bg-bg-alt/70 backdrop-blur-sm hover:bg-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
          >
            {mobileOpen ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
          </button>
          <ThemeToggle />
        </div>
      </div>
      {mobileOpen && (
        <>
          {/* Overlay captures outside clicks */}
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            className="md:hidden absolute left-0 right-0 top-full z-50 mx-4 mt-2 rounded-2xl border border-border bg-bg-alt shadow-xl ring-1 ring-black/30 p-4 space-y-3 animate-scale-in origin-top"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs font-semibold tracking-wide uppercase text-fg-muted">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 hover:bg-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                aria-label="Close navigation menu"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 text-sm" aria-label="Mobile primary">
              {nav.map(item => (
                <Link
                  key={item.href}
                  href={item.href as any}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-2 py-2 transition-colors ${pathname.startsWith(item.href) ? 'bg-accent/10 text-fg' : 'hover:bg-bg'} ${item.highlight ? 'font-semibold' : ''}`}
                >
                  {item.highlight && <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />}
                  <span>{item.label}</span>
                  {item.highlight && bootcampMeta && (
                    <span className="ml-2 text-[10px] rounded-full bg-accent/15 px-2 py-0.5 font-bold uppercase tracking-wide text-accent">{bootcampMeta.label}</span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="pt-1 flex flex-col gap-2">
              <Link
                href={'/contact' as any}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/40 px-4 py-2 text-sm font-medium text-accent hover:border-accent/60 hover:bg-accent/5"
              >
                <span className="i-lucide-message-circle text-accent" />
                <span>Let’s Chat</span>
              </Link>
              <Link
                href={'/mentoring' as any}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-accent-alt/40 px-4 py-2 text-sm font-medium text-accent-alt hover:border-accent-alt/60 hover:bg-accent-alt/5"
              >
                <span className="i-lucide-user-round text-accent-alt" />
                <span>Book 1‑on‑1 Mentoring</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
