import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, product } = await req.json();
    if (!email || !product) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }
    // TODO: Persist to DB / list provider. For now just log.
    console.log('WAITLIST_JOIN', { email, product, at: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }
}
