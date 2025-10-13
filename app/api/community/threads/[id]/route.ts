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
      tags: {
        include: { tag: true }
      }
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
  
  // Create the post
  const post = await db.post.create({ 
    data: { 
      threadId: params.id, 
      userId, 
      content, 
      parentPostId: parentPostId || null 
    } 
  });
  
  // Get notification recipients
  let notificationRecipients = new Set<string>();
  
  // Get thread owner to notify
  const thread = await db.thread.findUnique({
    where: { id: params.id },
    select: { userId: true }
  });
  
  if (thread && thread.userId !== userId) {
    // Add thread owner to notification recipients if not the current user
    notificationRecipients.add(thread.userId);
  }
  
  // If this is a reply to another post, notify that post's author
  if (parentPostId) {
    const parentPost = await db.post.findUnique({
      where: { id: parentPostId },
      select: { userId: true }
    });
    
    if (parentPost && parentPost.userId !== userId) {
      // Add parent post owner to notification recipients if not the current user
      notificationRecipients.add(parentPost.userId);
    }
  }
  
  // Get thread details for notification content
  const threadDetails = await db.thread.findUnique({
    where: { id: params.id },
    select: { title: true }
  });
  
  // Create notifications
  const notifications = [];
  for (const recipientId of notificationRecipients) {
    notifications.push({
      userId: recipientId,
      type: 'reply',
      content: `New reply in thread: "${threadDetails?.title}"`,
      read: false
    });
  }
  
  if (notifications.length > 0) {
    await db.notification.createMany({
      data: notifications
    });
  }
  
  return NextResponse.json(post, { status: 201 });
}
