'use client';
import { Header } from '@/components/layout/Header';
import { HeaderModern } from '@/components/layout/Header.modern.preview';

export default function HeaderPreviewPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Header Design Comparison</h1>
          <p className="text-lg text-fg-muted">Compare the current header with the modern redesign</p>
        </div>

        {/* Current Header */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Current Header</h2>
            <p className="text-sm text-fg-muted">The existing header design with animated chips and detailed styling</p>
          </div>
          <div className="relative rounded-2xl border-2 border-border/60 overflow-visible shadow-xl bg-bg">
            <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-lg bg-bg/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold border border-border/60">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Current Design
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Header />
              {/* Demo content */}
              <div className="h-64 bg-gradient-to-br from-bg-alt/40 to-bg-alt/10 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-fg-muted">Page Content Area</p>
                  <p className="text-xs text-fg-muted/60">Scroll to see sticky header behavior</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Header */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Modern Redesign</h2>
            <p className="text-sm text-fg-muted">Cleaner, more professional with enhanced glassmorphism</p>
          </div>
          <div className="relative rounded-2xl border-2 border-accent/60 overflow-visible shadow-xl bg-bg">
            <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-lg bg-accent/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Modern Design
            </div>
            <div className="overflow-hidden rounded-2xl">
              <HeaderModern />
              {/* Demo content */}
              <div className="h-64 bg-gradient-to-br from-bg-alt/40 to-bg-alt/10 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-fg-muted">Page Content Area</p>
                  <p className="text-xs text-fg-muted/60">Scroll to see sticky header behavior</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Differences */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Key Improvements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/20 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent grid place-items-center">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3 className="font-semibold">Simplified Branding</h3>
              </div>
              <ul className="space-y-2 text-sm text-fg-muted">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Removed complex animated chips</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Clean single-line tagline</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Hover effect on entire logo area</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/20 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent grid place-items-center">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <h3 className="font-semibold">Enhanced Glassmorphism</h3>
              </div>
              <ul className="space-y-2 text-sm text-fg-muted">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Stronger backdrop blur effect</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Subtle bottom border for depth</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Better transparency balance</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/20 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent grid place-items-center">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3zM9 3v18"/>
                  </svg>
                </div>
                <h3 className="font-semibold">Cleaner Navigation</h3>
              </div>
              <ul className="space-y-2 text-sm text-fg-muted">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Removed underline animations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Simple rounded hover states</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Centered for better balance</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/20 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent grid place-items-center">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <path d="M9 3v18"/>
                  </svg>
                </div>
                <h3 className="font-semibold">Refined CTA Button</h3>
              </div>
              <ul className="space-y-2 text-sm text-fg-muted">
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Simplified to &ldquo;Book Session&rdquo;</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Removed complex animations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span>Subtle scale feedback</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Action buttons */}
        <section className="flex items-center justify-center gap-4 py-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-fg-muted hover:text-fg hover:bg-bg-alt transition"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Home
          </a>
          <button
            onClick={() => {
              if (confirm('Apply the modern header design to your site?')) {
                alert('Contact your developer to apply the HeaderModern component to replace Header in layout.tsx');
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Apply Modern Design
          </button>
        </section>
      </div>
    </div>
  );
}
