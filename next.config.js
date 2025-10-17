/** @type {import('next').NextConfig} */

// Import the main configuration
import mainConfig from './next.config.mjs';

// Determine if we're in a CI environment
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

// Basic configuration that works in all environments
const baseConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  output: 'standalone', // keep for Azure
  
  // prevent missing webpack-runtime references
  webpack: (config, { isServer }) => {
    // Set consistent output filenames
    config.output.filename = 'static/chunks/[name].js';
    
    // Handle Node.js built-in modules in browser
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
  }
};

// Use the appropriate config based on environment
const nextConfig = isCI 
  ? {
      ...baseConfig,
      // In CI, disable Pages Router completely to avoid _document.js issues
      useFileSystemPublicRoutes: false,
      productionBrowserSourceMaps: false,
    }
  : {
      ...baseConfig,
      // In development/production, keep Pages Router enabled
      useFileSystemPublicRoutes: true,
      productionBrowserSourceMaps: true,
      // Regular environment can use standard settings
      onDemandEntries: {
        maxInactiveAge: 60 * 1000, // 1 minute
        pagesBufferLength: 5,
      }
    };

export default nextConfig;