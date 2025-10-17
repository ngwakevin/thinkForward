/** @type {import('next').NextConfig} */

// Special CI configuration that completely disables Pages Router
const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Always use standalone output for Azure App Service deployment
  output: 'standalone',
  
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
