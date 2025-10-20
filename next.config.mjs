/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  // Try to disable Pages Router completely
  useFileSystemPublicRoutes: false,
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Use .page extension to avoid conflicts with app router
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  
  // Disable source maps in CI for faster builds
  productionBrowserSourceMaps: false,
  
  // Simplified webpack configuration
  webpack: (config, { isServer }) => {
    config.output.filename = 'static/chunks/[name].js';
    
    // Avoid Node.js module imports on the client side
    if (!isServer) {
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
};

export default nextConfig;
