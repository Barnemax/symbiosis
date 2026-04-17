'use client'

import Image from 'next/image'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { siteInfo } from '@/lib/strings/siteInfo'
import type { KingdomMeta } from '@/lib/types'

type StaticPathname = Exclude<keyof typeof routing['pathnames'], `${string}/[${string}]`>
type DynamicPathname = Extract<keyof typeof routing['pathnames'], `${string}/[${string}]`>

export default function PublicNav({
  kingdoms,
}: {
  kingdoms: KingdomMeta[]
}): React.JSX.Element {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('nav')

  const NAV_LINKS: { href: StaticPathname; label: string; count?: number }[] = [
    ...kingdoms.map(k => ({
      count: k.count,
      href: `/${k.slug}` as StaticPathname,
      label: t.has(k.plural) ? t(k.plural) : k.plural,
    })),
    { href: '/explore', label: t('explore') },
    { href: '/contact', label: t('contact') },
  ]

  const params = useParams()

  function switchLocale(next: string): void {
    const slug = typeof params.slug === 'string' ? params.slug : undefined
    if (slug !== undefined) {
      for (const [template, localePaths] of Object.entries(routing.pathnames)) {
        if (!template.includes('[slug]')) {
          continue
        }
        const prefixes = typeof localePaths === 'string'
          ? [localePaths.split('[')[0]]
          : Object.values(localePaths as Record<string, string>).map(p => p.split('[')[0])
        if (prefixes.some(prefix => pathname.startsWith(prefix))) {
          router.replace(
            { params: { slug }, pathname: template as DynamicPathname } as never,
            { locale: next },
          )
          return
        }
      }
    }
    router.replace(pathname as StaticPathname, { locale: next })
  }

  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/media/icon.png"
            alt={siteInfo.name}
            width={28}
            height={28}
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-base font-semibold tracking-tight text-stone-900">{siteInfo.name}</span>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="flex gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${pathname.startsWith(link.href)
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
                  }`}
              >
                {link.label}
                {link.count != null && (
                  <span className="ml-1.5 text-xs text-stone-400">{link.count}</span>
                )}
              </Link>
            ))}
          </nav>
          <div className="flex overflow-hidden rounded-full border border-stone-200 text-xs font-medium">
            {routing.locales.map((l, i) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`px-2.5 py-1 transition-colors cursor-pointer ${i > 0 ? 'border-l border-stone-200' : ''} ${locale === l ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
