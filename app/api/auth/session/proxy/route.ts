import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Custom session proxy endpoint for Azure App Service
 * This ensures proper session handling behind Azure's reverse proxy
 */
export async function GET(req: NextRequest) {
  // Get the cookies from the request
  const cookieStore = cookies();
  // Try common NextAuth cookie names to be robust across environments
  const sessionCookie =
    cookieStore.get('__Secure-next-auth.session-token')?.value ||
    cookieStore.get('__Host-next-auth.session-token')?.value ||
    cookieStore.get('next-auth.session-token')?.value ||
    '';

  // Construct the URL for the actual NextAuth session endpoint
  const apiUrl = process.env.NEXTAUTH_URL_INTERNAL || process.env.NEXTAUTH_URL || '';
  const sessionUrl = new URL('/api/auth/session', apiUrl);

  // Call the NextAuth session endpoint with the cookies
  const response = await fetch(sessionUrl, {
    headers: {
      // Forward the cookie value under the secure name; NextAuth will parse it
      Cookie: `__Secure-next-auth.session-token=${sessionCookie}`,
    },
  });

  // Return the response from the NextAuth session endpoint
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}