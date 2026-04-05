import { describe, it, expect } from 'vitest'
import { buildLocalizedUrl, buildAlternates } from '@/lib/routing-utils'

// Uses the real routing.ts:
//   defaultLocale: 'en', locales: ['en', 'fr'], localePrefix: 'as-needed'
//   '/birds' → { en: '/birds', fr: '/oiseaux' }
//   '/birds/[slug]' → { en: '/birds/[slug]', fr: '/oiseaux/[slug]' }
//   '/contact' → '/contact'  (same string for all locales)

const SITE = 'https://example.com'

describe('buildLocalizedUrl', () => {
  describe('default locale (en) — no prefix', () => {
    it('resolves a localised static path', () => {
      expect(buildLocalizedUrl(SITE, '/birds', 'en')).toBe('https://example.com/birds')
    })

    it('resolves a path with a [slug] param', () => {
      expect(buildLocalizedUrl(SITE, '/birds/[slug]', 'en', { slug: 'alcedo-atthis' }))
        .toBe('https://example.com/birds/alcedo-atthis')
    })

    it('resolves the root path', () => {
      expect(buildLocalizedUrl(SITE, '/', 'en')).toBe('https://example.com/')
    })

    it('resolves a path that has the same value for all locales (e.g. /contact)', () => {
      expect(buildLocalizedUrl(SITE, '/contact', 'en')).toBe('https://example.com/contact')
    })
  })

  describe('non-default locale (fr) — adds prefix and translated path', () => {
    it('resolves a localised static path', () => {
      expect(buildLocalizedUrl(SITE, '/birds', 'fr')).toBe('https://example.com/fr/oiseaux')
    })

    it('resolves a path with a [slug] param', () => {
      expect(buildLocalizedUrl(SITE, '/birds/[slug]', 'fr', { slug: 'alcedo-atthis' }))
        .toBe('https://example.com/fr/oiseaux/alcedo-atthis')
    })

    it('resolves fungi slug path', () => {
      expect(buildLocalizedUrl(SITE, '/fungi/[slug]', 'fr', { slug: 'amanita-muscaria' }))
        .toBe('https://example.com/fr/champignons/amanita-muscaria')
    })

    it('resolves a path that has the same value for all locales (e.g. /contact)', () => {
      expect(buildLocalizedUrl(SITE, '/contact', 'fr')).toBe('https://example.com/fr/contact')
    })
  })

  it('falls back to the internal path when the path is not in routing.pathnames', () => {
    expect(buildLocalizedUrl(SITE, '/unknown', 'en')).toBe('https://example.com/unknown')
    expect(buildLocalizedUrl(SITE, '/unknown', 'fr')).toBe('https://example.com/fr/unknown')
  })
})

describe('buildAlternates', () => {
  it('returns language keys for every configured locale plus x-default', () => {
    const { languages } = buildAlternates(SITE, '/birds')
    expect(Object.keys(languages)).toEqual(expect.arrayContaining(['en', 'fr', 'x-default']))
  })

  it('en URL has no locale prefix', () => {
    const { languages } = buildAlternates(SITE, '/birds')
    expect(languages['en']).toBe('https://example.com/birds')
  })

  it('fr URL has locale prefix and translated path', () => {
    const { languages } = buildAlternates(SITE, '/birds')
    expect(languages['fr']).toBe('https://example.com/fr/oiseaux')
  })

  it('x-default points to the default locale URL', () => {
    const { languages } = buildAlternates(SITE, '/birds')
    expect(languages['x-default']).toBe(languages['en'])
  })

  it('substitutes slug params in all language variants', () => {
    const { languages } = buildAlternates(SITE, '/birds/[slug]', { slug: 'alcedo-atthis' })
    expect(languages['en']).toBe('https://example.com/birds/alcedo-atthis')
    expect(languages['fr']).toBe('https://example.com/fr/oiseaux/alcedo-atthis')
  })
})
