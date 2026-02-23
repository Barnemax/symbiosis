import Link from 'next/link'
import Image from 'next/image'
import { getSpeciesBySlug, getRelationshipsForSpecies } from '@/lib/api'
import { CONSERVATION_STATUSES, KINGDOM_MAP, RELATIONSHIP_LABELS_INVERSE } from '@/lib/constants'
import { getCommonName, getRelationshipLabel, pluralKingdom, resolveMediaUrl } from '@/lib/helpers'
import { notFound } from 'next/navigation'
import { AdminEditLink } from '@/components/AdminEditLink'

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ kingdom: string; slug: string }>
}): Promise<React.JSX.Element> {
  const { kingdom, slug } = await params
  const apiKingdom = KINGDOM_MAP[kingdom]
  if (!apiKingdom) {
    notFound()
  }

  const species = await getSpeciesBySlug(apiKingdom, slug).catch(() => null)
  if (!species) {
    notFound()
  }

  const { asSubject, asObject } = await getRelationshipsForSpecies(species.id).catch(() => ({ asObject: [], asSubject: [] }))

  const relationships = [
    ...asSubject.map(rel => ({ editId: rel.id, id: rel.id, label: getRelationshipLabel(rel.type), notes: rel.notes, other: rel.object })),
    ...asObject.map(rel => ({ editId: rel.id, id: `inv-${rel.id}`, label: RELATIONSHIP_LABELS_INVERSE[rel.type] ?? rel.type, notes: rel.notes, other: rel.subject })),
  ]

  const image = species.media.find(m => m.type === 'image')
  const leaf = species.media.find(m => m.type === 'leaf')
  const audio = species.media.find(m => m.type === 'audio')

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      {/* Hero image */}
      {image && (
        <figure className="mb-6 overflow-hidden rounded-xl">
          <Image
            src={resolveMediaUrl(image.url)}
            alt={getCommonName(species, 'en')}
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
          {species.family.kingdom} · {species.family.name}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-3xl font-semibold text-stone-900">{getCommonName(species, 'en')}</h1>
          <AdminEditLink href={`/admin/species/${species.slug}/edit`} title="Edit species" />
        </div>
        <p className="text-lg italic text-stone-400">{species.scientificName}</p>
        {species.commonNames.find(n => n.locale === 'fr') && (
          <p className="mt-1 text-sm text-stone-500">{getCommonName(species, 'fr')}</p>
        )}
        {/* Audio player */}
        {audio && (
          <div className="mt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">Bird call</p>
            <audio controls src={audio.url.startsWith('/media/') ? resolveMediaUrl(audio.url) : `/api/audio?url=${encodeURIComponent(audio.url)}`} className="w-full" />
            {audio.credit && (
              <p className="mt-1 text-right text-xs text-stone-400">{audio.credit}</p>
            )}
          </div>
        )}
      </div>

      {/* Facts */}
      <section className="mb-8 rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">Facts</h2>
        <dl className="space-y-2">
          {species.habitat && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-sm text-stone-400">Habitat</dt>
              <dd className="text-sm text-stone-700">{species.habitat}</dd>
            </div>
          )}
          {species.conservationStatus && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-sm text-stone-400">IUCN status</dt>
              <dd className="text-sm font-semibold text-stone-700">
                {species.conservationStatus} ({CONSERVATION_STATUSES[species.conservationStatus]?.label ?? species.conservationStatus})
              </dd>
            </div>
          )}
          {species.wingspan && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-sm text-stone-400">Wingspan</dt>
              <dd className="text-sm text-stone-700">~{species.wingspan} cm</dd>
            </div>
          )}
          {species.maxHeight && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-sm text-stone-400">Max height</dt>
              <dd className="text-sm text-stone-700">{species.maxHeight} m</dd>
            </div>
          )}
          {species.substrate && (
            <div className="flex gap-2">
              <dt className="w-36 shrink-0 text-sm text-stone-400">Substrate</dt>
              <dd className="text-sm text-stone-700">{species.substrate}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Leaf image */}
      {leaf && (
        <figure className="mb-8 overflow-hidden rounded-xl">
          <Image
            src={resolveMediaUrl(leaf.url)}
            alt={`${getCommonName(species, 'en')} leaves`}
            width={800}
            height={400}
            className="h-56 w-full object-cover object-center"
            unoptimized
          />
          <figcaption className="bg-stone-100 px-3 py-1.5 text-right text-xs text-stone-400">
            Foliage{leaf.credit ? ` · ${leaf.credit}` : ''}
          </figcaption>
        </figure>
      )}

      {/* Relationships */}
      {relationships.length > 0 && (
        <section className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Ecological relationships
          </h2>
          <ul className="space-y-4">
            {relationships.map(rel => (
              <li key={rel.id}>
                <div className="flex items-center gap-2 text-sm">
                  <span className="rounded bg-stone-100 px-2 py-0.5 font-medium text-stone-600">
                    {rel.label}
                  </span>
                  <Link
                    href={`/${pluralKingdom(rel.other.family.kingdom)}/${rel.other.slug}`}
                    className="font-medium text-stone-900 hover:underline"
                  >
                    {getCommonName(rel.other, 'en')}
                  </Link>
                  <span className="italic text-stone-400">{rel.other.scientificName}</span>
                  <AdminEditLink href={`/admin/relationships/${rel.editId}/edit`} title="Edit relationship" size={14} />
                </div>
                {rel.notes && (
                  <p className="mt-1 text-sm text-stone-500">{rel.notes}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
