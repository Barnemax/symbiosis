export const siteInfo = {
  githubRepo: 'https://github.com/Barnemax/symbiosis',
  name: 'Symbiosis',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
}

export const requestHeaders = `${siteInfo.name}/1.0 (${siteInfo.githubRepo}; educational project)`