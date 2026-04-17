import type { MetadataRoute } from 'next'
import { getAllSpecies, getKingdoms } from '@/lib/api'
import { buildAlternates, buildLocalizedUrl } from '@/lib/routing-utils'
import { siteInfo } from '@/lib/strings/siteInfo'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url } = siteInfo
  const kingdoms = await getKingdoms()

  const staticPaths = ['/', ...kingdoms.map(k => `/${k.slug}`), '/explore', '/contact']

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(path => ({
    alternates: buildAlternates(url, path),
    url: buildLocalizedUrl(url, path, routing.defaultLocale),
  }))

  const allSpecies = await getAllSpecies().catch(() => ({ member: [] as Awaited<ReturnType<typeof getAllSpecies>>['member'] }))

  const slugByKingdom = new Map(kingdoms.map(k => [k.key, k.slug]))

  const speciesEntries: MetadataRoute.Sitemap = allSpecies.member.flatMap(species => {
    const kingdomSlug = slugByKingdom.get(species.family.kingdom)
    if (!species.slug || !kingdomSlug) {
      return []
    }
    const internalPath = `/${kingdomSlug}/[slug]`
    return [{
      alternates: buildAlternates(url, internalPath, { slug: species.slug }),
      url: buildLocalizedUrl(url, internalPath, routing.defaultLocale, { slug: species.slug }),
    }]
  })

  return [...staticEntries, ...speciesEntries]
}
