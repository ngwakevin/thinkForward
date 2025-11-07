'use client';
import { Header } from '@/components/layout/Header';
import { HeaderPreview } from '@/components/layout/Header.preview';

export default function HeaderPreviewPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Header Design Comparison</h1>
          <p className="text-lg text-fg-muted">Contrast the production header with the hero-aligned gradient preview.</p>
        </div>

        {/* Current Header */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Current Header</h2>
            <p className="text-sm text-fg-muted">The existing header design</p>
          </div>
          <div className="relative rounded-2xl border-2 border-border/60 overflow-visible shadow-xl bg-bg">
            <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-lg bg-bg/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold border border-border/60">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Current Design
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Header />
              <div className="h-64 bg-gradient-to-br from-bg-alt/40 to-bg-alt/10 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-fg-muted">Page Content Area</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero gradient preview */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Hero Gradient Header Preview
              <span className="text-2xl">✨</span>
            </h2>
            <p className="text-sm text-fg-muted">
              Same header structure restyled to sit on the hero&apos;s green gradient while keeping the refreshed nav and CTA layout.
            </p>
          </div>
          <div className="relative rounded-2xl border-2 border-[#bcd2b2] overflow-visible shadow-2xl bg-bg">
            <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-lg bg-[#d9e3d5] px-3 py-1.5 text-xs font-semibold text-[#2f4522] shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#f1b81b] animate-pulse" />
              Hero gradient preview
            </div>
            <div className="overflow-hidden rounded-2xl">
              <HeaderPreview />
              <div className="h-64 bg-gradient-to-br from-[#f3f7ef] via-[#e3eed8] to-[#cfe0c5] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-fg-muted">Page Content Area</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
