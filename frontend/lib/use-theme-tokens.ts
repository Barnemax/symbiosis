'use client'

import { useEffect, useState } from 'react'

/**
 * Reads design tokens off <html> so canvas-painted UI (which cannot use CSS
 * custom properties) stays in sync with the active theme, including live
 * toggles. Returns empty strings until mounted.
 */
export function useThemeTokens<T extends string>(names: readonly T[]): Record<T, string> {
  const [tokens, setTokens] = useState<Record<T, string>>(
    () => Object.fromEntries(names.map(n => [n, ''])) as Record<T, string>,
  )

  useEffect(() => {
    const read = (): void => {
      const style = getComputedStyle(document.documentElement)
      setTokens(
        Object.fromEntries(
          names.map(n => [n, style.getPropertyValue(`--${n}`).trim()]),
        ) as Record<T, string>,
      )
    }
    read()

    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributeFilter: ['class'], attributes: true })
    return () => observer.disconnect()
    // names is a stable literal list at every call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return tokens
}
