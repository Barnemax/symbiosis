import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { getAllRelationships, getAllSpecies, getKingdoms } from '@/lib/api'
import { getCommonName, getTranslatedField, resolveMediaUrl } from '@/lib/helpers'
import { buildAlternates, buildLocalizedUrl } from '@/lib/routing-utils'
import { routing } from '@/i18n/routing'
import { buildTaxonSchema } from '@/lib/schemas'
import { siteInfo } from '@/lib/strings/siteInfo'
import type { AppLocale, KingdomMeta, Media, Species } from '@/lib/types'

type DynamicPathname = Extract<keyof typeof routing['pathnames'], `${string}/[${string}]`>
import { notFound } from 'next/navigation'
import { AdminEditLink } from '@/components/AdminEditLink'
import JsonLd from '@/components/JsonLd'
import SpeciesImage from '@/components/SpeciesImage'
import { KingdomIcon } from '@/components/icons'
import { CONSERVATION_STATUSES } from '@/lib/constants'
import { getTranslations, setRequestLocale } from 'next-intl/server'

/*
 * Every species page reads from the same two bulk responses - the whole species
 * list and the whole relationship list - rather than querying per slug. Both are
 * cached fetches, so prerendering 134 pages costs three upstream calls in total
 * instead of roughly 270, and /explore and /contact share the same entries.
 *
 * The trade is payload for round trips: ~290KB of JSON to render one page. Fine
 * at the current ~75 species; revisit if the encyclopedia grows an order of
 * magnitude, at which point per-slug queries become the cheaper side again.
 */
async function loadSpecies(kingdomSlug: string, slug: string): Promise<{
  allSpecies: Species[]
  kd: KingdomMeta
  kingdoms: KingdomMeta[]
  species: Species
} | null> {
  // Issued together, not chained: on a cold cache this is one round trip rather
  // than one per lookup.
  const [kingdoms, { member }] = await Promise.all([getKingdoms(), getAllSpecies()])
  const kd = kingdoms.find(k => k.slug === kingdomSlug)
  if (!kd) {
    return null
  }
  const species = member.find(s => s.family.kingdom === kd.key && (s.slug ?? String(s.id)) === slug)
  return species ? { allSpecies: member, kd, kingdoms, species } : null
}

/*
 * Prerender every species page at build. Fails soft: if the API is unreachable
 * the build still succeeds and pages are generated on first request instead
 * (dynamicParams defaults to true), so a down API never blocks a deploy.
 */
