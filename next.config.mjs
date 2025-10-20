/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  // In Next.js 14.2.5, the App Router is stable and doesn't require experimental flag
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Enable both app and pages router
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
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
