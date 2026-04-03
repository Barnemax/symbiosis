import type { AppLocale } from '@/i18n/routing'

export type { AppLocale }
export type Kingdom = 'bird' | 'tree' | 'fungus'

export type ConservationStatus = 'EX' | 'EW' | 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'DD' | 'NE'

export interface Family {
  '@id': string
  id: number
  name: string
  kingdom: Kingdom
}

export interface CommonName {
  '@id': string
  locale: AppLocale | 'la'
  name: string
}

export interface SpeciesTranslation {
  locale: AppLocale
  habitat: string | null
  substrate: string | null
}

export interface Media {
  '@id': string
  type: 'image' | 'audio' | 'leaf'
  url: string
  credit: string | null
}

export interface Species {
  '@id': string
  id: number
  scientificName: string
  slug: string | null
  family: Family
  conservationStatus: ConservationStatus | null
  habitat: string | null
  wingspan: number | null
  maxHeight: number | null
  substrate: string | null
  commonNames: CommonName[]
  translations: SpeciesTranslation[]
  media: Media[]
  relationshipCount: number
}

export interface RelationshipTranslation {
  locale: AppLocale
  notes: string | null
}

export interface Relationship {
  '@id': string
  id: number
  subject: Species
  object: Species
  type: string
  notes: string | null
  translations: RelationshipTranslation[]
}

// Lightweight shape returned by /api/relationships/graph, no full species data
export interface GraphRelationship {
  subject: { id: number }
  object: { id: number }
  type: string
}

export interface HydraCollection<T> {
  member: T[]
  totalItems: number
}
