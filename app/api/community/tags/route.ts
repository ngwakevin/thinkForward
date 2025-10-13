import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// Get all tags
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const tags = await (prisma as any).tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { threads: true } } }
  });
  
  return NextResponse.json(tags);
}

// Create a new tag
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Check if user is a mentor (only mentors can create tags)
  const userId = (session.user as any)?.id;
  const user = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { isMentor: true }
  });
  
  if (!user?.isMentor) {
    return NextResponse.json({ error: 'Only mentors can create tags' }, { status: 403 });
  }
  
  const body = await req.json();
  const { name } = body || {};
  
  if (!name) {
    return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
  }
  
  // Generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // Check if tag already exists
  const existingTag = await (prisma as any).tag.findUnique({
    where: { slug }
  });
  
  if (existingTag) {
    return NextResponse.json({ error: 'Tag already exists' }, { status: 400 });
  }
  
  // Create the tag
  const tag = await (prisma as any).tag.create({
    data: { name, slug }
  });
  
  return NextResponse.json(tag, { status: 201 });
}