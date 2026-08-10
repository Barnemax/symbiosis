import type { Metadata } from 'next'
import '../globals.css'

import { fontVariables } from '@/app/fonts'
import { siteInfo } from '@/lib/strings/siteInfo'

/*
 * Second root layout, sibling to app/[locale]/layout.tsx. Admin sits outside
 * the [locale] segment (it is not translated yet), so it owns its own <html>.
 * No theme-init script here: the admin UI pins itself light via `.light`.
 */

export const metadata: Metadata = {
  title: {
    default: `Admin | ${siteInfo.name}`,
    template: `%s | Admin | ${siteInfo.name}`,
  },
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en" className={fontVariables}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
