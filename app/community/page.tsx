import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

export default async function CommunityHome() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="font-display text-3xl font-bold">Community</h1>
        <p className="mt-2 text-fg-muted">Please sign in to access the community.</p>
        <Link className="mt-4 inline-block text-accent underline" href="/auth/signin">Sign in</Link>
      </div>
    );
  }
  // Ensure the Prisma client is up-to-date (Category model exists). If not, guide the developer.
  if (!(prisma as any).category) {
    throw new Error('Prisma client is outdated (missing Category model). Run `npm run prisma:generate` and restart the dev server.');
  }
  const db = prisma as any;
  // Seed default categories on first visit if none exist (AWS, Azure, DevOps, Mentorship, Career Advice)
  let categories = await db.category.findMany({ orderBy: { name: 'asc' } });
  if (!categories || categories.length === 0) {
    const defaults = [
      { name: 'AWS', description: 'Amazon Web Services discussions' },
      { name: 'Azure', description: 'Microsoft Azure cloud topics' },
      { name: 'DevOps', description: 'CI/CD, infrastructure, tooling' },
      { name: 'Mentorship', description: 'Guidance from mentors and peers' },
      { name: 'Career Advice', description: 'Interviews, resumes, and growth' },
    ];
    for (const d of defaults) {
      const slug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      try { await db.category.create({ data: { name: d.name, description: d.description, slug } }); } catch {}
    }
    categories = await db.category.findMany({ orderBy: { name: 'asc' } });
  }
  const threads = await db.thread.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { category: true } });
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold">Community</h1>
        <p className="text-fg-muted">Learn together. Ask questions. Share solutions.</p>
      </div>
      <section>
        <h2 className="font-semibold mb-3">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(categories as any[]).map((c: any) => (
            <Link key={c.id} href={`/community/c/${c.slug}` as any} className="rounded-xl border border-border/60 p-4 hover:bg-bg-alt/60">
              <div className="font-medium">{c.name}</div>
              {c.description && <div className="text-xs text-fg-muted mt-1 line-clamp-2">{c.description}</div>}
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-semibold mb-3">Latest Threads</h2>
        <div className="divide-y divide-border/60 rounded-xl border border-border/60">
          {(threads as any[]).map((t: any) => (
            <Link key={t.id} href={`/community/t/${t.id}` as any} className="block p-4 hover:bg-bg-alt/60">
              <div className="text-sm text-fg-muted">{t.category.name}</div>
              <div className="font-medium">{t.title}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
