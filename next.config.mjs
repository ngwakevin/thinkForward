/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    mdxRs: true
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
