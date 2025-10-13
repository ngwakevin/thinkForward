import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';

// Add tags to a thread
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id;
  
  // Get thread to check ownership
  const thread = await (prisma as any).thread.findUnique({
    where: { id: params.id },
    select: { userId: true }
  });
  
  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  }
  
  // Only thread owner or mentors can add tags
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { isMentor: true }
  });
  
  if (thread.userId !== userId && !user?.isMentor) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  const body = await req.json();
  const { tagIds } = body || {};
  
  if (!tagIds || !Array.isArray(tagIds) || tagIds.length === 0) {
    return NextResponse.json({ error: 'Tag IDs are required' }, { status: 400 });
  }
  
  // Add tags to thread
  const threadTags = tagIds.map((tagId) => ({
    threadId: params.id,
    tagId
  }));
  
  // First remove existing tags
  await (prisma as any).threadTag.deleteMany({
    where: { threadId: params.id }
  });
  
  // Then add new tags
  await (prisma as any).threadTag.createMany({
    data: threadTags,
    skipDuplicates: true
  });
  
  // Return updated thread with tags
  const updatedThread = await (prisma as any).thread.findUnique({
    where: { id: params.id },
    include: {
      tags: { include: { tag: true } }
    }
  });
  
  return NextResponse.json(updatedThread);
}

// Get tags for a thread
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const threadTags = await (prisma as any).threadTag.findMany({
    where: { threadId: params.id },
    include: { tag: true }
  });
  
  return NextResponse.json(threadTags.map((tt: any) => tt.tag));
}