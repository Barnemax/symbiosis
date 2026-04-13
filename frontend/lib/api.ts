import type { Family, HydraCollection, Species, Relationship, GraphRelationship } from './types'

// Server components use API_INTERNAL_URL (Docker network), browser uses NEXT_PUBLIC_API_URL.
//
// Caching strategy:
//   revalidate: false + tags  → public reads; cached forever, busted via revalidateTag() on mutation
//   revalidate: 0             → admin reads; never cached so editors always see fresh data
export const API_URL = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/ld+json' },
    next: { revalidate: false }, // cache indefinitely; bust via revalidateTag on mutation
    ...init,
  })
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`)
  }
  return res.json() as Promise<T>
}

const PAGE_SIZE = 30

export async function getSpecies(params?: {
  kingdom?: string
  page?: number
  search?: string
  sort?: string
}): Promise<HydraCollection<Species>> {
  const query = new URLSearchParams()
  if (params?.kingdom) {
    query.set('family.kingdom', params.kingdom)
  }
  if (params?.page && params.page > 1) {
    query.set('page', String(params.page))
  }
  if (params?.search) {
    query.set('commonNames.name', params.search)
  }
  if (params?.sort === 'links') {
    query.set('order[relationshipCount]', 'desc')
  } else {
    query.set('order[scientificName]', 'asc')
  }
  const qs = query.size ? `?${query}` : ''
  return apiFetch(`/api/species${qs}`, { next: { revalidate: false, tags: ['species'] } })
}

export { PAGE_SIZE }

export async function getKingdomCounts(): Promise<Record<string, number>> {
  const [birds, trees, fungi] = await Promise.all([
    apiFetch<HydraCollection<Species>>('/api/species?family.kingdom=bird&itemsPerPage=1', { next: { revalidate: false, tags: ['species'] } }),
    apiFetch<HydraCollection<Species>>('/api/species?family.kingdom=tree&itemsPerPage=1', { next: { revalidate: false, tags: ['species'] } }),
    apiFetch<HydraCollection<Species>>('/api/species?family.kingdom=fungus&itemsPerPage=1', { next: { revalidate: false, tags: ['species'] } }),
  ])
  return { bird: birds.totalItems, fungus: fungi.totalItems, tree: trees.totalItems }
}

export async function getSpeciesBySlug(kingdom: string, slug: string): Promise<Species> {
  const data = await apiFetch<HydraCollection<Species>>(
    `/api/species?family.kingdom=${kingdom}&slug=${encodeURIComponent(slug)}`,
    { next: { revalidate: false, tags: ['species'] } },
  )
  const species = data.member.at(0)
  if (species == null) {
    throw new Error(`Species not found: ${slug}`)
  }
  return species
}

export async function getSpeciesByIds(ids: number[]): Promise<HydraCollection<Species>> {
  if (ids.length === 0) {
    return { member: [], totalItems: 0 }
  }
  const qs = ids.map(id => `id[]=${id}`).join('&')
  return apiFetch(`/api/species?${qs}&pagination=false`, { next: { revalidate: false, tags: ['species'] } })
}

export async function getRelationshipsForSpecies(id: number | string): Promise<{
  asSubject: Relationship[]
  asObject: Relationship[]
}> {
  const [subjectData, objectData] = await Promise.all([
    apiFetch<HydraCollection<Relationship>>(`/api/relationships?subject=${id}&pagination=false`, { next: { revalidate: false, tags: ['relationships'] } }),
    apiFetch<HydraCollection<Relationship>>(`/api/relationships?object=${id}&pagination=false`, { next: { revalidate: false, tags: ['relationships'] } }),
  ])
  return { asObject: objectData.member, asSubject: subjectData.member }
}

export async function getFamilies(): Promise<HydraCollection<Family>> {
  return apiFetch('/api/families?pagination=false', { next: { revalidate: 0 } })
}

export async function getAllSpecies(): Promise<HydraCollection<Species>> {
  return apiFetch('/api/species?pagination=false', { next: { revalidate: false, tags: ['species'] } })
}

export async function getSpeciesById(id: number | string): Promise<Species> {
  return apiFetch(`/api/species/${id}`, { next: { revalidate: 0 } })
}

export async function getSpeciesBySlugAdmin(slug: string): Promise<Species> {
  const data = await apiFetch<HydraCollection<Species>>(
    `/api/species?slug=${encodeURIComponent(slug)}`,
    { next: { revalidate: 0 } },
  )
  const species = data.member.at(0)
  if (species == null) {
    throw new Error(`Species not found: ${slug}`)
  }
  return species
}

export async function getAllRelationships(): Promise<HydraCollection<Relationship>> {
  return apiFetch('/api/relationships?pagination=false', { next: { revalidate: false, tags: ['relationships'] } })
}

export async function getGraphRelationships(): Promise<HydraCollection<GraphRelationship>> {
  return apiFetch('/api/relationships/graph', { next: { revalidate: false, tags: ['relationships'] } })
}

export async function getRelationshipById(id: number | string): Promise<Relationship> {
  return apiFetch(`/api/relationships/${id}`, { next: { revalidate: 0 } })
}

export async function getRelationshipTypes(): Promise<string[]> {
  const data = await apiFetch<{ types: string[] }>('/api/relationship-types', {
    next: { revalidate: false, tags: ['relationship-types'] },
  })
  return data.types
}
