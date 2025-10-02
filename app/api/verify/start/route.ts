import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Simple in-memory rate limiter (per process) - replace with Redis for multi-instance
const startsPerHour: Record<string, { count: number; windowStart: number }> = {};

const EMAIL_HOURLY_LIMIT = Number(process.env.VERIFICATION_MAX_EMAIL_STARTS_PER_HOUR || 3);
const PHONE_HOURLY_LIMIT = Number(process.env.VERIFICATION_MAX_PHONE_STARTS_PER_HOUR || 5);
const EMAIL_TTL_SEC = Number(process.env.VERIFICATION_EMAIL_TTL_SECONDS || 600);
const PHONE_TTL_SEC = Number(process.env.VERIFICATION_PHONE_TTL_SECONDS || 300);
const CODE_LENGTH = Number(process.env.VERIFICATION_CODE_LENGTH || 6);

function genCode(len: number) {
  const max = 10 ** len;
  const n = Math.floor(Math.random() * max).toString().padStart(len, '0');
  return n;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json().catch(()=>({}));
  const { channel, phoneNumber } = body as any; // channel: 'email' | 'phone'
    if (!channel || !['email','phone'].includes(channel)) return Response.json({ error: 'Invalid channel' }, { status: 400 });

    // Identify user
    const providerAccountId = (session.user as any).providerAccountId;
  const user = await prisma.user.findFirst({ where: providerAccountId ? { providerAccountId } : { email: session.user.email?.toLowerCase() } });
    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    // Rate limit per user+channel per hour
    const key = `${user.id}:${channel}`;
    const now = Date.now();
    const rec = startsPerHour[key];
    const limit = channel === 'email' ? EMAIL_HOURLY_LIMIT : PHONE_HOURLY_LIMIT;
    if (!rec || now - rec.windowStart > 3600_000) {
      startsPerHour[key] = { count: 1, windowStart: now };
    } else {
      if (rec.count >= limit) return Response.json({ error: 'Too many attempts, try later' }, { status: 429 });
      rec.count += 1;
    }

    // Generate code & hash
    const code = genCode(CODE_LENGTH);
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.createHash('sha256').update(code + salt).digest('hex');
    const ttlSec = channel === 'email' ? EMAIL_TTL_SEC : PHONE_TTL_SEC;
    const expiresAt = new Date(Date.now() + ttlSec * 1000);

    // Remove existing active codes for this channel
  await (prisma as any).verificationCode.deleteMany({ where: { userId: user.id, channel, consumedAt: null } }).catch(()=>{});

    // Pending phone strategy: store pendingPhoneNumber first if provided & channel=phone
    if (channel === 'phone' && phoneNumber) {
  await prisma.user.update({ where: { id: user.id }, data: { pendingPhoneNumber: phoneNumber } as any });
    }

    await (prisma as any).verificationCode.create({
      data: {
        userId: user.id,
        channel,
        code: '', // legacy unused
        salt,
        codeHash: hash,
        expiresAt,
        attempts: 0,
      }
    });

    // If phone channel and phoneNumber provided, we do not persist yet (Strategy B) -> rely on pending field (not yet added) or ephemeral; for now we just echo acceptance.

    // Simulate delivery (log). Replace with actual email/SMS provider.
  console.info(`[verification:start] channel=${channel} user=${user.id} code=${code}`);

    return Response.json({ ok: true, channel, ttlSeconds: ttlSec });
  } catch (e: any) {
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
