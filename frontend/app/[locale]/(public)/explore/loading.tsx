import { getTranslations } from 'next-intl/server'

export default async function ExploreLoading(): Promise<React.JSX.Element> {
  const t = await getTranslations('explore')
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-stone-200" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-stone-100" />
      </div>
      <div className="flex items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50" style={{ height: 600 }}>
        <div className="flex flex-col items-center gap-3 text-stone-400">
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
