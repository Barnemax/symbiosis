import type { MetadataRoute } from 'next'
import { siteInfo } from '@/lib/strings/siteInfo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ allow: '/', disallow: '/admin', userAgent: '*' }],
    sitemap: `${siteInfo.url}/sitemap.xml`,
  }
}
