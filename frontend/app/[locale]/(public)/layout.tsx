import { setRequestLocale } from 'next-intl/server'
import PageTransition from '@/components/PageTransition'
import PublicFooter from '@/components/PublicFooter'
import PublicNav from '@/components/PublicNav'
import { getKingdoms } from '@/lib/api'

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}): Promise<React.JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)

  const kingdoms = await getKingdoms()

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav kingdoms={kingdoms} />
      <div className="flex-1">
        <PageTransition>{children}</PageTransition>
      </div>
      <PublicFooter />
    </div>
  )
}
