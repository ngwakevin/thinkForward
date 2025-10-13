import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// Get current user's notifications
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Get unread notifications first, followed by read ones, limited to 50 total
  const notifications = await (prisma as any).notification.findMany({
    where: { userId },
    orderBy: [
      { read: 'asc' },  // Unread first
      { createdAt: 'desc' }  // Most recent first
    ],
    take: 50,
  });
  
  return NextResponse.json(notifications);
}