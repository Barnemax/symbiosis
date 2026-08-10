import NotFoundContent from '@/components/NotFoundContent'
import PublicFooter from '@/components/PublicFooter'
import PublicNav from '@/components/PublicNav'
import { getKingdoms } from '@/lib/api'

/*
 * Lives at the [locale] level, not inside (public): a not-found.tsx placed in a
 * route group is never matched, so notFound() fell through to Next's bare
 * built-in page. That also means this boundary has to rebuild the public shell
 * itself rather than inheriting (public)/layout.tsx.
 *
 * Deliberately calls no getTranslations/getLocale - both read request headers
 * without a locale param, and a boundary shared by every route in the segment
 * would push all of them back to dynamic rendering. getKingdoms() is a plain
 * cached fetch, and the copy is translated client-side in NotFoundContent.
 */
export default async function NotFound(): Promise<React.JSX.Element> {
  const kingdoms = await getKingdoms().catch(() => [])

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav kingdoms={kingdoms} />
      <div className="flex-1">
        <NotFoundContent />
      </div>
      <PublicFooter />
    </div>
  )
}
