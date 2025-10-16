import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../../lib/auth';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

// Mark route as dynamic since it uses searchParams and cookies
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');
    const password = searchParams.get('password');
    const callbackUrl = searchParams.get('callbackUrl') || '/profile?tab=bootcamps';
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    // Set some cookies to help with debugging
    const cookieStore = cookies();
    cookieStore.set('auto-login-attempt', 'true', { 
      maxAge: 60 * 5, // 5 minutes
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });
    
    // Generate a temporary state hash for CSRF protection
    const csrfToken = createHash('sha256').update(email + Date.now()).digest('hex');
    cookieStore.set('auto-login-state', csrfToken, { 
      maxAge: 60 * 5, // 5 minutes
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });

    // Instead of trying to login here, redirect to a special page that will handle the login
    // This avoids issues with credentials needing to be handled securely
    return NextResponse.redirect(
      new URL(`/auth/auto-login?email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}&state=${csrfToken}`, req.url)
    );
  } catch (error) {
    console.error('Auto login failed:', error);
    return NextResponse.json({ error: 'Auto login failed' }, { status: 500 });
  }
}