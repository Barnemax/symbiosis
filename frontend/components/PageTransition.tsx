'use client'

import { usePathname } from 'next/navigation'

/*
 * Replays the enter animation when the pathname changes, and only then.
 *
 * A template.tsx would be the obvious tool, but it remounts on *any*
 * navigation - including the router.replace() that SearchInput fires on each
 * debounced keystroke, which made the fade stutter while typing. Keying a
 * layout-level wrapper on the pathname ignores query-string changes.
 *
 * Children stay server components; only this wrapper ships to the client.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const pathname = usePathname()
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  )
}
