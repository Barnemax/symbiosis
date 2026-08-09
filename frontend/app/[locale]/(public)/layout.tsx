import PublicFooter from '@/components/PublicFooter'
import PublicNav from '@/components/PublicNav'
import { getKingdoms } from '@/lib/api'

export default async function PublicLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const kingdoms = await getKingdoms()

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav kingdoms={kingdoms} />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </div>
  )
}
