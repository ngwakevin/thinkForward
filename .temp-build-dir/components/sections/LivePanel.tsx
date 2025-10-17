import { getAllPostsMeta } from '../../lib/posts';

export function LivePanel() {
  const latestPost = getAllPostsMeta()[0];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {/* Latest Insight */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Latest Insight</h2>
          {latestPost ? (
            <a href={`/blog/${latestPost.slug}`} className="block rounded-xl border border-border/60 p-5 bg-bg-alt/40 hover:border-accent/50 transition hover:bg-gradient-to-br from-accent/10 to-accent-alt/10 ring-1 ring-transparent hover:ring-accent">
              <div className="text-xs text-fg-muted mb-2">{new Date(latestPost.date).toLocaleDateString()}</div>
              <div className="font-medium leading-snug">{latestPost.title}</div>
              <p className="text-sm text-fg-muted mt-2 line-clamp-3">{latestPost.description || ''}</p>
            </a>
          ) : <p className="text-sm text-fg-muted">No posts yet.</p>}
        </div>
        {/* Join Live Bootcamps */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Join Live Bootcamps</h2>
          <div className="rounded-xl border border-border/60 p-5 bg-gradient-to-br from-accent/10 to-accent-alt/10 hover:border-accent/60 transition relative overflow-hidden">
            <p className="text-sm text-fg-muted leading-relaxed">Build core DevOps execution habits in a focused cohort with weekly milestones & accountability.</p>
            <a href="/bootcamps" className="mt-4 inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent-alt transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
              Explore Bootcamps <span className="i-lucide-arrow-right" />
            </a>
          </div>
        </div>
        {/* Book Mentoring Session */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Book Mentoring</h2>
          <div className="rounded-xl border border-border/60 p-5 bg-gradient-to-br from-fuchsia-500/10 via-accent/5 to-accent-alt/10 hover:border-accent/60 transition relative overflow-hidden">
            <p className="text-sm text-fg-muted leading-relaxed">Targeted 1‑on‑1 guidance: unblock progress, refine roadmap, accelerate outcomes.</p>
            <a href="/mentoring" className="mt-4 inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent-alt transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
              Book a Session <span className="i-lucide-arrow-right" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
