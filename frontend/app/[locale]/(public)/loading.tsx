import Skeleton from '@/components/Skeleton'

export default function Loading(): React.JSX.Element {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <Skeleton className="h-14 w-80 max-w-full rounded-lg sm:h-20" />
        <Skeleton className="mt-6 h-6 w-96 max-w-full" />
        <div className="mt-10 flex gap-8 border-t border-line pt-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface">
              <Skeleton className="aspect-4/3 rounded-none" />
              <div className="p-5">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-4 h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
