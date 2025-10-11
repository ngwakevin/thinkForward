/**
 * Simplified Next.js configuration for Azure App Service
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    mdxRs: true,
  },
  // Use standalone output for Azure App Service
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  generateEtags: true,
  poweredByHeader: false,
  // Set custom dist directory for Azure App Service (if needed)
  distDir: process.env.NEXT_DIST_DIR ? process.env.NEXT_DIST_DIR : '.next',
  // Handle Node.js built-in modules
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        'fs/promises': false,
        child_process: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        os: false,
        path: false,
      };
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: '/platform',
        destination: '/courses',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;