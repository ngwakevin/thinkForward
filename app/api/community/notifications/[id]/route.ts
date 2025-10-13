import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

// Mark notification as read
export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // First check if the notification belongs to the user
  const notification = await (prisma as any).notification.findUnique({
    where: { id: params.id },
  });
  
  if (!notification) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }
  
  if (notification.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Update the notification
  await (prisma as any).notification.update({
    where: { id: params.id },
    data: { read: true },
  });
  
  return NextResponse.json({ success: true });
}

// Delete a notification
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // First check if the notification belongs to the user
  const notification = await (prisma as any).notification.findUnique({
    where: { id: params.id },
  });
  
  if (!notification) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }
  
  if (notification.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Delete the notification
  await (prisma as any).notification.delete({
    where: { id: params.id },
  });
  
  return NextResponse.json({ success: true });
}