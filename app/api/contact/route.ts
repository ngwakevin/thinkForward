import { NextRequest } from 'next/server';
import { sendContactMessage } from '../../../lib/email/send';

// Local lightweight token bucket rate limiter (per IP)
const rlStore = new Map<string, { ts: number; count: number }>();
const RL_WINDOW = 60_000; // 1 minute
const RL_MAX = 10;
function isRateLimited(ip: string) {
  const now = Date.now();
  const rec = rlStore.get(ip);
  if (!rec || now - rec.ts > RL_WINDOW) {
    rlStore.set(ip, { ts: now, count: 1 });
    return false;
  }
  rec.count += 1;
  return rec.count > RL_MAX;
}

function sanitize(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.slice(0, 4000).trim();
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ ok: false, error: 'RATE_LIMIT' }), { status: 429 });
  }

  let body: any = {};
  try {
    if (req.headers.get('content-type')?.includes('application/json')) {
      body = await req.json();
    } else if (req.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
      const form = await req.formData();
      form.forEach((v, k) => { body[k] = v; });
    } else if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const form = await req.formData();
      form.forEach((v, k) => { body[k] = v; });
    } else {
      body = await req.json().catch(() => ({}));
    }
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: 'BAD_REQUEST' }), { status: 400 });
  }

  // Honeypot field (commonly _h or _hp) - reject if filled
  if (body._h || body._hp || body.honeypot) {
    return new Response(JSON.stringify({ ok: true, spam: true }), { status: 200 });
  }

  const name = sanitize(body.name || body.fullName || '');
  const email = sanitize(body.email || '');
  const subject = sanitize(body.subject || '');
  const message = sanitize(body.message || body.body || '');
  const organization = sanitize(body.organization || body.company || '');
  const phone = sanitize(body.phone || body.tel || '');

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ ok: false, error: 'MISSING_FIELDS' }), { status: 400 });
  }

  try {
    const res: any = await sendContactMessage({
      name,
      email,
      subject,
      message,
      organization,
      phone,
      ip,
      ua: req.headers.get('user-agent') || undefined,
      at: new Date().toISOString(),
    });

    const disabled = !!res?.disabled;
    return new Response(JSON.stringify({ ok: true, sent: !disabled, disabled }), { status: 200 });
  } catch (err) {
    console.error('contact send error', err);
    return new Response(JSON.stringify({ ok: false, error: 'SEND_FAIL' }), { status: 500 });
  }
}