'use client'

import { useState } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { CloseIcon, MenuIcon, SymbiosisMark } from '@/components/icons'
import ThemeToggle from '@/components/ThemeToggle'
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
  const [menuOpen, setMenuOpen] = useState(false)

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
    setMenuOpen(false)
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

  const localeSwitch = (
    <div className="inline-flex overflow-hidden rounded-full border border-line text-xs font-medium">
      {routing.locales.map((l, i) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`cursor-pointer px-2.5 py-1.5 transition-colors ${i > 0 ? 'border-l border-line' : ''} ${
            locale === l ? 'bg-ink text-paper' : 'text-ink-faint hover:text-ink'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <SymbiosisMark className="h-7 w-7 text-ink" />
          <span className="font-display text-lg leading-none font-semibold tracking-tight">
            {siteInfo.name}
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-2 lg:flex">
          <nav className="flex items-center gap-0.5">
            {NAV_LINKS.map(link => {
              const active = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                    active ? 'bg-ink text-paper' : 'text-ink-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/8'
                  }`}
                >
                  {link.label}
                  {link.count != null && (
                    <span className={`ml-1.5 text-[11px] tabular-nums ${active ? 'opacity-60' : 'text-ink-faint'}`}>
                      {link.count}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
          <span className="mx-1 h-5 w-px bg-line" />
          {localeSwitch}
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(open => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('close') : t('menu')}
            className="cursor-pointer rounded-full border border-line p-2 text-ink-muted transition-colors hover:text-ink"
          >
            {menuOpen ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-paper px-5 pb-5 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {NAV_LINKS.map(link => {
              const active = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-baseline justify-between border-b border-line py-3 text-base transition-colors ${
                    active ? 'text-ink' : 'text-ink-muted'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.count != null && (
                    <span className="text-xs tabular-nums text-ink-faint">{link.count}</span>
                  )}
                </Link>
              )
            })}
          </nav>
          <div className="mt-4">{localeSwitch}</div>
        </div>
      )}
    </header>
  )
}
