import { NextResponse } from 'next/server';
import { verifyJwt, signAccessToken, TokenPayload } from '@/lib/jwt';

// Authentication requires server-side code that's not compatible with Edge
export const runtime = 'nodejs';

/**
 * POST handler for refreshing access tokens
 */
export async function POST(req: Request) {
  try {
    // Get the refresh token from cookies
    const refreshToken = req.cookies.get('refresh_token')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Verify the refresh token
    const decoded = await verifyJwt<TokenPayload>(refreshToken);
    
    if (!decoded || !decoded.userId || !decoded.email) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 403 }
      );
    }

    // Generate a new access token
    const newAccessToken = await signAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    });

    // Return the new access token
    return NextResponse.json({
      token: newAccessToken,
    });
  } catch (error) {
    console.error('[auth/refresh] error', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}