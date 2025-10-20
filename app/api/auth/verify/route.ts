import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token } = body as { token?: string };

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    return NextResponse.json({ valid: true, user: decoded }, { status: 200 });
  } catch (err) {
    console.error('[auth/verify] error', err);
    return NextResponse.json({ valid: false }, { status: 200 });
  }
}
