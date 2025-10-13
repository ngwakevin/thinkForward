import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { communityService } from '../../../../../lib/azure/community-service';

// Mark notification as read
export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Get notifications for the user
  const notifications = await communityService.getNotificationsByUserId(userId);
  const notification = notifications.find(n => n.id === params.id);
  
  if (!notification) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }
  
  if (notification.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Update the notification
  await communityService.markNotificationAsRead(params.id);
  
  return NextResponse.json({ success: true });
}

// Delete a notification
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Get notifications for the user
  const notifications = await communityService.getNotificationsByUserId(userId);
  const notification = notifications.find(n => n.id === params.id);
  
  if (!notification) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }
  
  if (notification.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Delete the notification
  await communityService.deleteNotification(params.id);
  
  return NextResponse.json({ success: true });
}