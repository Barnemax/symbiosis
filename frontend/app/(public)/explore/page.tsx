import { getAllSpecies, getGraphRelationships } from '@/lib/api'
import RelationshipGraph, { type GraphNode, type GraphLink } from '@/components/RelationshipGraph'
import { getCommonName, resolveMediaUrl } from '@/lib/helpers'

export default async function ExplorePage(): Promise<React.JSX.Element> {
  const [{ member: species }, { member: relationships }] = await Promise.all([
    getAllSpecies(),
    getGraphRelationships(),
  ])

  // Count degrees so we can size nodes
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
        name: getCommonName(s),
        scientific: s.scientificName,
        slug: s.slug ?? s.scientificName,
      }
    })

  // Assign curvature so edges sharing a node fan out instead of stacking
  const rawLinks = relationships.map(rel => ({
    label: rel.type.replace(/_/g, ' '),
    source: rel.subject.id,
    target: rel.object.id,
  }))

  // Count how many links touch each node as target, then assign spread curvatures
  const targetGroups = new Map<number, typeof rawLinks>()
  for (const link of rawLinks) {
    const group = targetGroups.get(link.target) ?? []
    group.push(link)
    targetGroups.set(link.target, group)
  }

  const links: GraphLink[] = rawLinks.map(link => {
    const group = targetGroups.get(link.target) ?? []
    const idx = group.indexOf(link)
    const spread = 0.25
    const curvature = group.length > 1
      ? spread * (idx - (group.length - 1) / 2) / Math.max(1, (group.length - 1) / 2)
      : 0
    return { curvature, ...link }
  })

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">Ecological network</h1>
        <p className="mt-1 text-sm text-stone-500">
          {nodes.length} species · {links.length} relationships · click to zoom · double-click to open
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-stone-200">
        <RelationshipGraph nodes={nodes} links={links} />
      </div>
    </main>
  )
}
