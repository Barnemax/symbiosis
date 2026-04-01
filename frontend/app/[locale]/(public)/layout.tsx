import PublicNav from '@/components/PublicNav'

export default function PublicLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="min-h-screen bg-stone-50">
      <PublicNav />
      {children}
    </div>
  )
}
