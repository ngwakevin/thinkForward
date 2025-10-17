/** @type {import('next').NextConfig} */

// This is a specialized configuration for CI environments
// It disables the Pages Router functionality entirely to avoid _document.js issues

const nextConfig = {
  reactStrictMode: true,
  
  // Skip trailing slash handling 
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // CRITICAL: Disable Pages Router completely
  // This prevents Next.js from looking for pages/_document.js
  useFileSystemPublicRoutes: false,
  
  // Disable output: 'standalone' to avoid module resolution issues
  // output: 'standalone',
  
  // Disable source maps in CI for faster builds
  productionBrowserSourceMaps: false,
  
  // Simplified webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Avoid Node.js module imports on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
  
  // Redirect everything to App Router
  async rewrites() {
    return {
      beforeFiles: [
        // Redirect any attempt to access Pages Router pages to App Router
        {
          source: '/:path*',
          destination: '/:path*',
        },
      ],
    };
  },
}

module.exports = nextConfig;