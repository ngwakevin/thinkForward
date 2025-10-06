import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // Find post and thread
  const post = await (prisma as any).post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const thread = await (prisma as any).thread.findUnique({ where: { id: post.threadId } });
  if (!thread) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // Only thread owner or mentors can accept
  const me = await (prisma as any).user.findUnique({ where: { id: userId } });
  if (thread.userId !== userId && !me?.isMentor) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await (prisma as any).$transaction([
    (prisma as any).post.updateMany({ where: { threadId: post.threadId }, data: { isAccepted: false } }),
    (prisma as any).post.update({ where: { id: params.id }, data: { isAccepted: true } }),
    (prisma as any).thread.update({ where: { id: post.threadId }, data: { acceptedPostId: params.id } }),
  ]);
  return NextResponse.json({ ok: true });
}
