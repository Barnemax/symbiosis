import { describe, it, expect, vi, afterEach } from 'vitest'
import { buildTaxonSchema } from '@/lib/schemas'
import type { Relationship, Species } from '@/lib/types'

afterEach(() => {
  vi.unstubAllEnvs()
})

function makeSpecies(overrides: Partial<Species> = {}): Species {
  return {
    '@id': '/api/species/1',
    commonNames: [
      { '@id': '/api/common-names/1', locale: 'en', name: 'Eurasian Jay' },
      { '@id': '/api/common-names/2', locale: 'fr', name: 'Geai des chênes' },
    ],
    conservationStatus: null,
    family: { '@id': '/api/families/1', id: 1, kingdom: 'bird', name: 'Corvidae' },
    habitat: null,
    id: 1,
    maxHeight: null,
    media: [],
    relationshipCount: 0,
    scientificName: 'Garrulus glandarius',
    slug: 'garrulus-glandarius',
    substrate: null,
    translations: [],
    wingspan: null,
    ...overrides,
  }
}

function makeRelationship(overrides: Partial<Relationship> = {}): Relationship {
  const subject = makeSpecies()
  const object = makeSpecies({
    '@id': '/api/species/2',
    commonNames: [{ '@id': '/api/common-names/3', locale: 'en', name: 'Pedunculate Oak' }],
    family: { '@id': '/api/families/2', id: 2, kingdom: 'tree', name: 'Fagaceae' },
    id: 2,
    scientificName: 'Quercus robur',
    slug: 'quercus-robur',
  })
  return {
    '@id': '/api/relationships/1',
    id: 1,
    notes: null,
    object,
    subject,
    translations: [],
    type: 'nests_in',
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Core shape
// ---------------------------------------------------------------------------

describe('buildTaxonSchema — core shape', () => {
  it('sets the correct @context and @type', () => {
    const schema = buildTaxonSchema(makeSpecies(), []) as Record<string, unknown>
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Taxon')
  })

  it('uses the English common name as name', () => {
    const schema = buildTaxonSchema(makeSpecies(), []) as Record<string, unknown>
    expect(schema.name).toBe('Eurasian Jay')
  })

  it('uses scientificName as alternateName', () => {
    const schema = buildTaxonSchema(makeSpecies(), []) as Record<string, unknown>
    expect(schema.alternateName).toBe('Garrulus glandarius')
  })

  it('sets taxonRank to "species"', () => {
    const schema = buildTaxonSchema(makeSpecies(), []) as Record<string, unknown>
    expect(schema.taxonRank).toBe('species')
  })

  it('builds the Wikipedia sameAs URL, replacing spaces with underscores', () => {
    const schema = buildTaxonSchema(makeSpecies(), []) as Record<string, unknown>
    expect(schema.sameAs).toBe('https://en.wikipedia.org/wiki/Garrulus_glandarius')
  })

  it('includes the family name and rank in parentTaxon', () => {
    const schema = buildTaxonSchema(makeSpecies(), []) as Record<string, unknown>
    const parent = schema.parentTaxon as Record<string, unknown>
    expect(parent['@type']).toBe('Taxon')
    expect(parent.name).toBe('Corvidae')
    expect(parent.taxonRank).toBe('family')
  })

  it('builds the canonical EN url using the species slug', () => {
    const schema = buildTaxonSchema(makeSpecies(), []) as Record<string, unknown>
    expect(schema.url).toContain('/birds/garrulus-glandarius')
    expect(schema.url).not.toContain('/fr/')
  })

  it('falls back to the numeric id in the url when slug is null', () => {
    const species = makeSpecies({ slug: null })
    const schema = buildTaxonSchema(species, []) as Record<string, unknown>
    expect(schema.url).toContain('/birds/1')
  })
})

// ---------------------------------------------------------------------------
// Image
// ---------------------------------------------------------------------------

describe('buildTaxonSchema — image', () => {
  it('omits image when species has no media', () => {
    const schema = buildTaxonSchema(makeSpecies({ media: [] }), []) as Record<string, unknown>
    expect(schema).not.toHaveProperty('image')
  })

  it('omits image when species only has non-image media', () => {
    const species = makeSpecies({
      media: [{ '@id': '/api/media/1', credit: null, type: 'audio', url: 'https://xeno-canto.org/foo.mp3' }],
    })
    const schema = buildTaxonSchema(species, []) as Record<string, unknown>
    expect(schema).not.toHaveProperty('image')
  })

  it('includes the resolved image URL when an image media entry exists', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8080')
    const species = makeSpecies({
      media: [{ '@id': '/api/media/1', credit: null, type: 'image', url: '/media/image/garrulus-glandarius.webp' }],
    })
    const schema = buildTaxonSchema(species, []) as Record<string, unknown>
    expect(schema.image).toBe('http://localhost:8080/media/image/garrulus-glandarius.webp')
  })
})

// ---------------------------------------------------------------------------
// Relationships (additionalProperty)
// ---------------------------------------------------------------------------

describe('buildTaxonSchema — additionalProperty', () => {
  it('omits additionalProperty when asSubject is empty', () => {
    const schema = buildTaxonSchema(makeSpecies(), []) as Record<string, unknown>
    expect(schema).not.toHaveProperty('additionalProperty')
  })

  it('creates one PropertyValue entry per relationship', () => {
    const schema = buildTaxonSchema(makeSpecies(), [makeRelationship()]) as Record<string, unknown>
    const props = schema.additionalProperty as unknown[]
    expect(props).toHaveLength(1)
  })

  it('formats the relationship type as the property name', () => {
    const schema = buildTaxonSchema(makeSpecies(), [makeRelationship()]) as Record<string, unknown>
    const prop = (schema.additionalProperty as Record<string, unknown>[])[0]
    expect(prop['@type']).toBe('PropertyValue')
    expect(prop.name).toBe('nests in')
  })

  it('uses the object English common name as value', () => {
    const schema = buildTaxonSchema(makeSpecies(), [makeRelationship()]) as Record<string, unknown>
    const prop = (schema.additionalProperty as Record<string, unknown>[])[0]
    expect(prop.value).toBe('Pedunculate Oak')
  })

  it('embeds a valueReference Taxon for the related species', () => {
    const schema = buildTaxonSchema(makeSpecies(), [makeRelationship()]) as Record<string, unknown>
    const prop = (schema.additionalProperty as Record<string, unknown>[])[0]
    const ref = prop.valueReference as Record<string, unknown>
    expect(ref['@type']).toBe('Taxon')
    expect(ref.alternateName).toBe('Quercus robur')
    expect(ref.name).toBe('Pedunculate Oak')
    expect(ref.url).toContain('/trees/quercus-robur')
  })

  it('handles multiple relationships', () => {
    const rel2 = makeRelationship({
      '@id': '/api/relationships/2',
      id: 2,
      object: makeSpecies({
        '@id': '/api/species/3',
        commonNames: [{ '@id': '/api/common-names/4', locale: 'en', name: 'Fly Agaric' }],
        family: { '@id': '/api/families/3', id: 3, kingdom: 'fungus', name: 'Amanitaceae' },
        id: 3,
        scientificName: 'Amanita muscaria',
        slug: 'amanita-muscaria',
      }),
      type: 'feeds_on',
    })
    const schema = buildTaxonSchema(makeSpecies(), [makeRelationship(), rel2]) as Record<string, unknown>
    const props = schema.additionalProperty as Record<string, unknown>[]
    expect(props).toHaveLength(2)
    expect(props[1].value).toBe('Fly Agaric')
  })
})
