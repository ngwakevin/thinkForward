import { NextRequest, NextResponse } from 'next/server';

// Simple server action endpoint for mentoring booking form submissions.
// Currently logs the payload; replace with persistence (DB, email, queue) later.
// Accepts either form POST (application/x-www-form-urlencoded or multipart) or JSON.
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let payload: any = {};

    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      const form = await req.formData();
      // Helper to read optional string
      const s = (k: string) => (form.get(k) ?? '').toString().trim();
      payload = {
        name: s('name'),
        email: s('email'),
        role: s('role'),
        goal: s('goal'),
        context: s('context'),
        urgency: s('urgency') || 'normal',
        timezone: s('timezone'),
        topics: form.getAll('topics').map(v => v.toString()),
        ua: req.headers.get('user-agent') || undefined,
        ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
        at: new Date().toISOString(),
      };
    }

    // Basic validation
    if (!payload.name || !payload.email) {
      return NextResponse.json({ ok: false, error: 'Missing name or email' }, { status: 400 });
    }
    // Minimal email shape check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }

    // TODO: Add persistence (e.g., insert row, send email, queue message). For now just log safely.
    const logCopy = { ...payload, email: payload.email.toLowerCase() };
    console.log('MENTORING_REQUEST', logCopy);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('MENTORING_REQUEST_ERROR', err);
    return NextResponse.json({ ok: false, error: 'Invalid submission' }, { status: 400 });
  }
}

export async function GET() {
  // Lightweight health / schema hint.
  return NextResponse.json({ ok: true, endpoint: 'mentoring-request', method: 'POST', required: ['name','email'], optional: ['role','goal','context','urgency','timezone','topics[]'] });
}
