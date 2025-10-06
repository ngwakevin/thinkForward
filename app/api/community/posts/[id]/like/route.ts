import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const like = await (prisma as any).postLike.create({ data: { postId: params.id, userId } });
    return NextResponse.json(like, { status: 201 });
  } catch (e: any) {
    // If already liked (unique constraint), ignore
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await (prisma as any).postLike.deleteMany({ where: { postId: params.id, userId } });
  return NextResponse.json({ ok: true });
}
