import NextAuth from 'next-auth';
// Import build config to ensure environment variables are set properly
import '../../../../lib/build-config';
import { authOptions } from '../../../../lib/auth';

// Configure NextAuth to work with Azure App Service's reverse proxy
// This helps ensure NextAuth properly detects HTTPS behind Azure's proxy
process.env.NEXTAUTH_URL_INTERNAL = process.env.NEXTAUTH_URL || `https://${process.env.WEBSITE_HOSTNAME}`;

// For Azure App Service, we need to ensure correct proxy handling
if (process.env.WEBSITE_HOSTNAME) {
  console.log(`Running in Azure App Service: ${process.env.WEBSITE_HOSTNAME}`);
  // Force secure cookies when behind Azure's proxy
  process.env.NEXTAUTH_URL = `https://${process.env.WEBSITE_HOSTNAME}`;
}

// NextAuth handler for App Router (supports GET/POST)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
