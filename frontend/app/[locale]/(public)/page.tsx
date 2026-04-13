import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { buildAlternates, buildLocalizedUrl } from '@/lib/routing-utils'
import { getKingdomCounts } from '@/lib/api'
import { siteInfo } from '@/lib/strings/siteInfo'

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

export default async function HomePage(): Promise<React.JSX.Element> {
  const [t, tn, counts] = await Promise.all([
    getTranslations('home'),
    getTranslations('nav'),
    getKingdomCounts(),
  ])

  const KINGDOMS = [
    { count: counts.bird, description: t('birds_desc'), href: '/birds' as const, icon: '🪶', label: tn('birds') },
    { count: counts.tree, description: t('trees_desc'), href: '/trees' as const, icon: '🌳', label: tn('trees') },
    { count: counts.fungus, description: t('fungi_desc'), href: '/fungi' as const, icon: '🍄', label: tn('fungi') },
  ]

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-semibold text-stone-900">{t('title')}</h1>
      <p className="mb-8 text-stone-500">{t('subtitle')}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {KINGDOMS.map(k => (
          <Link
            key={k.href}
            href={k.href}
            className="group rounded-xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-2 text-2xl">{k.icon}</div>
            <h2 className="font-semibold text-stone-900 group-hover:text-stone-600">{k.label}</h2>
            <p className="mt-1 text-xs text-stone-400">{k.description}</p>
            <p className="mt-3 text-xs font-medium text-stone-500">{t('species_count', { count: k.count })}</p>
          </Link>
        ))}
      </div>

      <section className="mt-16 space-y-6">
        <h2 className="text-xl font-semibold text-stone-900">{t('about_title')}</h2>
        <p className="text-sm leading-relaxed text-stone-600">{t('about_p1')}</p>
        <p className="text-sm leading-relaxed text-stone-600">{t('about_p2')}</p>

        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <h3 className="mb-2 text-sm font-semibold text-stone-900">{t('about_curation_title')}</h3>
          <p className="text-sm leading-relaxed text-stone-500">{t('about_curation')}</p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          {t('about_explore')} →
        </Link>
      </section>
    </main>
  )
}
