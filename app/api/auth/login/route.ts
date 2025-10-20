import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { authCosmosService } from '../../../../lib/azure/auth-cosmos-service';
import { generateToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await authCosmosService.getUserByEmail(normalizedEmail);

    if (!user || user.provider !== 'credentials' || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({ userId: user.id, email: user.email }, process.env.JWT_EXPIRES_IN || '1h');

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    console.error('[auth/login] error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
