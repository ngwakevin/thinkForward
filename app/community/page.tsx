import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import CommunityClient from './CommunityClient';
import { communityService } from '../../lib/azure/community-service';

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
  import type { Metadata } from 'next';
import { communityService } from '../../lib/azure/community-service';
import { Container } from '../../components/ui/container';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Community - ThinkForward',
  description: 'Join our vibrant community of learners and professionals. Share knowledge, ask questions, and collaborate with peers worldwide.',
};

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export default async function CommunityPage() {
  // Initialize containers if needed
  await communityService.initialize();
  // Initialize containers if needed
  await communityService.initialize();
  
  // Seed default categories on first visit if none exist
  let categories = await communityService.getAllCategories();
  
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
      try { 
        await communityService.createCategory({
          name: d.name, 
          description: d.description, 
          slug 
        });
      } catch (error) {
        console.error(`Error creating category ${d.name}:`, error);
      }
    }
    
    categories = await communityService.getAllCategories();
  }
  
  // Fetch threads
  const threads = await communityService.getThreads({
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Get user info for each thread author
  const threadsWithUserInfo = await Promise.all(threads.map(async (thread) => {
    const { cosmosService } = await import('../../lib/azure/cosmos-service');
    const user = await cosmosService.getUserById(thread.authorId);
    
    // Get post count for this thread
    const posts = await communityService.getPostsByThreadId(thread.id);
    
    return {
      ...thread,
      user: {
        id: user?.id,
        name: user?.name,
        profile: {
          displayName: user?.profile?.displayName || user?.name,
          avatarUrl: user?.profile?.avatarUrl
        }
      },
      posts: posts.map(p => ({ id: p.id })),
      category: await communityService.getCategoryBySlug(thread.categoryId)
    };
  }));
  
  return <CommunityClient initialCategories={categories} initialThreads={threadsWithUserInfo} />;
}
