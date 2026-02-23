import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    API_INTERNAL_URL: process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  },
  images: {
    remotePatterns: [
      {
        hostname: 'upload.wikimedia.org',
        protocol: 'https',
      },
    ],
  },
}

export default nextConfig
