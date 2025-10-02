/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
