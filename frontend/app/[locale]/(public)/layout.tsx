import PublicFooter from '@/components/PublicFooter'
import PublicNav from '@/components/PublicNav'

export default function PublicLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <PublicNav />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </div>
  )
}
