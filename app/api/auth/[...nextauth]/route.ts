import NextAuth from 'next-auth';
// Import build config to ensure environment variables are set properly
import '../../../../lib/build-config';
import { authOptions } from '../../../../lib/auth';

// NextAuth handler for App Router (supports GET/POST)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
