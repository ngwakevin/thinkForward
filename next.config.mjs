// Load build configuration
import './lib/build-config.js';
import path from 'path';
import fs from 'fs';

// Detect if we're running in Azure App Service
const isAzureAppService = !!process.env.WEBSITE_SITE_NAME;

// Determine the appropriate temp directory
let tempDir = '/tmp';
if (isAzureAppService) {
  // In Azure App Service, use a writable directory
  tempDir = process.env.NEXT_TEMP_DIR || '/home/site/next-temp';
  
  // Create the temp directory if it doesn't exist
  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log(`Created temp directory: ${tempDir}`);
    }
    
    // Also create .next directory inside it
    const nextDir = path.join(tempDir, '.next');
    if (!fs.existsSync(nextDir)) {
      fs.mkdirSync(nextDir, { recursive: true });
      console.log(`Created .next directory: ${nextDir}`);
    }
  } catch (error) {
    console.warn(`Failed to create temp directory: ${error.message}`);
  }
}

// Log the directory that will be used
console.log(`Using temp directory: ${tempDir}`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    mdxRs: true,
    // Configure a writable temp directory for Azure App Service
    serverComponentsExternalPackages: ['sharp']
  },
  // Adjust output caching for Azure App Service (read-only file system)
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  generateEtags: true,
  poweredByHeader: false,
  // Configure temp directory for Azure App Service read-only filesystem
  distDir: process.env.NODE_ENV === 'production' && isAzureAppService 
    ? process.env.NEXT_DIST_DIR || path.join(tempDir, '.next') 
    : '.next',
  // Allow Next.js to use custom dist directory in Azure
  useFileSystemPublicRoutes: true,
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
