import Link from 'next/link'
import Image from 'next/image'
import { getSpecies, PAGE_SIZE } from '@/lib/api'
import { CONSERVATION_STATUSES, KINGDOM_MAP } from '@/lib/constants'
import { getCommonName, resolveMediaUrl } from '@/lib/helpers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import SearchInput from '@/components/SearchInput'

function buildUrl(kingdom: string, p: { search: string; sort: string; page: number }): string {
  const qs = new URLSearchParams()
  if (p.search) {
qs.set('search', p.search)
}
  if (p.sort && p.sort !== 'links') {
qs.set('sort', p.sort)
}
  if (p.page > 1) {
qs.set('page', String(p.page))
}
  const q = qs.toString()
  return `/${kingdom}${q ? `?${q}` : ''}`
}

export default async function KingdomPage({
  params,
  searchParams,
}: {
  params: Promise<{ kingdom: string }>
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>
}): Promise<React.JSX.Element> {
  const { kingdom } = await params
  const { search = '', sort = 'links', page = '1' } = await searchParams

  const apiKingdom = KINGDOM_MAP[kingdom]
  if (!apiKingdom) {
notFound()
}

  const currentPage = Math.max(1, parseInt(page) || 1)
  const data = await getSpecies({ kingdom: apiKingdom, page: currentPage, search, sort })

  const species = data.member

  const totalPages = Math.ceil(data.totalItems / PAGE_SIZE)

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      {/* Controls */}
      <div className="mb-6 flex gap-3">
        <div className="flex-1">
          <Suspense>
            <SearchInput key={kingdom} defaultValue={search} />
          </Suspense>
        </div>
        <div className="flex overflow-hidden rounded-lg border border-stone-200 bg-white text-sm font-medium">
          <Link
            href={buildUrl(kingdom, { page: 1, search, sort: 'name' })}
            className={`px-4 py-2 transition-colors ${sort === 'name' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'}`}
          >
            Name
          </Link>
          <Link
            href={buildUrl(kingdom, { page: 1, search, sort: 'links' })}
            className={`border-l border-stone-200 px-4 py-2 transition-colors ${sort === 'links' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'}`}
          >
            Links
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {species.map(s => (
          <Link
            key={s.id}
            href={`/${kingdom}/${s.slug}`}
            className="group overflow-hidden rounded-xl border border-stone-200 bg-white transition-shadow hover:shadow-md"
          >
            {(() => {
              const img = s.media.find(m => m.type === 'image')
              return img ? (
                <Image
                  src={resolveMediaUrl(img.url)}
                  alt={getCommonName(s)}
                  width={400}
                  height={200}
                  className="h-48 w-full object-cover object-top"
                  unoptimized
                />
              ) : (
                <div className="h-48 w-full bg-stone-100" />
              )
            })()}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-stone-900 group-hover:text-stone-600">
                    {getCommonName(s)}
                  </p>
                  <p className="text-sm italic text-stone-400">{s.scientificName}</p>
                </div>
                {s.conservationStatus && (
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${CONSERVATION_STATUSES[s.conservationStatus]?.className ?? 'bg-stone-100 text-stone-600'}`}
                    title={CONSERVATION_STATUSES[s.conservationStatus]?.label}
                  >
                    {s.conservationStatus}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                  {s.family.name}
                </p>
                {s.relationshipCount > 0 && (
                  <p className="text-xs text-stone-400">
                    {s.relationshipCount} {s.relationshipCount === 1 ? 'link' : 'links'}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {species.length === 0 && (
        <p className="py-16 text-center text-sm text-stone-400">No species found for &ldquo;{search}&rdquo;</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm">
          {currentPage > 1 ? (
            <Link href={buildUrl(kingdom, { page: currentPage - 1, search, sort })} className="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-100">
              ← Prev
            </Link>
          ) : (
            <span className="rounded-lg px-3 py-1.5 text-stone-300">← Prev</span>
          )}
          <span className="px-2 text-stone-400">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link href={buildUrl(kingdom, { page: currentPage + 1, search, sort })} className="rounded-lg px-3 py-1.5 text-stone-600 hover:bg-stone-100">
              Next →
            </Link>
          ) : (
            <span className="rounded-lg px-3 py-1.5 text-stone-300">Next →</span>
          )}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-stone-400">{data.totalItems} species</p>
    </main>
  )
}
