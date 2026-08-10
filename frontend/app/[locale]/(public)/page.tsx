import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type StaticPathname = Exclude<keyof typeof routing['pathnames'], `${string}/[${string}]`>
import { buildAlternates, buildLocalizedUrl } from '@/lib/routing-utils'
import { getGraphRelationships, getKingdoms, getSpecies } from '@/lib/api'
import { getCommonName, resolveMediaUrl } from '@/lib/helpers'
import { ArrowRightIcon } from '@/components/icons'
import SpeciesImage from '@/components/SpeciesImage'
import { siteInfo } from '@/lib/strings/siteInfo'
import type { AppLocale, KingdomMeta, Species } from '@/lib/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const canonicalUrl = buildLocalizedUrl(siteInfo.url, '/', locale)

  return {
    alternates: {
      canonical: canonicalUrl,
      ...buildAlternates(siteInfo.url, '/'),
    },
    description: t('subtitle'),
    openGraph: {
      description: t('subtitle'),
      siteName: siteInfo.name,
      title: siteInfo.name,
      type: 'website',
      url: canonicalUrl,
    },
  }
}

/** The best-connected species in a kingdom stands in as its cover plate. */
async function coverFor(kingdom: KingdomMeta): Promise<Species | undefined> {
  const data = await getSpecies({ kingdom: kingdom.key, sort: 'links' })
  return data.member.find(s => s.media.some(m => m.type === 'image'))
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, tn, kingdoms, graph] = await Promise.all([
    getTranslations('home'),
    getTranslations('nav'),
    getKingdoms(),
    getGraphRelationships(),
  ])

  const covers = await Promise.all(kingdoms.map(coverFor))

  const plates = kingdoms.map((k, i) => {
    const cover = covers[i]
    const image = cover?.media.find(m => m.type === 'image')?.url
    return {
      count: k.count,
      cover,
      description: t.has(`${k.plural}_desc`) ? t(`${k.plural}_desc`) : '',
      href: `/${k.slug}` as StaticPathname,
      image: image ? resolveMediaUrl(image) : undefined,
      key: k.key,
      label: tn.has(k.plural) ? tn(k.plural) : k.plural,
      name: cover ? getCommonName(cover, locale as AppLocale) : '',
    }
  })

  const speciesTotal = kingdoms.reduce((sum, k) => sum + k.count, 0)

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <div className="max-w-3xl">
          <h1 className="font-display text-5xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-7xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted text-pretty sm:text-xl">
            {t('subtitle')}
          </p>
        </div>

        <dl className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-line pt-5 text-sm text-ink-faint">
          {([
            ['stat_species', speciesTotal],
            ['stat_relationships', graph.totalItems],
            ['stat_kingdoms', kingdoms.length],
          ] as const).map(([key, count]) => (
            <div key={key} className="flex items-baseline gap-2">
              <dd className="text-2xl font-medium tabular-nums text-ink">{count}</dd>
              <dt>{t(key, { count })}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Kingdom plates */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {plates.map(plate => (
            <Link
              key={plate.href}
              href={plate.href}
              className="group relative flex flex-col bg-surface transition-colors hover:bg-paper-sunk"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-paper-sunk">
                <SpeciesImage
                  src={plate.image}
                  alt={plate.name}
                  kingdom={plate.key}
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {plate.image && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent" />
                    {/* Visual echo of the alt text - hidden from AT to avoid a double announcement. */}
                    <p
                      aria-hidden="true"
                      className="absolute inset-x-4 bottom-3 truncate font-display text-xs italic text-white/85"
                    >
                      {plate.name}
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-2xl font-semibold tracking-tight">{plate.label}</h2>
                  <span className="text-sm tabular-nums text-ink-faint">{plate.count}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{plate.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent">
                  {t('browse')}
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance">
              {t('about_title')}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-muted text-pretty">
              <p>{t('about_p1')}</p>
              <p>{t('about_p2')}</p>
            </div>
            <Link
              href="/explore"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85"
            >
              {t('about_explore')}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <aside className="lg:border-l lg:border-line lg:pl-8">
            <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">
              {t('about_curation_title')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t('about_curation')}</p>
          </aside>
        </div>
      </section>
    </main>
  )
}
