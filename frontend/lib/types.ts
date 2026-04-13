import type { components } from './api-types'

type Schemas = components['schemas']

export type Kingdom = Schemas['Family-species.read']['kingdom']
export type ConservationStatus = NonNullable<Schemas['Species-species.read']['conservationStatus']>

export type Family = Schemas['Family-species.read']
export type CommonName = Schemas['CommonName-species.read']
export type SpeciesTranslation = Schemas['SpeciesTranslation-species.read']
export type Media = Schemas['Media-species.read']
export type Species = Schemas['Species-species.read']

export type RelationshipSpecies = Schemas['Species-relationship.read']
export type RelationshipTranslation = Schemas['RelationshipTranslation-relationship.read']
export type Relationship = Schemas['Relationship-relationship.read']
export type GraphRelationship = Schemas['Relationship-relationship.graph']

export type HydraCollection<T> = Schemas['HydraCollectionBaseSchemaNoPagination'] & {
  totalItems: number
  member: T[]
}

export type { AppLocale } from '@/i18n/routing'
