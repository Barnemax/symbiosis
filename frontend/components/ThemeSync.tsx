'use client'

import { useLayoutEffect } from 'react'
import { paintTheme, readStoredTheme } from '@/lib/theme'

/**
 * Re-applies the stored theme to <html> whenever the public tree mounts.
 *
 * The theme class is written imperatively - by the <head> script on first paint,
 * by the toggle afterwards - but <html> belongs to the root layout, whose only
 * param is the locale. Switching locale is therefore a different instance of that
 * layout: React tears the tree down, rebuilds it, and resets <html> to the
 * attributes it rendered, dropping the class and reverting the page to light.
 *
 * This component is rebuilt by that same teardown, so a plain mount effect fires
 * again on the way back up - no need to watch the locale, or the DOM, for it.
 * localStorage stayed authoritative throughout, so re-reading it also resettles
 * the toggle, which otherwise ends up offering to switch to the theme already on
 * screen. A layout effect runs before the browser paints, so nothing flashes.
 */
export default function ThemeSync(): null {
  useLayoutEffect(() => {
    paintTheme(readStoredTheme())
  }, [])

  return null
}
