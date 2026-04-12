import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getSpeciesBySlug, getRelationshipsForSpecies, getSpeciesByIds } from '@/lib/api'
import { KINGDOM_MAP, KINGDOMS } from '@/lib/constants'
import { getCommonName, getTranslatedField, resolveMediaUrl } from '@/lib/helpers'
import { buildAlternates, buildLocalizedUrl } from '@/lib/routing-utils'
import { buildTaxonSchema } from '@/lib/schemas'
import { siteInfo } from '@/lib/strings/siteInfo'
import type { AppLocale, Media, Species } from '@/lib/types'
import { notFound } from 'next/navigation'
import { AdminEditLink } from '@/components/AdminEditLink'
import JsonLd from '@/components/JsonLd'
import { getTranslations, getLocale } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kingdom: string; locale: string; slug: string }>
}): Promise<Metadata> {
  const { kingdom, locale, slug } = await params
  const apiKingdom = KINGDOM_MAP[kingdom]
  if (!apiKingdom) {
return {}
}

  const species = await getSpeciesBySlug(apiKingdom, slug).catch(() => null)
  if (!species) {
return {}
}

  const commonName = getCommonName(species, locale as AppLocale)
  const image = species.media.find(m => m.type === 'image')
  const internalPath = `${KINGDOMS[apiKingdom].href}/[slug]`
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

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ kingdom: string; locale: string; slug: string }>
}): Promise<React.JSX.Element> {
  const { kingdom, slug } = await params
  const apiKingdom = KINGDOM_MAP[kingdom]
  if (!apiKingdom) {
    notFound()
  }

  const [ts, tc, tk, tr, locale] = await Promise.all([
    getTranslations('species'),
    getTranslations('conservation'),
    getTranslations('kingdoms'),
    getTranslations('relationships'),
    getLocale(),
  ])

  const l = locale as AppLocale

  const species = await getSpeciesBySlug(apiKingdom, slug).catch(() => null)
  if (!species) {
    notFound()
  }

  const { asSubject, asObject } = await getRelationshipsForSpecies(species.id).catch(() => ({ asObject: [], asSubject: [] }))

  const relatedIds = [...new Set([
    ...asSubject.map(r => r.object.id),
    ...asObject.map(r => r.subject.id),
  ])]
  const relatedSpeciesMap = await getSpeciesByIds(relatedIds)
    .then(data => new Map(data.member.map(s => [s.id, s])))
    .catch(() => new Map<number, Species>())

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

  const mediaByType: Partial<Record<string, Media>> = Object.fromEntries(species.media.map(m => [m.type, m]))
  const { image, leaf, feather, audio } = mediaByType
  const habitat = getTranslatedField(species, 'habitat', l)
  const substrate = getTranslatedField(species, 'substrate', l)

  return (
    <>
      <JsonLd schema={buildTaxonSchema(species, asSubject)} />
      <main className="mx-auto max-w-2xl px-6 py-8">
      {/* Hero image */}
      {image && (
        <figure className="mb-6 overflow-hidden rounded-xl">
          <Image
            src={resolveMediaUrl(image.url)}
            alt={getCommonName(species, l)}
            width={800}
            height={500}
            className="h-72 w-full object-cover object-top"
            priority
            unoptimized
          />
          {image.credit && (
            <figcaption className="bg-stone-100 px-3 py-1.5 text-right text-xs text-stone-400">
              {image.credit}
            </figcaption>
          )}
        </figure>
      )}

      {/* Title */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          {tk(species.family.kingdom)} · {species.family.name}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-3xl font-semibold text-stone-900">{getCommonName(species, l)}</h1>
          <AdminEditLink href={`/admin/species/${species.slug}/edit`} title="Edit species" />
        </div>
        <p className="text-lg italic text-stone-400">{species.scientificName}</p>
        {/* Audio player */}
        {audio && (
          <div className="mt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">{ts('bird_call')}</p>
            <audio controls src={audio.url.startsWith('/media/') ? resolveMediaUrl(audio.url) : `/api/audio?url=${encodeURIComponent(audio.url)}`} className="w-full" />
            {audio.credit && (
              <p className="mt-1 text-right text-xs text-stone-400">{audio.credit}</p>
            )}
          </div>
        )}
      </div>

      {/* Facts */}
      <section className="mb-8 rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">{ts('facts')}</h2>
        <dl className="space-y-2">
          {habitat && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-sm text-stone-400">{ts('habitat')}</dt>
              <dd className="text-sm text-stone-700">{habitat}</dd>
            </div>
          )}
          {species.conservationStatus && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-sm text-stone-400">{ts('iucn_status')}</dt>
              <dd className="text-sm font-semibold text-stone-700">
                {species.conservationStatus} ({tc(species.conservationStatus)})
              </dd>
            </div>
          )}
          {species.wingspan && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-sm text-stone-400">{ts('wingspan')}</dt>
              <dd className="text-sm text-stone-700">{ts('wingspan_value', { value: species.wingspan })}</dd>
            </div>
          )}
          {species.maxHeight && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-sm text-stone-400">{ts('max_height')}</dt>
              <dd className="text-sm text-stone-700">{ts('max_height_value', { value: species.maxHeight })}</dd>
            </div>
          )}
          {substrate && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-sm text-stone-400">{ts('substrate')}</dt>
              <dd className="text-sm text-stone-700">{substrate}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Leaf image */}
      {leaf && (
        <figure className="mb-8 overflow-hidden rounded-xl">
          <Image
            src={resolveMediaUrl(leaf.url)}
            alt={`${getCommonName(species, l)} ${ts('foliage').toLowerCase()}`}
            width={800}
            height={400}
            className="h-56 w-full object-cover object-center"
            unoptimized
          />
          <figcaption className="bg-stone-100 px-3 py-1.5 text-right text-xs text-stone-400">
            {ts('foliage')}{leaf.credit ? ` · ${leaf.credit}` : ''}
          </figcaption>
        </figure>
      )}

      {/* Feather image */}
      {feather && (
        <figure className="mb-8 overflow-hidden rounded-xl">
          <Image
            src={resolveMediaUrl(feather.url)}
            alt={`${getCommonName(species, l)} ${ts('feather').toLowerCase()}`}
            width={800}
            height={400}
            className="h-56 w-full object-cover object-center"
            unoptimized
          />
          <figcaption className="bg-stone-100 px-3 py-1.5 text-right text-xs text-stone-400">
            {ts('feather')}{feather.credit ? ` · ${feather.credit}` : ''}
          </figcaption>
        </figure>
      )}

      {/* Relationships */}
      {relationships.length > 0 && (
        <section className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-stone-400">
            {ts('relationships')}
          </h2>
          <div className="space-y-5">
            {[...relationships.reduce<Map<string, typeof relationships>>((acc, rel) => {
              acc.set(rel.label, [...(acc.get(rel.label) ?? []), rel])
              return acc
            }, new Map()).entries()].map(([label, rels]) => (
              <div key={label}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p>
                <ul className="space-y-2">
                  {rels.map(rel => (
                    <li key={rel.id}>
                      <div className="flex items-center gap-2 text-sm">
                        {(() => {
                          const thumb = relatedSpeciesMap.get(rel.other.id)?.media.find(m => m.type === 'image')
                          return thumb
                            ? <Image src={resolveMediaUrl(thumb.url)} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full object-cover object-top" unoptimized />
                            : <div className="h-8 w-8 shrink-0 rounded-full bg-stone-100" />
                        })()}
                        <Link
                          href={{
                            params: { slug: rel.other.slug ?? rel.other.id.toString() },
                            pathname: KINGDOMS[rel.other.family.kingdom].slugHref
                          }}
                          className="font-medium text-stone-900 hover:underline"
                        >
                          {getCommonName(rel.other, l)}
                        </Link>
                        <span className="italic text-stone-400">{rel.other.scientificName}</span>
                        <AdminEditLink href={`/admin/relationships/${rel.editId}/edit`} title="Edit relationship" size={14} />
                      </div>
                      {rel.notes && (
                        <p className="mt-1 pl-10 text-sm text-stone-500">{rel.notes}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
    </>
  )
}
