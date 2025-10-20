import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { authCosmosService } from '../../../../lib/azure/auth-cosmos-service';
import { signAccessToken, signRefreshToken, TokenPayload } from '@/lib/jwt';

// Authentication requires server-side code that's not compatible with Edge
export const runtime = 'nodejs';

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

    // Create payload for tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    // Generate both access and refresh tokens
    const accessToken = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Create the response
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: accessToken,
    });

    // Set refresh token as HttpOnly cookie
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (err) {
    console.error('[auth/login] error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
