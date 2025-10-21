/** @type {import('next').NextConfig} */

const nextConfig = {
  // Completely disable Pages Router to avoid _document.js issues
  useFileSystemPublicRoutes: false,
  // Avoid loading any pages from /pages directory
  pageExtensions: ['skip.tsx', 'skip.ts'],
  // Output standalone build for production
  output: 'standalone',
  // Other standard settings
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Disable source maps for faster builds
  productionBrowserSourceMaps: false,
  
  // Avoid experimental features that might cause issues
  experimental: {
    serverMinification: false,
    serverSourceMaps: false,
  }
};

export default nextConfig;