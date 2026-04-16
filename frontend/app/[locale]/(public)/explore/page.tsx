import { getAllSpecies, getGraphRelationships } from '@/lib/api'
import RelationshipGraph, { type GraphNode, type GraphLink } from '@/components/RelationshipGraph'
import { getCommonName, resolveMediaUrl } from '@/lib/helpers'
import type { AppLocale } from '@/lib/types'
import { getTranslations, getLocale } from 'next-intl/server'

export default async function ExplorePage(): Promise<React.JSX.Element> {
  const [t, tRel, locale, { member: species }, { member: relationships }] = await Promise.all([
    getTranslations('explore'),
    getTranslations('relationships'),
    getLocale(),
    getAllSpecies(),
    getGraphRelationships(),
  ])

  const l = locale as AppLocale

  const degree: Record<number, number> = {}
  for (const rel of relationships) {
    degree[rel.subject.id] = (degree[rel.subject.id] ?? 0) + 1
    degree[rel.object.id] = (degree[rel.object.id] ?? 0) + 1
  }

  const nodes: GraphNode[] = species
    .filter(s => (degree[s.id] ?? 0) > 0)
    .map(s => {
      const imageMedia = s.media.find(m => m.type === 'image')
      return {
        degree: degree[s.id] ?? 0,
        id: s.id,
        imageUrl: imageMedia ? resolveMediaUrl(imageMedia.url) : undefined,
        kingdom: s.family.kingdom,
        name: getCommonName(s, l),
        scientific: s.scientificName,
        slug: s.slug ?? s.scientificName,
      }
    })

  // Merge parallel relationships between the same pair of species into one link
  const pairMap = new Map<string, string[]>()
  for (const rel of relationships) {
    const key = [Math.min(rel.subject.id, rel.object.id), Math.max(rel.subject.id, rel.object.id)].join('-')
    const labels = pairMap.get(key) ?? []
    labels.push(tRel(rel.type))
    pairMap.set(key, labels)
  }

  // Deduplicate by source-target pair, keeping direction of the first occurrence
  const seen = new Set<string>()
  const mergedLinks: { source: number; target: number; label: string }[] = []
  for (const rel of relationships) {
    const key = [Math.min(rel.subject.id, rel.object.id), Math.max(rel.subject.id, rel.object.id)].join('-')
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    mergedLinks.push({
      label: pairMap.get(key)!.join(', '),
      source: rel.subject.id,
      target: rel.object.id,
    })
  }

  const links: GraphLink[] = mergedLinks.map(link => ({ curvature: 0, ...link }))

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-stone-500">
          {t('subtitle', { relationships: links.length, species: nodes.length })}
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-stone-200">
        <RelationshipGraph nodes={nodes} links={links} />
      </div>
    </main>
  )
}
