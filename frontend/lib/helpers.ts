import type { CommonName, RelationshipSpecies, Species, SpeciesTranslation } from './types'
import { RELATIONSHIP_LABELS } from './constants'

/** Returns the display label for a relationship type, falling back to a formatted version of the raw string. */
export function getRelationshipLabel(type: string): string {
  return RELATIONSHIP_LABELS[type] ?? type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())
}

export function getCommonName(species: Species | RelationshipSpecies, locale: CommonName['locale'] = 'en'): string {
  return species.commonNames.find(n => n.locale === locale)?.name ?? species.scientificName
}

export function getTranslatedField(
  species: Species,
  field: keyof Pick<SpeciesTranslation, 'habitat' | 'substrate'>,
  locale: string,
): string | null {
  return species.translations.find(t => t.locale === locale)?.[field] ?? species[field] ?? null
}

/**
 * Resolves a media URL. Local paths (/media/...) are served by the API server,
 * so the public API base URL is prepended for the browser to reach them.
 */
export function resolveMediaUrl(url: string): string {
  if (url.startsWith('/media/')) {
    return `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}${url}`
  }
  return url
}
