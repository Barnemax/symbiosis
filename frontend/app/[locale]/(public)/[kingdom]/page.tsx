import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { KingdomIcon } from '@/components/icons'
import SpeciesImage from '@/components/SpeciesImage'
import { getKingdoms, getSpecies, PAGE_SIZE } from '@/lib/api'
import { CONSERVATION_STATUSES } from '@/lib/constants'
import { getCommonName, resolveMediaUrl } from '@/lib/helpers'
import { buildAlternates, buildLocalizedUrl } from '@/lib/routing-utils'
import { routing } from '@/i18n/routing'
import { siteInfo } from '@/lib/strings/siteInfo'
import type { AppLocale } from '@/lib/types'

type StaticPathname = Exclude<keyof typeof routing['pathnames'], `${string}/[${string}]`>
type DynamicPathname = Extract<keyof typeof routing['pathnames'], `${string}/[${string}]`>
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import SearchInput from '@/components/SearchInput'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kingdom: string; locale: string }>
}): Promise<Metadata> {
  const { kingdom, locale } = await params
  const kingdoms = await getKingdoms()
  const kd = kingdoms.find(k => k.slug === kingdom)
  if (!kd) {
    return {}
  }

  const tn = await getTranslations({ locale, namespace: 'nav' })
  const internalPath = `/${kd.slug}` as StaticPathname
  const title = tn.has(kd.plural) ? tn(kd.plural) : kd.plural
  const canonicalUrl = buildLocalizedUrl(siteInfo.url, internalPath, locale)

  return {
    alternates: {
      canonical: canonicalUrl,
      ...buildAlternates(siteInfo.url, internalPath),
    },
    openGraph: {
      siteName: siteInfo.name,
      title,
      type: 'website',
      url: canonicalUrl,
    },
    title,
  }
}

function buildHref(href: StaticPathname, p: { search: string; sort: string; page: number }): { pathname: StaticPathname; query?: Record<string, string> } {
  const query: Record<string, string> = {}
  if (p.search) {
    query.search = p.search
  }
  if (p.sort && p.sort !== 'links') {
    query.sort = p.sort
  }
  if (p.page > 1) {
    query.page = String(p.page)
  }
  return { pathname: href, ...(Object.keys(query).length > 0 ? { query } : {}) }
}

export default async function KingdomPage({
  params,
  searchParams,
}: {
  params: Promise<{ kingdom: string; locale: string }>
  searchParams: Promise<{ search?: string; sort?: string; page?: string }>
}): Promise<React.JSX.Element> {
  const { kingdom, locale } = await params
  setRequestLocale(locale)

  // Reading searchParams keeps this route dynamic - the search/sort/page state
  // is server-rendered so paginated listings stay crawlable.
  const { search = '', sort = 'links', page = '1' } = await searchParams

  const kingdoms = await getKingdoms()
  const kd = kingdoms.find(k => k.slug === kingdom)
  if (!kd) {
    notFound()
  }

  const [t, ts, tc, tn, th] = await Promise.all([
    getTranslations('kingdom'),
    getTranslations('search'),
    getTranslations('conservation'),
    getTranslations('nav'),
    getTranslations('home'),
  ])

  const kingdomHref = `/${kd.slug}` as StaticPathname
  const slugHref = `/${kd.slug}/[slug]` as DynamicPathname
  const navLabel = tn.has(kd.plural) ? tn(kd.plural) : kd.plural
  const descKey = `${kd.plural}_desc`
  const description = th.has(descKey) ? th(descKey) : ''

  const currentPage = Math.max(1, parseInt(page) || 1)
  const data = await getSpecies({ kingdom: kd.key, page: currentPage, search, sort })

  const species = data.member
  const totalPages = Math.ceil(data.totalItems / PAGE_SIZE)

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      {/* Kingdom header */}
      <header className="border-b border-line pb-6">
        <div className="flex items-start gap-4">
          <KingdomIcon kingdom={kd.key} className="mt-1 h-9 w-9 shrink-0 text-ink-faint" />
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{navLabel}</h1>
            <p className="mt-1.5 text-base text-ink-muted">{description}</p>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Suspense>
            <SearchInput key={kingdom} defaultValue={search} placeholder={ts('placeholder')} />
          </Suspense>
        </div>
        <div className="flex shrink-0 overflow-hidden rounded-full border border-line text-sm">
          <Link
            href={buildHref(kingdomHref, { page: 1, search, sort: 'name' })}
            className={`px-4 py-2 transition-colors ${sort === 'name' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'}`}
          >
            {t('sort_name')}
          </Link>
          <Link
            href={buildHref(kingdomHref, { page: 1, search, sort: 'links' })}
            className={`border-l border-line px-4 py-2 transition-colors ${sort === 'links' ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'}`}
          >
            {t('sort_links')}
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {species.map(s => {
          const img = s.media.find(m => m.type === 'image')
          const name = getCommonName(s, locale as AppLocale)
          return (
            <Link
              key={s.id}
              href={{
                params: { slug: s.slug ?? s.id.toString() },
                pathname: slugHref
              }}
              className="group"
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-line bg-paper-sunk">
                <SpeciesImage
                  src={img ? resolveMediaUrl(img.url) : undefined}
                  alt={name}
                  kingdom={kd.key}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                {s.conservationStatus && s.conservationStatus !== 'LC' && (
                  <span
                    className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${CONSERVATION_STATUSES[s.conservationStatus]?.className ?? ''}`}
                    title={tc(s.conservationStatus)}
                  >
                    {s.conservationStatus}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <h2 className="font-display text-lg leading-snug font-semibold tracking-tight transition-colors group-hover:text-accent">
                  {name}
                </h2>
                <p className="text-sm italic text-ink-faint">{s.scientificName}</p>
                <p className="mt-2 flex items-center gap-2 text-xs text-ink-faint">
                  <span className="uppercase tracking-[0.1em]">{s.family.name}</span>
                  {s.relationshipCount > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{t('link_count', { count: s.relationshipCount })}</span>
                    </>
                  )}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Empty state */}
      {species.length === 0 && (
        <p className="py-20 text-center text-ink-faint">{t('empty', { search })}</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-3 text-sm">
          {currentPage > 1 ? (
            <Link href={buildHref(kingdomHref, { page: currentPage - 1, search, sort })} className="rounded-full border border-line px-4 py-2 text-ink-muted transition-colors hover:text-ink">
              {t('prev')}
            </Link>
          ) : (
            <span className="rounded-full border border-line/60 px-4 py-2 text-ink-faint/50">{t('prev')}</span>
          )}
          <span className="px-2 tabular-nums text-ink-faint">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Link href={buildHref(kingdomHref, { page: currentPage + 1, search, sort })} className="rounded-full border border-line px-4 py-2 text-ink-muted transition-colors hover:text-ink">
              {t('next')}
            </Link>
          ) : (
            <span className="rounded-full border border-line/60 px-4 py-2 text-ink-faint/50">{t('next')}</span>
          )}
        </nav>
      )}

      <p className="mt-8 text-center text-sm text-ink-faint">{t('species_count', { count: data.totalItems })}</p>
    </main>
  )
}
