// Load build configuration
import './lib/build-config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    mdxRs: true
  },
  // Adjust output caching for Azure App Service (read-only file system)
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  generateEtags: true,
  poweredByHeader: false,
  // Disable file system caching in production for Azure App Service
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 5,
  },
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

export default nextConfig;
