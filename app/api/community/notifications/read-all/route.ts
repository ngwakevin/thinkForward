import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

// Mark all notifications as read
export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Update all unread notifications for this user
  await (prisma as any).notification.updateMany({
    where: { 
      userId,
      read: false
    },
    data: { read: true },
  });
  
  return NextResponse.json({ success: true });
}