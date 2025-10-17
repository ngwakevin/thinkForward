import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { communityService } from '../../../../lib/azure/community-service';

// Get current user's notifications
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Get notifications for the user, limited to 50
  const notifications = await communityService.getNotificationsByUserId(userId, 50);
  
  return NextResponse.json(notifications);
}