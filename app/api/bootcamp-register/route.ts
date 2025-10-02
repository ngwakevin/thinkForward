import { NextRequest, NextResponse } from 'next/server';
import { sendBootcampRegistration } from '../../../lib/email/send';
import type { BootcampRegistrationData } from '../../../lib/email/templates';

  // Simple in-memory rate limiter (per IP) to reduce abuse.
  const rateMap = new Map<string, { ts: number; count: number }>();
  const WINDOW_MS = 60_000; // 1 minute
  const MAX_PER_WINDOW = 5;
  function rateLimit(ip: string | undefined): boolean {
    if (!ip) return false; // allow if no ip
    const now = Date.now();
    const rec = rateMap.get(ip);
    if (!rec || now - rec.ts > WINDOW_MS) {
      rateMap.set(ip, { ts: now, count: 1 });
      return false;
    }
    rec.count += 1;
    return rec.count > MAX_PER_WINDOW;
  }

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const f = (k: string) => (form.get(k) ?? '').toString().trim();

  const payload = {
      name: f('name'),
      email: f('email'),
      phone: f('phone'),
      provider: f('provider'),
      in_it: f('in_it'),
      current_role: f('current_role'),
      experience: f('experience'),
      goal: f('goal'),
      exposure: f('exposure'),
      notes: f('notes'),
      track: f('track'),
      plan: f('plan'),
      intent: f('intent'),
      cert: f('cert'),
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
      ua: req.headers.get('user-agent') || undefined,
      at: new Date().toISOString()
    } as BootcampRegistrationData;

    if (!payload.name || !payload.email) {
      return NextResponse.json({ ok: false, error: 'Missing name or email' }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }

    // Rate limit check
    const limited = rateLimit(payload.ip);
    if (limited) {
      return NextResponse.json({ ok: false, error: 'Too many submissions, please wait a minute.' }, { status: 429 });
    }

    const result = await sendBootcampRegistration(payload);
    return NextResponse.json({ ok: result.ok, sent: result.ok && !result.disabled, disabled: result.disabled, error: result.error });
  } catch (err) {
    console.error('[bootcamp-register] error', err);
    return NextResponse.json({ ok: false, error: 'Invalid submission' }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
