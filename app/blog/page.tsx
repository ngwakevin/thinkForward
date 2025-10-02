import { getAllPostsMeta } from '../../lib/posts';
import { siteConfig } from '../../config/site';

export const metadata = { title: 'Blog' };

const PAGE_SIZE = 10;

function paginate<T>(items: T[], page: number, size: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * size;
  return { page: current, totalPages, slice: items.slice(start, start + size) };
}

export default function BlogIndex({ searchParams }: { searchParams?: { tag?: string; page?: string } }) {
  const tag = searchParams?.tag;
  const pageParam = parseInt(searchParams?.page || '1', 10);
  const all = getAllPostsMeta();
  const filtered = tag ? all.filter(p => p.tags?.includes(tag)) : all;
  const featured = filtered.find(p => p.featured) || filtered[0];
  const rest = filtered.filter(p => p.slug !== featured.slug);
  const { slice, page, totalPages } = paginate(rest, pageParam, PAGE_SIZE);
  const tags = Array.from(new Set(all.flatMap(p => p.tags || []))).sort();
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 space-y-16">
      <header className="space-y-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Blog</h1>
        <p className="text-fg-muted text-sm max-w-2xl">Insights, practices, and pragmatic guidance for sustainable cloud & DevOps growth.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <a href="/blog" className={`text-xs px-3 py-1 rounded-full border ${!tag ? 'bg-accent text-white border-accent' : 'border-border/60 text-fg-muted hover:text-fg'}`}>All</a>
        {tags.map(t => (
          <a key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className={`text-xs px-3 py-1 rounded-full border ${tag===t ? 'bg-accent text-white border-accent' : 'border-border/60 text-fg-muted hover:text-fg'}`}>{t}</a>
        ))}
      </div>

      {featured && (
        <section className="rounded-xl border border-border/60 bg-bg-alt/40 p-8 md:p-10">
          <div className="space-y-4 max-w-2xl">
            <a href={`/blog/${featured.slug}`} className="group block">
              <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight group-hover:text-accent transition">{featured.title}</h2>
            </a>
            {featured.description && <p className="text-fg-muted text-sm leading-relaxed">{featured.description}</p>}
            <div className="flex flex-wrap gap-3 text-xs text-fg-muted">
              <span>{new Date(featured.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{featured.readingTime}</span>
              {featured.tags?.length ? <><span>•</span><span className="flex gap-1">{featured.tags.map(t => <a key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="rounded bg-bg-alt/60 px-2 py-0.5">{t}</a>)}</span></> : null}
            </div>
          </div>
        </section>
      )}

      <ul className="space-y-10">
        {slice.map(p => (
          <li key={p.slug} className="group">
            <div className="space-y-2">
              <a href={`/blog/${p.slug}`} className="font-medium text-xl hover:text-accent transition flex flex-col gap-2">
                <span>{p.title}</span>
                {p.description && <span className="text-sm text-fg-muted font-normal leading-relaxed">{p.description}</span>}
              </a>
              <div className="flex flex-wrap gap-3 text-xs text-fg-muted">
                <span>{new Date(p.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{p.readingTime}</span>
                {p.tags?.length ? <><span>•</span><span className="flex gap-1">{p.tags.map(t => <a key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="rounded bg-bg-alt/60 px-2 py-0.5">{t}</a>)}</span></> : null}
              </div>
            </div>
          </li>
        ))}
        {slice.length === 0 && <li className="text-fg-muted">No posts{tag && ' for that tag'}.</li>}
      </ul>

      {totalPages > 1 && (
        <nav className="flex items-center justify-between pt-4 text-xs" aria-label="Pagination">
          <div>{page} / {totalPages}</div>
          <div className="flex gap-2">
            {page > 1 && <a className="rounded border border-border/60 px-3 py-1 hover:bg-bg-alt/60" href={`/blog?${tag ? `tag=${encodeURIComponent(tag)}&` : ''}page=${page-1}`}>Prev</a>}
            {page < totalPages && <a className="rounded border border-border/60 px-3 py-1 hover:bg-bg-alt/60" href={`/blog?${tag ? `tag=${encodeURIComponent(tag)}&` : ''}page=${page+1}`}>Next</a>}
          </div>
        </nav>
      )}
    </div>
  );
}
