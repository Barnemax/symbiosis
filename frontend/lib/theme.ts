export const THEME_STORAGE_KEY = 'symbiosis-theme'

export const THEMES = ['light', 'dark'] as const

export type Theme = typeof THEMES[number]

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}

/**
 * Inlined in <head> and run synchronously, before first paint, so a reload
 * never flashes the wrong theme. With nothing stored we take the OS preference
 * as the starting point; from then on the toggle is authoritative.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`

/** Applies a theme to <html> and persists it. Client-only. */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private mode / storage disabled - the theme still applies for this page.
  }
  for (const listener of listeners) {
    listener()
  }
}

export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (isTheme(stored)) {
      return stored
    }
  } catch {
    // Fall through to the OS preference.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/*
 * localStorage is an external store, so the toggle subscribes to it via
 * useSyncExternalStore rather than syncing it into state inside an effect.
 * getServerSnapshot returns 'light' so SSR markup is stable; React swaps in
 * the real preference during hydration.
 */
const listeners = new Set<() => void>()

export function subscribeTheme(onChange: () => void): () => void {
  listeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function getServerThemeSnapshot(): Theme {
  return 'light'
}
