import { getPostBySlug, getAllPostsMeta, getRelatedPosts, PostMeta } from '../../../lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '../../../components/blog/mdx';
import { getAuthor } from '../../../data/authors';
import { siteConfig } from '../../../config/site';
import ProgressBar from '../../../components/blog/ProgressBar';
import { Toc } from '../../../components/blog/Toc';
import LazyComments from '../../../components/blog/LazyComments';

export function generateStaticParams() {
  return getAllPostsMeta(true).map((p: PostMeta) => ({ slug: p.slug }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post || post.meta.draft) return <div className="px-6 py-24">Not found.</div>;
  const { meta, content } = post;
  const related = getRelatedPosts(meta.slug);
  const author = getAuthor(meta.authorKey);
  const all = getAllPostsMeta();
  const idx = all.findIndex(p => p.slug === meta.slug);
  const prev = idx < all.length - 1 ? all[idx + 1] : null;
  const next = idx > 0 ? all[idx - 1] : null;
  const canonical = meta.canonical || `${siteConfig.url}/blog/${meta.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.updated || meta.date,
    author: { '@type': 'Person', name: author.name },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    url: canonical,
    wordCount: content.split(/\s+/).length,
    keywords: meta.tags?.join(', '),
  };

  // Share URLs
  const shareUrl = encodeURIComponent(canonical);
  const shareText = encodeURIComponent(meta.title);

  return (
    <>
      <ProgressBar />
      <article className="mx-auto max-w-3xl px-6 py-24 relative">
        {/* TOC */}
        <Toc headings={meta.headings} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <header className="mb-10 space-y-6">
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-semibold tracking-tight">{meta.title}</h1>
            {meta.description && <p className="text-fg-muted text-sm leading-relaxed max-w-prose">{meta.description}</p>}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-fg-muted items-center">
            <span>{new Date(meta.date).toLocaleDateString()}</span>
            {meta.updated && meta.updated !== meta.date && <><span>•</span><span>Updated {new Date(meta.updated).toLocaleDateString()}</span></>}
            <span>•</span>
            <span>{meta.readingTime}</span>
            {meta.tags?.length ? <><span>•</span><span className="flex gap-1">{meta.tags.map((t: string) => <a key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="rounded bg-bg-alt/60 px-2 py-0.5">{t}</a>)}</span></> : null}
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-border/60 pt-4">
            <div className="h-10 w-10 rounded-full bg-bg-alt/60 flex items-center justify-center text-xs font-medium">{author.name.split(' ').map(p=>p[0]).join('').slice(0,2)}</div>
            <div className="text-xs">
              <div className="font-medium text-fg">{author.name}{author.role && <span className="text-fg-muted font-normal"> • {author.role}</span>}</div>
              {author.bio && <div className="text-fg-muted mt-0.5 line-clamp-2 max-w-sm">{author.bio}</div>}
            </div>
          </div>
        </header>
        <div className="prose prose-invert">
          <MDXRemote source={content} components={mdxComponents as any} />
        </div>
        <div className="mt-8 flex gap-3 text-xs text-fg-muted flex-wrap">
          <span>Share:</span>
          <a className="hover:text-accent" href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}>X</a>
          <a className="hover:text-accent" href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}>LinkedIn</a>
          <button className="hover:text-accent" onClick={()=> navigator.clipboard.writeText(canonical)}>Copy Link</button>
        </div>
        <div className="mt-16 rounded-lg border border-border/60 bg-bg-alt/40 p-6 text-sm">
          <p className="font-semibold mb-2">Level Up Consistently</p>
          <p className="text-fg-muted mb-4">Get structured roadmaps & live mentorship updates. No spam.</p>
          <a href="#" className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent-alt">Join Newsletter</a>
        </div>
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-xl font-semibold mb-6">Related Posts</h2>
            <ul className="space-y-4 text-sm">
              {related.map((r: PostMeta) => (
                <li key={r.slug}>
                  <a href={`/blog/${r.slug}`} className="hover:text-accent">{r.title}</a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <nav className="mt-16 flex justify-between text-xs border-t border-border/60 pt-6">
          <div>{prev && <a href={`/blog/${prev.slug}`} className="hover:text-accent">← {prev.title}</a>}</div>
            <div>{next && <a href={`/blog/${next.slug}`} className="hover:text-accent">{next.title} →</a>}</div>
        </nav>
        <LazyComments />
      </article>
    </>
  );
}
