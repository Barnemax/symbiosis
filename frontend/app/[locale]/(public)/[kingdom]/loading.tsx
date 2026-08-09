import Skeleton from '@/components/Skeleton'

export default function Loading(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <header className="border-b border-line pb-6">
        <Skeleton className="h-11 w-56 rounded-lg sm:h-14" />
        <Skeleton className="mt-2 h-5 w-72 max-w-full" />
      </header>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

      <div className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-4/3 rounded-lg" />
            <Skeleton className="mt-3 h-6 w-2/3" />
            <Skeleton className="mt-1.5 h-4 w-1/2" />
            <Skeleton className="mt-2.5 h-3 w-1/3" />
          </div>
        ))}
      </div>
    </main>
  )
}
