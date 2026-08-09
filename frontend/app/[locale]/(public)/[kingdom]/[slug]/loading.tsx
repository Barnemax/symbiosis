import Skeleton from '@/components/Skeleton'

export default function Loading(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-8 pt-8 sm:px-8">
      <div className="grid items-center gap-6 border-line pb-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
        <Skeleton className="aspect-4/3 rounded-2xl sm:aspect-3/2" />
        <div>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-3 h-11 w-2/3 rounded-lg sm:h-14" />
          <Skeleton className="mt-3 h-7 w-1/2" />
        </div>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_19rem] lg:gap-14">
        <div className="order-2 space-y-8 lg:order-1">
          <Skeleton className="h-4 w-48" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1.5 h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
        <div className="order-1 space-y-4 lg:order-2">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-1.5 h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
