import Link from 'next/link'
import { logout } from '@/lib/actions'

export default function AdminLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-900">
            ← Public site
          </Link>
          <Link href="/admin" className="text-sm font-semibold text-stone-900">
            Admin
          </Link>
          <Link href="/admin/species/new" className="text-sm text-stone-500 hover:text-stone-900">
            Add species
          </Link>
          <Link href="/admin/relationships/new" className="text-sm text-stone-500 hover:text-stone-900">
            Add relationship
          </Link>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-stone-400 hover:text-stone-700">
            Logout
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-8">{children}</main>
    </div>
  )
}
