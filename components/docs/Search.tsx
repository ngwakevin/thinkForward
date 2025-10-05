'use client';
import { useEffect, useState } from 'react';

interface DocIndexItem { slug: string; title: string; description?: string; category?: string; }
interface Props { docs: DocIndexItem[]; }

export function DocsSearch({ docs }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const results: DocIndexItem[] = q
    ? docs.filter(d => [d.title, d.description, d.category].some(v => v?.toLowerCase().includes(q))).slice(0, 20)
    : [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setOpen(true); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative">
      <button onClick={()=> setOpen(o=>!o)} className="w-full inline-flex items-center justify-between rounded-md border border-border/60 bg-bg-alt/40 px-3 py-2 text-xs text-fg-muted hover:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent">
        <span className="flex items-center gap-2"><span className="i-lucide-search text-fg-muted/70"/>Search resources</span>
        <kbd className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-bg-alt border border-border/50">/</kbd>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-border/60 bg-bg-alt/90 backdrop-blur p-3 shadow-xl space-y-3">
          <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Type to search..." className="w-full rounded-md border border-border/60 bg-bg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent" />
          <ul className="max-h-64 overflow-auto divide-y divide-border/40 text-[13px]">
            {results.length === 0 && q && <li className="py-3 text-fg-muted/70">No matches.</li>}
            {results.map(r => (
              <li key={r.slug} className="py-2 first:pt-0 last:pb-0">
                <a href={`/docs/${r.slug}`} className="block group" onClick={()=> setOpen(false)}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="group-hover:text-accent font-medium">{r.title}</span>
                    <span className="text-[10px] uppercase tracking-wide text-fg-muted/60">{r.category}</span>
                  </div>
                  {r.description && <p className="text-[11px] leading-relaxed text-fg-muted/80 line-clamp-2">{r.description}</p>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
