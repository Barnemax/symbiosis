import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

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
  output: 'standalone',
}

export default withSentryConfig(withNextIntl(nextConfig), {
  org: 'barnemax',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  tunnelRoute: '/monitoring',
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
  widenClientFileUpload: true,
})
