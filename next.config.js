/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // keep for Azure
  // prevent missing webpack-runtime references
  webpack(config) {
    config.output.filename = 'static/chunks/[name].js';
    return config;
  },
};

export default nextConfig;