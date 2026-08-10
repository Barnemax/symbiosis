'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { ArrowRightIcon } from '@/components/icons'

type StaticPathname = Exclude<keyof typeof routing['pathnames'], `${string}/[${string}]`>

/*
 * A kingdom root is any pathname that also has a `[slug]` child - derived from
 * the routing table rather than hardcoded, so adding a fourth kingdom needs no
 * edit here.
 */
const KINGDOM_PATHS = Object.keys(routing.pathnames)
  .filter((p): p is StaticPathname => `${p}/[slug]` in routing.pathnames)

/*
 * Client component on purpose: not-found.tsx receives no params, so the kingdom
 * has to come from the path. next-intl's usePathname returns the de-localized
 * internal path (/birds/..., never /oiseaux/...), which is what KINGDOM_PATHS
 * holds. Translating on the client also keeps the boundary off request headers,
 * which would drag every route in the segment back into dynamic rendering.
 */
export default function NotFoundContent(): React.JSX.Element {
  const t = useTranslations('notFound')
  const tn = useTranslations('nav')
  const pathname = usePathname()

  const kingdomPath = KINGDOM_PATHS.find(p => pathname === p || pathname.startsWith(`${p}/`))
  const kingdomKey = kingdomPath?.slice(1) ?? ''
  const backHref = kingdomPath ?? ('/' as StaticPathname)
  const backLabel = kingdomPath && tn.has(kingdomKey)
    ? t('back_kingdom', { kingdom: tn(kingdomKey).toLowerCase() })
    : t('back_home')

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start px-5 py-24 sm:px-8 sm:py-32">
      <p className="font-display text-7xl font-semibold tracking-tight text-ink-faint tabular-nums sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {t('title')}
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-ink-muted text-pretty">
        {t('description')}
      </p>
      <Link
        href={backHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85"
      >
        {backLabel}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </main>
  )
}
