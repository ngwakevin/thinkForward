import type { Metadata } from 'next';
import { loadDocs, CATEGORY_ORDER, CATEGORY_INTROS } from '../../lib/docs';
import { DocsSearch } from '../../components/docs/Search';
import DocsSidebar from '../../components/docs/Sidebar';
import DocsFilters from '../../components/docs/Filters';
import TrendingDocs from '../../components/docs/Trending';
import CategorySection from '../../components/docs/CategorySection';

const CATEGORY_ICONS: Record<string,string> = {
  'Getting Started':'🚀',
  'Concepts':'🧠',
  'Guides':'🛠️',
  'Playbooks':'📘',
  'FAQ':'❓',
  'Other':'📎'
};

export const metadata: Metadata = { title: 'Resources' };

function difficultyBadge(diff?: string) {
  if (!diff) return null;
  const map: Record<string, string> = {
    foundation: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    intermediate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    advanced: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide ${map[diff] || 'bg-fg-muted/10 text-fg-muted border-border/60'}`}>{diff}</span>;
}

function formatUpdated(updated?: string) {
  if (!updated) return null;
  try {
    const dt = new Date(updated);
    const days = (Date.now() - dt.getTime()) / 86400000;
    const label = days <= 21 ? 'NEW' : undefined; // only highlight NEW <21d
    const dateStr = dt.toISOString().split('T')[0];
    return <span className="inline-flex items-center gap-1 text-[10px] text-fg-muted/60" title={`Updated ${dateStr}`}>{label && <span className="text-accent font-medium">{label}</span>}<span>{dateStr}</span></span>;
  } catch { return null; }
}

export default function DocsIndex() {
  const docs = loadDocs();
  const grouped = docs.reduce<Record<string, typeof docs>>( (acc, d) => { (acc[d.category || 'Other'] ||= []).push(d); return acc; }, {} as Record<string, typeof docs>);
  Object.values(grouped).forEach(arr => arr.sort((a,b)=> a.order - b.order));
  const categories = CATEGORY_ORDER.map(c => c).filter(c => grouped[c]?.length || c === 'Playbooks');

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 space-y-16">
      {/* JSON-LD ItemList */}
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context':'https://schema.org', '@type':'ItemList',
        itemListElement: docs.map((d,i)=> ({ '@type':'ListItem', position: i+1, url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/docs/${d.slug}`, name: d.title }))
      })}} />
      {/* Sticky header */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-bg/70 border-b border-border/60 -mx-6 px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">Resource Library</h1>
          <p className="text-[12px] md:text-[13px] text-fg-muted/80 max-w-xl">Accelerate clarity, execution, progression. Start with Quick Start; deepen with Concepts; apply via Guides.</p>
        </div>
        <div className="w-full max-w-xs md:max-w-sm md:self-end">
          <DocsSearch docs={docs.map(d => ({ slug: d.slug, title: d.title, description: d.description, category: d.category }))} />
        </div>
      </div>

      <DocsFilters />

      <div className="grid gap-12 md:grid-cols-[220px_1fr]">
        <DocsSidebar categories={categories} />
        <div className="space-y-20" id="docs-content">
          {categories.map((cat, idx) => (
            <div key={cat} className={idx===0 ? '' : 'pt-4'}>
              <CategorySection category={cat} count={grouped[cat]?.length || 0} intro={CATEGORY_INTROS[cat]} icon={CATEGORY_ICONS[cat]}> 
                {grouped[cat]?.map(d => (
                  <a key={d.slug} aria-label={`Open ${d.title} (${cat})`} href={`/docs/${d.slug}`} className="group relative rounded-xl border border-border/60 p-4 bg-bg-alt/50 hover:border-accent/60 transition flex flex-col gap-3 overflow-hidden min-h-[140px]" data-difficulty={d.difficulty} data-category={d.category}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-accent/5 to-accent-alt/5" />
                    <div className="flex items-start justify-between gap-3 relative z-[1]">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-medium tracking-tight group-hover:text-accent text-sm md:text-[15px] leading-snug line-clamp-2">{d.title}</h3>
                        {d.description && <p className="text-[11px] leading-relaxed text-fg-muted line-clamp-2">{d.description}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {formatUpdated(d.updated)}
                        {difficultyBadge(d.difficulty)}
                      </div>
                    </div>
                    <div className="relative z-[1] mt-auto flex items-center justify-between pt-1 text-[10px] text-fg-muted/60">
                      <span className="flex items-center gap-1"><span className="i-lucide-file-text" />{d.readingTime}</span>
                      <span className="group-hover:text-accent flex items-center gap-1">Open<span className="i-lucide-arrow-right text-[11px]" /></span>
                    </div>
                  </a>
                ))}
              </CategorySection>
            </div>
          ))}
          <TrendingDocs docs={docs.map(d=>({slug:d.slug,title:d.title}))} />
        </div>
      </div>

      {/* Inline CTA */}
      <section className="rounded-2xl border border-border/60 p-8 bg-bg-alt/40 flex flex-col md:flex-row md:items-center gap-6 mt-12">
        <div className="flex-1 space-y-3">
          <h3 className="font-semibold text-lg">Stay in the Momentum Loop</h3>
          <p className="text-sm text-fg-muted leading-relaxed">Get roadmap updates, new guide drops, and live session invites. Cadence: low‑noise.</p>
        </div>
        <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input type="email" placeholder="you@example.com" className="flex-1 rounded-md border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
            <button type="button" className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent-alt">Subscribe</button>
        </form>
      </section>
    </div>
  );
}
