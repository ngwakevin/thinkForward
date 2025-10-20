import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';

// Authentication can work with Edge Runtime since we're now using jose for JWT
// But we'll keep using Node.js runtime for bcrypt compatibility
export const runtime = 'nodejs';

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
      console.warn('[auth/auto-login] Missing email or password in GET request');
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

    // Also generate a JWT token to enable both authentication mechanisms
    try {
      const { authCosmosService } = await import('../../../../../lib/azure/auth-cosmos-service');
      const user = await authCosmosService.getUserByEmail(email.trim().toLowerCase());
      
      if (user && user.passwordHash) {
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (isValidPassword) {
          // Create token payload
          const tokenPayload = {
            userId: user.id,
            email: user.email || '',
            name: user.name || undefined
          };
          
          // Generate access token (short-lived)
          const accessToken = await signAccessToken(tokenPayload);
          
          // Generate refresh token (long-lived)
          const refreshToken = await signRefreshToken({
            userId: user.id,
            email: user.email || ''
          });
          
          // Set access token as client-accessible cookie
          cookieStore.set('auth_token', accessToken, {
            maxAge: 60 * 15, // 15 minutes
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false, // Client code needs access
            sameSite: 'lax', // Allow cross-site requests for better compatibility
          });
          
          // Set refresh token as HttpOnly cookie
          cookieStore.set('refresh_token', refreshToken, {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true, // For security
            sameSite: 'lax' // Changed from strict for better compatibility
          });
          
          console.log('[auth/auto-login] Generated JWT token for user:', user.email);
        }
      }
    } catch (err) {
      console.error('[auth/auto-login] JWT generation error:', err);
      // Continue even if JWT fails - we'll fallback to NextAuth
    }

    // Redirect to a special page that will handle the login client-side
    // This avoids issues with credentials needing to be handled securely
    return NextResponse.redirect(
      new URL(`/auth/auto-login?email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}&state=${csrfToken}`, req.url)
    );
  } catch (error) {
    console.error('[auth/auto-login] GET failed:', error);
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
      console.warn('[auth/auto-login] Missing email or password in POST request');
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
      const { authCosmosService } = await import('../../../../../lib/azure/auth-cosmos-service');

      // Find user by email
      const user = await authCosmosService.getUserByEmail(email.trim().toLowerCase());
      
      // User not found
      if (!user || !user.passwordHash) {
        console.warn(`[auth/auto-login] User not found or no password: ${email}`);
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      // Compare password
      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      
      // Password doesn't match
      if (!passwordValid) {
        console.warn(`[auth/auto-login] Invalid password for: ${email}`);
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
      
      // Create token payload
      const tokenPayload = {
        userId: user.id,
        email: user.email || '',
        name: user.name || undefined
      };
      
      // Generate access token (short-lived)
      const accessToken = await signAccessToken(tokenPayload);
      
      // Generate refresh token (long-lived)
      const refreshToken = await signRefreshToken({
        userId: user.id,
        email: user.email || ''
      });
      
      // Set access token as client-accessible cookie
      cookieStore.set('auth_token', accessToken, {
        maxAge: 60 * 15, // 15 minutes
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false, // Client code needs access
        sameSite: 'lax', // Allow cross-site requests for better compatibility
      });
      
      // Set refresh token as HttpOnly cookie
      cookieStore.set('refresh_token', refreshToken, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true, // For security
        sameSite: 'lax' // Changed from strict for better compatibility
      });

      console.log('[auth/auto-login] Generated JWT token for user:', user.email);

      // Return success with the auth completion URL
      // The frontend will redirect the user to this URL to complete authentication
      return NextResponse.json({
        success: true,
        token: accessToken, // Include the access token in response
        redirectUrl: `/auth/auto-login?email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}&state=${csrfToken}`,
      });

    } catch (error) {
      console.error('[auth/auto-login] Error validating credentials:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
  } catch (err: any) {
    console.error('[auth/auto-login] POST failed:', err);
    return NextResponse.json({ error: 'Auto login failed' }, { status: 500 });
  }
}