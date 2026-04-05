import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { buildAlternates, buildLocalizedUrl } from '@/lib/routing-utils'
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
  const t = await getTranslations('home')
  const tn = await getTranslations('nav')

  const KINGDOMS = [
    { description: t('birds_desc'), href: '/birds' as const, icon: '🪶', label: tn('birds') },
    { description: t('trees_desc'), href: '/trees' as const, icon: '🌳', label: tn('trees') },
    { description: t('fungi_desc'), href: '/fungi' as const, icon: '🍄', label: tn('fungi') },
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
          </Link>
        ))}
      </div>
    </main>
  )
}
