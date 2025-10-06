// Use NextAuth's built-in middleware for protecting specific routes.
export { default } from 'next-auth/middleware';

// Only protect /protected/* for now. Add others as needed.
export const config = { matcher: ['/protected/:path*', '/api/community/:path*'] };
