'use client'

import { useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { MoonIcon, SunIcon } from '@/components/icons'
import {
  applyTheme,
  getServerThemeSnapshot,
  readStoredTheme,
  subscribeTheme,
} from '@/lib/theme'

export default function ThemeToggle(): React.JSX.Element {
  const theme = useSyncExternalStore(subscribeTheme, readStoredTheme, getServerThemeSnapshot)
  const t = useTranslations('theme')

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      aria-label={t('switch_to', { theme: t(next) })}
      title={t('switch_to', { theme: t(next) })}
      className="cursor-pointer rounded-full border border-line p-2 text-ink-muted transition-colors hover:text-ink"
    >
      {theme === 'dark'
        ? <SunIcon className="h-4 w-4" />
        : <MoonIcon className="h-4 w-4" />}
    </button>
  )
}
