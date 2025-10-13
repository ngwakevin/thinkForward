import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import CommunityClient from './CommunityClient';

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
  
  // Fetch threads with more information for the client component
  const threads = await db.thread.findMany({ 
    orderBy: { createdAt: 'desc' }, 
    take: 20, 
    include: { 
      category: true,
      user: { 
        select: { 
          id: true, 
          name: true, 
          profile: { 
            select: { 
              displayName: true, 
              avatarUrl: true 
            } 
          } 
        }
      },
      posts: {
        select: { id: true },
        where: { parentPostId: null }
      }
    } 
  });
  
  return <CommunityClient initialCategories={categories} initialThreads={threads} />;
}
