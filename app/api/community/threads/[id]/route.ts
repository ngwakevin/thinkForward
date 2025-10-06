import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
const db = prisma as any;

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const thread = await db.thread.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      user: { select: { id: true, name: true, isMentor: true, profile: { select: { displayName: true, avatarUrl: true } } } },
      posts: {
        where: { parentPostId: null },
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, name: true, isMentor: true, profile: { select: { displayName: true, avatarUrl: true } } } },
          children: {
            orderBy: { createdAt: 'asc' },
            include: { user: { select: { id: true, name: true, isMentor: true, profile: { select: { displayName: true, avatarUrl: true } } } } },
          },
          likes: { select: { id: true, userId: true } },
        },
      },
    },
  });
  if (!thread) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(thread);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { content, parentPostId } = body || {};
  if (!content) return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  const post = await db.post.create({ data: { threadId: params.id, userId, content, parentPostId: parentPostId || null } });
  return NextResponse.json(post, { status: 201 });
}
