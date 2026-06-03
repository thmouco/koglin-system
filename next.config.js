/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    serverComponentsExternalPackages: ['twilio'],
  },
}

module.exports = nextConfig
