import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
const db = prisma as any;
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  let searchParams = new URLSearchParams();
  try {
    if (req.url && req.url.trim() !== '') {
      searchParams = new URL(req.url).searchParams;
    }
  } catch (e) {
    console.warn('Failed to parse URL in threads API:', req.url);
  }
  
  // Extract query parameters
  const categoryId = searchParams.get('categoryId') || undefined;
  const q = searchParams.get('q') || undefined;
  const sort = searchParams.get('sort') || 'recent';
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  
  // Build the where clause
  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (q) where.OR = [
    { title: { contains: q, mode: 'insensitive' } },
    { content: { contains: q, mode: 'insensitive' } }
  ];
  
  // Determine the order based on sorting preference
  const orderBy: any = sort === 'popular' 
    ? [{ posts: { _count: 'desc' } }, { createdAt: 'desc' }]
    : { createdAt: 'desc' };
  
  // Query with optimized includes
  const threads = await db.thread.findMany({
    where,
    orderBy,
    take: limit,
    include: { 
      category: true, 
      user: { 
        select: { 
          id: true, 
          name: true, 
          isMentor: true,
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
      },
      tags: {
        include: { tag: true }
      },
      _count: {
        select: { posts: true }
      }
    },
  });
  return NextResponse.json(threads);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { categoryId, title, content } = body || {};
  if (!categoryId || !title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const thread = await db.thread.create({ data: { categoryId, userId, title, content } });
  return NextResponse.json(thread, { status: 201 });
}
