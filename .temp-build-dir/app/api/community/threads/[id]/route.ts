import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { communityService } from '../../../../../lib/azure/community-service';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Use communityService to get thread by ID
  const thread = await communityService.getThreadById(params.id);
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
  
  // Create the post using the community service
  const post = await communityService.createPost({
    threadId: params.id,
    authorId: userId,
    content,
    parentPostId: parentPostId || undefined
  });
  
  // Get notification recipients
  let notificationRecipients = new Set<string>();
  
  // Get thread owner to notify
  const thread = await communityService.getThreadById(params.id);
  
  if (thread && thread.authorId !== userId) {
    // Add thread owner to notification recipients if not the current user
    notificationRecipients.add(thread.authorId);
  }
  
  // If this is a reply to another post, notify that post's author
  // Since communityService might not have a specific method to get a post by ID,
  // we'll need to implement this later
  
  // Create notifications for each recipient
  for (const recipientId of notificationRecipients) {
    await communityService.createNotification({
      userId: recipientId,
      type: 'reply',
      message: `New reply in thread: "${thread?.title}"`,
      isRead: false,
      relatedItemId: post.id,
      relatedItemType: 'post'
    });
  }
  
  return NextResponse.json(post, { status: 201 });
}
