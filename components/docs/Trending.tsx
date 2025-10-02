'use client';
import { useEffect, useState } from 'react';
interface Doc { slug: string; title: string; }
interface Props { docs: Doc[] }

// naive localStorage view counter; increments when doc page loads (will need integration there too)
export default function TrendingDocs({ docs }: Props) {
  const [top, setTop] = useState<Doc[]>([]);
  useEffect(() => {
    const counts: Record<string, number> = JSON.parse(localStorage.getItem('docViews') || '{}');
    const ranked = [...docs].sort((a,b)=> (counts[b.slug]||0) - (counts[a.slug]||0)).slice(0,5).filter(d => (counts[d.slug]||0) > 0);
    setTop(ranked);
  }, [docs]);
  if (top.length === 0) return null;
  return (
    <section className="space-y-4 mt-20" aria-label="Trending docs">
      <h2 className="font-display text-lg font-semibold tracking-tight">Trending</h2>
      <ol className="space-y-3 text-sm list-decimal pl-5">
        {top.map(t => (
          <li key={t.slug} className="marker:text-accent">
            <a href={`/docs/${t.slug}`} className="hover:text-accent font-medium">{t.title}</a>
          </li>
        ))}
      </ol>
    </section>
  );
}
