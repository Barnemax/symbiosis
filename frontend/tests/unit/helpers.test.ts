import { describe, it, expect, vi, afterEach } from 'vitest'
import { getCommonName, getRelationshipLabel, getTranslatedField, resolveMediaUrl } from '@/lib/helpers'
import type { Species } from '@/lib/types'

// Minimal Species fixture — only the fields the helper functions inspect.
function makeSpecies(overrides: Partial<Species> = {}): Species {
  return {
    commonNames: [
      { locale: 'en', name: 'Eurasian Jay' },
      { locale: 'fr', name: 'Geai des chênes' },
    ],
    conservationStatus: null,
    family: { id: 1, kingdom: 'bird', name: 'Corvidae' },
    habitat: null,
    id: 1,
    maxHeight: null,
    media: [],
    relationshipCount: 0,
    scientificName: 'Garrulus glandarius',
    slug: 'garrulus-glandarius',
    substrate: null,
    translations: [
      { habitat: 'Deciduous woodland', locale: 'en', substrate: null },
      { habitat: 'Forêt de feuillus', locale: 'fr', substrate: null },
    ],
    wingspan: null,
    ...overrides,
  } as Species
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('resolveMediaUrl', () => {
  it('prepends the API base URL to local /media/ paths', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8080')
    expect(resolveMediaUrl('/media/image/garrulus-glandarius.webp'))
      .toBe('http://localhost:8080/media/image/garrulus-glandarius.webp')
  })

  it('falls back to http://localhost:8080 when env var is not set', () => {
    delete process.env.NEXT_PUBLIC_API_URL
    expect(resolveMediaUrl('/media/audio/garrulus-glandarius.mp3'))
      .toBe('http://localhost:8080/media/audio/garrulus-glandarius.mp3')
  })

  it('returns external URLs unchanged', () => {
    const url = 'https://upload.wikimedia.org/wikipedia/commons/foo.jpg'
    expect(resolveMediaUrl(url)).toBe(url)
  })

  it('returns xeno-canto audio URLs unchanged', () => {
    const url = 'https://xeno-canto.org/sounds/uploaded/foo.mp3'
    expect(resolveMediaUrl(url)).toBe(url)
  })
})

describe('getCommonName', () => {
  it('returns the name for the requested locale', () => {
    expect(getCommonName(makeSpecies(), 'fr')).toBe('Geai des chênes')
  })

  it('defaults to English when locale is omitted', () => {
    expect(getCommonName(makeSpecies())).toBe('Eurasian Jay')
  })

  it('falls back to scientificName when the locale has no common name', () => {
    const species = makeSpecies({ commonNames: [{ locale: 'en', name: 'Eurasian Jay' }] })
    expect(getCommonName(species, 'fr')).toBe('Garrulus glandarius')
  })

  it('falls back to scientificName when commonNames is empty', () => {
    const species = makeSpecies({ commonNames: [] })
    expect(getCommonName(species, 'en')).toBe('Garrulus glandarius')
  })
})

describe('getRelationshipLabel', () => {
  it('returns the human-readable label for a known relationship type', () => {
    expect(getRelationshipLabel('nests_in')).toBe('Nests in')
    expect(getRelationshipLabel('feeds_on')).toBe('Feeds on')
    expect(getRelationshipLabel('mycorrhiza_with')).toBe('Mycorrhizal partner of')
  })

  it('formats unknown types: underscores → spaces, first letter capitalised', () => {
    expect(getRelationshipLabel('competes_with')).toBe('Competes with')
    expect(getRelationshipLabel('unknown')).toBe('Unknown')
  })
})

describe('getTranslatedField', () => {
  it('returns the translated value for the given locale', () => {
    expect(getTranslatedField(makeSpecies(), 'habitat', 'fr')).toBe('Forêt de feuillus')
  })

  it('falls back to the base species field when no translation exists for that locale', () => {
    const species = makeSpecies({ habitat: 'Oak forest', translations: [] })
    expect(getTranslatedField(species, 'habitat', 'fr')).toBe('Oak forest')
  })

  it('returns null when neither translation nor base field is set', () => {
    const species = makeSpecies({ habitat: null, translations: [] })
    expect(getTranslatedField(species, 'habitat', 'en')).toBeNull()
  })

  it('returns null when the translation field itself is null', () => {
    // Translation row exists for 'en' but habitat is null in that row
    const species = makeSpecies({ translations: [{ habitat: null, locale: 'en', substrate: null }] })
    expect(getTranslatedField(species, 'habitat', 'en')).toBeNull()
  })
})

