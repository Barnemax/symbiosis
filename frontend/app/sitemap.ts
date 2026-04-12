import type { MetadataRoute } from 'next'
import { getAllSpecies } from '@/lib/api'
import { KINGDOMS } from '@/lib/constants'
import { buildAlternates, buildLocalizedUrl } from '@/lib/routing-utils'
import { siteInfo } from '@/lib/strings/siteInfo'
import { routing } from '@/i18n/routing'

const STATIC_PATHS = ['/', '/birds', '/trees', '/fungi', '/explore', '/contact'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url } = siteInfo

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(path => ({
    alternates: buildAlternates(url, path),
    url: buildLocalizedUrl(url, path, routing.defaultLocale),
  }))

  const allSpecies = await getAllSpecies().catch(() => ({ member: [] as Awaited<ReturnType<typeof getAllSpecies>>['member'] }))

  const speciesEntries: MetadataRoute.Sitemap = allSpecies.member.flatMap(species => {
    if (!species.slug) {
return []
}
    const internalPath = `${KINGDOMS[species.family.kingdom].href}/[slug]`
    return [{
      alternates: buildAlternates(url, internalPath, { slug: species.slug }),
      url: buildLocalizedUrl(url, internalPath, routing.defaultLocale, { slug: species.slug }),
    }]
  })

  return [...staticEntries, ...speciesEntries]
}
