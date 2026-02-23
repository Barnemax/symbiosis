'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteInfo } from '@/lib/strings/siteInfo'

const NAV_LINKS = [
  { href: '/birds', label: 'Birds' },
  { href: '/trees', label: 'Trees' },
  { href: '/fungi', label: 'Fungi' },
  { href: '/explore', label: 'Explore' },
  { href: '/contact', label: 'Contact' },
]

export default function PublicNav(): React.JSX.Element {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-base font-semibold tracking-tight text-stone-900">
          {siteInfo.name}
        </Link>
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
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
