import { KINGDOM_HREFS } from './constants'
import { getCommonName, resolveMediaUrl } from './helpers'
import { buildLocalizedUrl } from './routing-utils'
import { siteInfo } from './strings/siteInfo'
import type { Relationship, Species } from './types'

/**
 * Builds a schema.org Taxon object for a species page.
 * Includes parentTaxon, sameAs (Wikipedia), image, and ecological relationships
 * as additionalProperty entries (subject-side only, for unambiguous directionality).
 */
export function buildTaxonSchema(species: Species, asSubject: Relationship[]): object {
  const enName = getCommonName(species, 'en')
  const speciesSlug = species.slug ?? species.id.toString()
  const speciesUrl = buildLocalizedUrl(
    siteInfo.url,
    `${KINGDOM_HREFS[species.family.kingdom]}/[slug]`,
    'en',
    { slug: speciesSlug },
  )
  const image = species.media.find(m => m.type === 'image')

  return {
    '@context': 'https://schema.org',
    '@type': 'Taxon',
    alternateName: species.scientificName,
    name: enName,
    parentTaxon: {
      '@type': 'Taxon',
      name: species.family.name,
      taxonRank: 'family',
    },
    sameAs: `https://en.wikipedia.org/wiki/${species.scientificName.replace(/ /g, '_')}`,
    taxonRank: 'species',
    url: speciesUrl,
    ...(image && { image: resolveMediaUrl(image.url) }),
    ...(asSubject.length > 0 && {
      additionalProperty: asSubject.map(rel => ({
        '@type': 'PropertyValue',
        name: rel.type.replace(/_/g, ' '),
        value: getCommonName(rel.object, 'en'),
        valueReference: {
          '@type': 'Taxon',
          alternateName: rel.object.scientificName,
          name: getCommonName(rel.object, 'en'),
          url: buildLocalizedUrl(
            siteInfo.url,
            `${KINGDOM_HREFS[rel.object.family.kingdom]}/[slug]`,
            'en',
            { slug: rel.object.slug ?? rel.object.id.toString() },
          ),
        },
      })),
    }),
  }
}
