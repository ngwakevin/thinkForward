import { products } from '../../data/products';
import ProductsGrid from '../../components/products/ProductsGrid';

export const metadata = { title: 'Products' };

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-28 space-y-28">
      {/* Our Training Options (moved to top) */}
      <section className="relative">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center space-y-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Our Training Options</h2>
            <p className="text-fg-muted max-w-2xl mx-auto text-sm md:text-base leading-relaxed">Choose the learning format that best fits your momentum, accountability style, and starting point. You can always layer both for compounding mastery.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="group relative rounded-3xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/10 p-8 flex flex-col shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-accent/15 text-accent i-lucide-rocket" />
                <h3 className="font-semibold tracking-tight text-xl flex items-center gap-2">Live Bootcamps <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/40"><span className="relative inline-flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/40" /><span className="relative inline-flex h-2 w-2 rounded-full bg-warning" /></span>Available Now</span></h3>
              </div>
              <p className="text-sm text-fg-muted leading-relaxed flex-1">Structured, instructor-led cohorts with accountability rhythms, real cloud scenarios, and momentum reinforcement. Ideal when you want acceleration, feedback, and execution pressure.</p>
              <ul className="mt-6 space-y-2 text-xs text-fg-muted">
                <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-1 rounded-full bg-accent" /> Weekly live sessions & project sprints</li>
                <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-1 rounded-full bg-accent" /> Small cohorts + instructor feedback</li>
                <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-1 rounded-full bg-accent" /> Portfolio & scenario based outcomes</li>
                <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-1 rounded-full bg-accent" /> Accountability & momentum system</li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="/bootcamps" className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-xs font-semibold tracking-wide text-white shadow hover:bg-accent-alt transition">Explore Bootcamps →</a>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
            </div>
            <div className="group relative rounded-3xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/10 p-8 flex flex-col shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-accent-alt/15 text-accent-alt i-lucide-graduation-cap" />
                <h3 className="font-semibold tracking-tight text-xl flex items-center gap-2">Self-Paced Learning <span className="inline-flex items-center gap-1 rounded-full bg-fg-muted/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-fg-muted ring-1 ring-border/40">Coming Soon</span></h3>
              </div>
              <p className="text-sm text-fg-muted leading-relaxed flex-1">Learn flexibly with structured modules, integrated practice, and progressive depth expansions. Build momentum at your own cadence or layer alongside a cohort.</p>
              <ul className="mt-6 space-y-2 text-xs text-fg-muted">
                <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-1 rounded-full bg-accent-alt" /> Modular learning slices</li>
                <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-1 rounded-full bg-accent-alt" /> Practice-driven retention loops</li>
                <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-1 rounded-full bg-accent-alt" /> Incremental difficulty escalation</li>
                <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-1 rounded-full bg-accent-alt" /> Layerable with live experiences</li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="/contact" className="inline-flex items-center rounded-md border border-border/70 px-5 py-2.5 text-xs font-semibold tracking-wide hover:border-accent-alt hover:text-accent-alt transition">Get Notified</a>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-accent-alt/0 group-hover:ring-2 group-hover:ring-accent-alt/30 transition" />
            </div>
          </div>
        </div>
      </section>
      {/* Products Section */}
      <div className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">Products</h1>
        <p className="mt-4 text-fg-muted text-sm md:text-base">Focused learning paths and tooling accelerating your journey from fundamentals to expert execution.</p>
      </div>
      <ProductsGrid initialProducts={products} />
    </div>
  );
}
