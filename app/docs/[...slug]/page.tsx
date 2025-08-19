import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '../../../components/blog/mdx';
import readingTime from 'reading-time';

function loadDoc(slugParts: string[]) {
  const rel = slugParts.join('/');
  const filePath = path.join(process.cwd(), 'content', 'docs', rel + '.mdx');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { data, content, slug: rel };
}

export function generateStaticParams() {
  const base = path.join(process.cwd(), 'content', 'docs');
  if (!fs.existsSync(base)) return [];
  const params: { slug: string[] }[] = [];
  const walk = (dir: string) => {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) { walk(full); continue; }
      if (file.endsWith('.mdx')) {
        const rel = full.replace(base + path.sep, '').replace(/\\/g, '/').replace(/\.mdx$/, '');
        params.push({ slug: rel.split('/') });
      }
    }
  };
  walk(base);
  return params;
}

export default function DocPage({ params }: { params: { slug: string[] } }) {
  const doc = loadDoc(params.slug);
  if (!doc) return <div className="px-6 py-24">Not found.</div>;
  const { data, content } = doc;
  const stats = readingTime(content);
  if (typeof window !== 'undefined') {
    try {
      const views = JSON.parse(localStorage.getItem('docViews') || '{}');
      views[doc.slug] = (views[doc.slug] || 0) + 1;
      localStorage.setItem('docViews', JSON.stringify(views));
    } catch {}
  }
  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <header className="mb-10 space-y-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight">{(data as any).title || doc.slug}</h1>
        {(data as any).description && <p className="text-sm text-fg-muted leading-relaxed max-w-prose">{(data as any).description}</p>}
        <div className="flex flex-wrap gap-3 text-[11px] text-fg-muted/80 items-center">
          <span>{stats.text}</span>
          {(data as any).updated && <><span>•</span><span>Updated {(data as any).updated}</span></>}
          {(data as any).difficulty && <><span>•</span><span className="uppercase tracking-wide">{(data as any).difficulty}</span></>}
        </div>
      </header>
      <div className="prose prose-invert">
        <MDXRemote source={content} components={mdxComponents as any} />
      </div>
    </article>
  );
}
