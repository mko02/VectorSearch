/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'formidable'];
    return config;
  },
}

module.exports = nextConfig 