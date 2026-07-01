import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Allow next/image to load self-hosted media served by the API (e.g. /media/... on
// the backend domain), derived from the public API URL so it isn't hardcoded.
const apiUrl = process.env.NEXT_PUBLIC_API_URL
const apiImagePattern = apiUrl
  ? [{ protocol: new URL(apiUrl).protocol.replace(':', '') as 'http' | 'https', hostname: new URL(apiUrl).hostname }]
  : []

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
      ...apiImagePattern,
    ],
  },
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
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
