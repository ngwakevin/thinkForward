/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produce a smaller self-contained server bundle for deployment to App Service.
  // This lets us copy only the standalone output + static assets in CI.
  output: 'standalone',
  experimental: {
    typedRoutes: true,
    mdxRs: true
  },
  // Enhanced security settings
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable compression for better performance
  // Configure headers for routes not covered by middleware
  async headers() {
    return [
      {
        // Apply these headers to all routes that don't match middleware
        source: '/(api|_next|static)/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/platform',
        destination: '/courses',
        permanent: true
      },
      // Security redirects
      {
        source: '/admin',
        destination: '/protected/admin',
        permanent: true
      },
      // HTTPS redirect is handled by middleware and hosting platform
    ];
  },
  // Configure cookies for better security
  serverRuntimeConfig: {
    // Server-only runtime config
    cookiePrefix: 'tf_',
    secureCookies: process.env.NODE_ENV === 'production',
  },
  publicRuntimeConfig: {
    // Config available on both server and client
    apiBaseUrl: process.env.API_BASE_URL || '',
  }
};

export default nextConfig;
