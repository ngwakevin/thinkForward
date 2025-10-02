import ProductsGrid from '../../components/products/ProductsGrid';
import * as Icons from 'lucide-react';
import { products } from '../../data/products';

export const metadata = { title: 'Courses – Coming Soon Tracks' };

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-28 space-y-16">
      <header className="space-y-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Courses & Learning Tracks</h1>
        <div className="grid grid-cols-1 gap-4 max-w-4xl">
          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/10 p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent grid place-items-center">
                <Icons.Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-fg-muted">Overview</p>
                <p className="text-sm md:text-base leading-relaxed text-fg-muted">Explore all current and upcoming learning experiences.</p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-accent/20 transition" />
          </div>
        </div>
      </header>
      <ProductsGrid initialProducts={products} formatSelectorPosition="top" />
    </div>
  );
}
