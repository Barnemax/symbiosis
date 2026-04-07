import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
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

export default withNextIntl(nextConfig)
