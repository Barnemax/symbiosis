'use client'

import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export function AdminEditLink({ href, title, size = 18 }: { href: string; size?: number; title: string }): React.JSX.Element | null {
  const { data: session } = authClient.useSession()
  if (!session) {
return null
}
  return (
    <Link href={href} className="text-stone-300 hover:text-stone-600" title={title}>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
      </svg>
    </Link>
  )
}
