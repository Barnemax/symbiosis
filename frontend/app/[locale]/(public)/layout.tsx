import PublicFooter from '@/components/PublicFooter'
import PublicNav from '@/components/PublicNav'
import { getKingdomCounts } from '@/lib/api'

export default async function PublicLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const counts = await getKingdomCounts()

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <PublicNav kingdomCounts={counts} />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </div>
  )
}
