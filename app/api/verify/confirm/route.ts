import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Configuration constants
const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { channel, code } = body as any;
    if (!channel || !['email', 'phone'].includes(channel)) {
      return Response.json({ error: 'Invalid channel' }, { status: 400 });
    }
    if (!code || typeof code !== 'string') {
      return Response.json({ error: 'Code required' }, { status: 400 });
    }

    const providerAccountId = (session.user as any).providerAccountId;
    const user = (await prisma.user.findFirst({
      where: providerAccountId ? { providerAccountId } : { email: session.user.email?.toLowerCase() },
    })) as any;
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    // Load latest active code (already structured with salt/codeHash)
    const latest = await (prisma as any).verificationCode.findFirst({
      where: {
        userId: user.id,
        channel,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) return Response.json({ error: 'No active code' }, { status: 400 });

    if (latest.attempts >= MAX_ATTEMPTS) {
      return Response.json({ error: 'Too many attempts. Request a new code.' }, { status: 429 });
    }

    const salt: string = latest.salt;
    const storedHash: string = latest.codeHash;
    if (!salt || !storedHash) {
      return Response.json({ error: 'Corrupt code' }, { status: 500 });
    }

    const attemptHash = crypto.createHash('sha256').update(code + salt).digest('hex');
    if (attemptHash !== storedHash) {
      // Increment attempts on failure
      await (prisma as any).verificationCode.update({
        where: { id: latest.id },
        data: { attempts: latest.attempts + 1 },
      });
      const remaining = Math.max(0, MAX_ATTEMPTS - (latest.attempts + 1));
      return Response.json({ error: 'Invalid code', remainingAttempts: remaining }, { status: 400 });
    }

    // Success: mark consumed
    await (prisma as any).verificationCode.update({
      where: { id: latest.id },
      data: { consumedAt: new Date() },
    });

    // Update verification timestamps & commit pending phone if applicable
    if (channel === 'email' && !user.emailVerifiedAt) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() } as any,
      });
    } else if (channel === 'phone') {
      const userUpdate: any = { phoneVerifiedAt: user.phoneVerifiedAt ? user.phoneVerifiedAt : new Date() };
      if (!user.phoneVerifiedAt && user.pendingPhoneNumber) {
        userUpdate.phoneNumber = user.pendingPhoneNumber;
        userUpdate.pendingPhoneNumber = null;
      }
      await prisma.user.update({ where: { id: user.id }, data: userUpdate });
    }

    return Response.json({ ok: true, channel });
  } catch (e: any) {
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
