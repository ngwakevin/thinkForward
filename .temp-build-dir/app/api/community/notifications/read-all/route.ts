import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { communityService } from '../../../../../lib/azure/community-service';

// Mark all notifications as read
export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Mark all notifications as read for this user using the community service
  await communityService.markAllNotificationsAsRead(userId);
  
  return NextResponse.json({ success: true });
}