import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../../lib/auth';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';

// Mark route as dynamic since it uses cookies and performs auth operations
export const dynamic = 'force-dynamic';

/**
 * GET endpoint for auto-login via URL parameters
 * This is helpful for system-generated links that include login credentials
 */
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

    // Redirect to a special page that will handle the login client-side
    // This avoids issues with credentials needing to be handled securely
    return NextResponse.redirect(
      new URL(`/auth/auto-login?email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}&state=${csrfToken}`, req.url)
    );
  } catch (error) {
    console.error('Auto login GET failed:', error);
    return NextResponse.json({ error: 'Auto login failed' }, { status: 500 });
  }
}

/**
 * POST endpoint for programmatic auto-login
 * This is used for API-based authentication flows
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, callbackUrl = '/profile?tab=bootcamps' } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if already authenticated
    const session = await getServerSession(authOptions);
    if (session) {
      // User is already logged in, return success with redirect URL
      return NextResponse.json({ 
        success: true, 
        message: 'Already authenticated', 
        redirectUrl: callbackUrl 
      });
    }

    try {
      // Import CosmosDB service for user lookup
      const { cosmosService } = await import('../../../../../lib/azure/cosmos-service');

      // Find user by email
      const user = await cosmosService.getUserByEmail(email.trim().toLowerCase());
      
      // User not found
      if (!user || !user.passwordHash) {
        console.warn(`[auth] User not found or no password: ${email}`);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      // Compare password
      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      
      // Password doesn't match
      if (!passwordValid) {
        console.warn(`[auth] Invalid password for: ${email}`);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      // Generate CSRF state token for the auto-login
      const csrfToken = createHash('sha256').update(email + Date.now()).digest('hex');
      const cookieStore = cookies();
      cookieStore.set('auto-login-state', csrfToken, { 
        maxAge: 60 * 5, // 5 minutes
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      });

      // Return success with the auth completion URL
      // The frontend will redirect the user to this URL to complete authentication
      return NextResponse.json({
        success: true,
        redirectUrl: `/auth/auto-login?email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}&state=${csrfToken}`,
      });

    } catch (error) {
      console.error('[auth] Error validating credentials:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Auto-login POST failed:', err);
    return NextResponse.json({ error: 'Auto login failed' }, { status: 500 });
  }
}