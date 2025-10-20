import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const decoded = verifyJwt(token);

  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Access granted',
    user: decoded,
  });
}
