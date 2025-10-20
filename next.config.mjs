/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Disable source maps in CI for faster builds
  productionBrowserSourceMaps: false,
  
  // Keep webpack defaults for filenames to avoid Next internal resolution issues
  webpack: (config, { isServer }) => {
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
