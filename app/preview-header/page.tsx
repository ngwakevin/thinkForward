'use client';
import { Header } from '@/components/layout/Header';
import { HeaderLiquidGlass } from '@/components/layout/Header.liquidglass.preview';

export default function HeaderPreviewPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Header Design Comparison</h1>
          <p className="text-lg text-fg-muted">Compare current header with liquid glass redesign</p>
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

        {/* Liquid Glass Header */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Complete Liquid Glass Redesign 
              <span className="text-2xl">💚✨</span>
            </h2>
            <p className="text-sm text-fg-muted">Ultra-premium complete liquid glass effect with vibrant green theme and flowing shimmer</p>
          </div>
          <div className="relative rounded-2xl border-2 border-emerald-500/60 overflow-visible shadow-2xl bg-bg">
            <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Complete Liquid Glass 💚✨
            </div>
            <div className="overflow-hidden rounded-2xl">
              <HeaderLiquidGlass />
              <div className="h-64 bg-gradient-to-br from-emerald-50/60 via-green-50/40 to-teal-50/60 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-teal-950/30 flex items-center justify-center">
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
