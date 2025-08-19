import ProductsGrid from '../../components/products/ProductsGrid';
import { products } from '../../data/products';

export const metadata = { title: 'Coming Soon Tracks' };

export default function PlatformPage() {
  const comingSoon = products.filter(p => p.enrollmentStatus === 'coming-soon');
  return (
    <div className="mx-auto max-w-7xl px-6 py-28 space-y-16">
      <header className="max-w-3xl space-y-5">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Coming Soon Tracks</h1>
        <p className="text-fg-muted text-sm md:text-base leading-relaxed">Preview upcoming learning experiences. These tracks are in pipeline—register interest or review outlines while we finalize content and release sequencing.</p>
      </header>
      <ProductsGrid initialProducts={comingSoon} />
    </div>
  );
}
