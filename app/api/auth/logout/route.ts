import { NextResponse } from 'next/server';

// Authentication requires server-side code that's not compatible with Edge
export const runtime = 'nodejs';

/**
 * POST handler for user logout
 */
export async function POST() {
  try {
    // Create a response that clears cookies
    const response = NextResponse.json({ success: true });
    
    // Clear the refresh token cookie
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expire immediately
    });
    
    return response;
  } catch (error) {
    console.error('[auth/logout] error', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
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