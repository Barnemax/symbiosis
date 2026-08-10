'use client'

import { useTranslations } from 'next-intl'
import Skeleton from '@/components/Skeleton'

/*
 * Client-side translations on purpose: loading.tsx receives no params, so a
 * server-side getTranslations() here would resolve the locale from request
 * headers and force the whole /explore route to render dynamically.
 */
export default function ExploreLoading(): React.JSX.Element {
  const t = useTranslations('explore')
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <header className="mb-6 max-w-2xl">
        <Skeleton className="h-11 w-72 rounded-lg sm:h-14" />
        <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      </header>
      <div
        className="flex items-center justify-center overflow-hidden rounded-2xl border border-line bg-paper-sunk"
        style={{ height: 700 }}
      >
        <div className="flex flex-col items-center gap-3 text-ink-faint">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
            <circle cx="12" cy="5" r="2"/><circle cx="19" cy="14" r="2"/><circle cx="5" cy="14" r="2"/>
            <line x1="12" y1="7" x2="19" y2="12"/><line x1="12" y1="7" x2="5" y2="12"/>
            <line x1="19" y1="16" x2="5" y2="16"/>
          </svg>
          <p className="text-sm">{t('loading')}</p>
        </div>
      </div>
    </main>
  )
}