export async function generateStaticParams(): Promise<{ kingdom: string; slug: string }[]> {
  try {
    const [kingdoms, { member }] = await Promise.all([getKingdoms(), getAllSpecies()])
    const slugByKingdom = new Map(kingdoms.map(k => [k.key, k.slug]))
    return member.flatMap(s => {
      const kingdom = slugByKingdom.get(s.family.kingdom)
      return kingdom ? [{ kingdom, slug: s.slug ?? String(s.id) }] : []
    })
  } catch (error) {
    // Loud on purpose: an empty list looks identical to "no species yet" in the
    // build log, and silently shipping zero prerendered pages is worth noticing.
    console.warn('[generateStaticParams] species prerender skipped, API unreachable:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kingdom: string; locale: string; slug: string }>
}): Promise<Metadata> {
  const { kingdom, locale, slug } = await params
  const found = await loadSpecies(kingdom, slug).catch(() => null)
  if (!found) {
    return {}
  }
  const { kd, species } = found

  const commonName = getCommonName(species, locale as AppLocale)
  const image = species.media.find(m => m.type === 'image')
  const internalPath = `/${kd.slug}/[slug]` as DynamicPathname
  const canonicalUrl = buildLocalizedUrl(siteInfo.url, internalPath, locale, { slug })

  return {
    alternates: {
      canonical: canonicalUrl,
      ...buildAlternates(siteInfo.url, internalPath, { slug }),
    },
    description: `${species.scientificName} · ${species.family.name}`,
    openGraph: {
      description: `${species.scientificName} · ${species.family.name}`,
      title: commonName,
      type: 'article',
      url: canonicalUrl,
      ...(image && {
        images: [{ alt: commonName, height: 500, url: resolveMediaUrl(image.url), width: 800 }],
      }),
    },
    title: commonName,
  }
}

/** Small-caps section heading with a hairline rule - the field-guide device used throughout. */
function SectionLabel({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <h2 className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
      <span className="shrink-0">{children}</span>
      <span className="h-px flex-1 bg-line" />
    </h2>
  )
}

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ kingdom: string; locale: string; slug: string }>
}): Promise<React.JSX.Element> {
  const { kingdom, locale, slug } = await params
  setRequestLocale(locale)

  const [found, allRelationships] = await Promise.all([
    loadSpecies(kingdom, slug),
    getAllRelationships().then(data => data.member).catch(() => []),
  ])
  if (!found) {
    notFound()
  }
  const { allSpecies, kd, kingdoms, species } = found

  const [ts, tc, tk, tr] = await Promise.all([
    getTranslations('species'),
    getTranslations('conservation'),
    getTranslations('kingdoms'),
    getTranslations('relationships'),
  ])

  const l = locale as AppLocale

  const slugByKingdom = new Map(kingdoms.map(k => [k.key, k.slug]))

  const asSubject = allRelationships.filter(r => r.subject.id === species.id)
  const asObject = allRelationships.filter(r => r.object.id === species.id)

  // `media` is absent from relationship:read, so thumbnails come from the
  // species list we already hold rather than a second id[]= round trip.
  const relatedSpeciesMap = new Map<number, Species>(allSpecies.map(s => [s.id, s]))

  const relationships = [
    ...asSubject.map(rel => ({
      editId: rel.id,
      id: rel.id,
      label: tr.has(rel.type) ? tr(rel.type) : rel.type.replace(/_/g, ' '),
      notes: rel.translations.find(t => t.locale === l)?.notes ?? rel.notes,
      other: rel.object,
    })),
    ...asObject.map(rel => ({
      editId: rel.id,
      id: `inv-${rel.id}`,
      label: tr.has(`${rel.type}_inv`) ? tr(`${rel.type}_inv`) : rel.type.replace(/_/g, ' '),
      notes: rel.translations.find(t => t.locale === l)?.notes ?? rel.notes,
      other: rel.subject,
    })),
  ]

  const groupedRelationships = [...relationships.reduce<Map<string, typeof relationships>>((acc, rel) => {
    acc.set(rel.label, [...(acc.get(rel.label) ?? []), rel])
    return acc
  }, new Map()).entries()]

  const mediaByType = Object.fromEntries(species.media.map(m => [m.type, m])) as Partial<Record<string, Media>>
  const { image, leaf, feather, audio } = mediaByType
  const habitat = getTranslatedField(species, 'habitat', l)
  const substrate = getTranslatedField(species, 'substrate', l)
  const commonName = getCommonName(species, l)

  const facts: { term: string; value: React.ReactNode }[] = [
    ...(habitat ? [{ term: ts('habitat'), value: habitat }] : []),
    ...(species.conservationStatus
      ? [{
        term: ts('iucn_status'),
        value: (
          <span className="inline-flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${CONSERVATION_STATUSES[species.conservationStatus]?.className ?? ''}`}>
              {species.conservationStatus}
            </span>
            {tc(species.conservationStatus)}
          </span>
        ),
      }]
      : []),
    ...(species.wingspan ? [{ term: ts('wingspan'), value: ts('wingspan_value', { value: species.wingspan }) }] : []),
    ...(species.maxHeight ? [{ term: ts('max_height'), value: ts('max_height_value', { value: species.maxHeight }) }] : []),
    ...(substrate ? [{ term: ts('substrate'), value: substrate }] : []),
  ]

  const plates = [
    ...(leaf ? [{ label: ts('foliage'), media: leaf }] : []),
    ...(feather ? [{ label: ts('feather'), media: feather }] : []),
  ]

  return (
    <>
      <JsonLd schema={buildTaxonSchema(species, asSubject, slugByKingdom)} />
      <main className="mx-auto max-w-6xl px-5 pb-8 pt-8 sm:px-8">
        {/* Plate and name sit side by side from lg up, like a field-guide entry */}
        <div className="grid items-center gap-6 border-line pb-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <figure>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-line bg-paper-sunk sm:aspect-3/2">
              <SpeciesImage
                src={image ? resolveMediaUrl(image.url) : undefined}
                alt={commonName}
                kingdom={species.family.kingdom}
                sizes="(min-width: 1024px) 690px, 100vw"
                priority
                className="object-cover object-top"
              />
            </div>
            {image?.credit && (
              <figcaption className="mt-2 text-xs text-ink-faint">{image.credit}</figcaption>
            )}
          </figure>

          <header>
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
              <KingdomIcon kingdom={species.family.kingdom} className="h-4 w-4" />
              <Link href={`/${kd.slug}` as never} className="transition-colors hover:text-ink">
                {tk(species.family.kingdom)}
              </Link>
              <span aria-hidden="true">·</span>
              <span>{species.family.name}</span>
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
                {commonName}
              </h1>
              <AdminEditLink href={`/admin/species/${species.slug}/edit`} title="Edit species" />
            </div>
            <p className="mt-2 font-display text-xl italic text-ink-faint sm:text-2xl">{species.scientificName}</p>

            {facts.length > 0 && (
              <dl className="mt-7 space-y-3 border-t border-line pt-6">
                {facts.map(fact => (
                  <div key={fact.term} className="sm:flex sm:gap-4">
                    <dt className="shrink-0 text-xs uppercase tracking-[0.1em] text-ink-faint sm:w-28 sm:pt-0.5">
                      {fact.term}
                    </dt>
                    <dd className="text-sm leading-relaxed text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </header>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_19rem] lg:gap-14">
          {/* Relationships - the substance of the page, so it leads */}
          <div className="order-2 lg:order-1">
            {groupedRelationships.length > 0 && (
              <section>
                <SectionLabel>{ts('relationships')}</SectionLabel>
                <div className="space-y-9">
                  {groupedRelationships.map(([label, rels]) => (
                    <div key={label}>
                      <h3 className="font-display text-lg font-semibold tracking-tight">{label}</h3>
                      <ul className="mt-3 divide-y divide-line border-y border-line">
                        {rels.map(rel => {
                          const thumb = relatedSpeciesMap.get(rel.other.id)?.media.find(m => m.type === 'image')
                          const targetKingdom = rel.other.family.kingdom
                          return (
                            <li key={rel.id} className="py-4">
                              <div className="flex gap-4">
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-paper-sunk">
                                  <SpeciesImage
                                    src={thumb ? resolveMediaUrl(thumb.url) : undefined}
                                    alt={getCommonName(rel.other, l)}
                                    kingdom={targetKingdom}
                                    sizes="56px"
                                    className="object-cover object-top"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                                    <Link
                                      href={{
                                        params: { slug: rel.other.slug ?? rel.other.id.toString() },
                                        pathname: `/${slugByKingdom.get(targetKingdom) ?? targetKingdom}/[slug]` as DynamicPathname
                                      }}
                                      className="font-medium transition-colors hover:text-accent"
                                    >
                                      {getCommonName(rel.other, l)}
                                    </Link>
                                    <span className="font-display text-sm italic text-ink-faint">
                                      {rel.other.scientificName}
                                    </span>
                                    <AdminEditLink href={`/admin/relationships/${rel.editId}/edit`} title="Edit relationship" size={14} />
                                  </div>
                                  {rel.notes && (
                                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted text-pretty">
                                      {rel.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Field notes */}
          <aside className="order-1 space-y-10 lg:order-2">
            {audio && (
              <section>
                <SectionLabel>{ts('bird_call')}</SectionLabel>
                <audio
                  controls
                  src={audio.url.startsWith('/media/') ? resolveMediaUrl(audio.url) : `/api/audio?url=${encodeURIComponent(audio.url)}`}
                  className="w-full"
                />
                {audio.credit && (
                  <p className="mt-2 text-xs leading-relaxed text-ink-faint">{audio.credit}</p>
                )}
              </section>
            )}

            {plates.map(plate => (
              <figure key={plate.label}>
                <SectionLabel>{plate.label}</SectionLabel>
                <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-line bg-paper-sunk">
                  <SpeciesImage
                    src={resolveMediaUrl(plate.media.url)}
                    alt={`${commonName}, ${plate.label.toLowerCase()}`}
                    kingdom={species.family.kingdom}
                    sizes="(min-width: 1024px) 19rem, 100vw"
                    className="object-cover object-center"
                  />
                </div>
                {plate.media.credit && (
                  <figcaption className="mt-2 text-xs leading-relaxed text-ink-faint">
                    {plate.media.credit}
                  </figcaption>
                )}
              </figure>
            ))}
          </aside>
        </div>
      </main>
    </>
  )
}
