/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // keep for Azure
  experimental: {
    appDir: true, // ensures correct app router build
  },
  // prevent missing webpack-runtime references
  webpack(config) {
    config.output.filename = 'static/chunks/[name].js';
    return config;
  },
};

module.exports = nextConfig;