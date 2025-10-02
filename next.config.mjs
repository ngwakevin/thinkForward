/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produce a smaller self-contained server bundle for deployment to App Service.
  // This lets us copy only the standalone output + static assets in CI.
  output: 'standalone',
  experimental: {
    typedRoutes: true,
    mdxRs: true
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
