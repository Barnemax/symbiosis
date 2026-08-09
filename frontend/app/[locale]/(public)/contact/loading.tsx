import Skeleton from '@/components/Skeleton'

export default function Loading(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-xl px-5 py-16 sm:px-8">
      <Skeleton className="h-11 w-48 rounded-lg sm:h-14" />
      <Skeleton className="mt-4 h-5 w-full" />
      <Skeleton className="mt-2 h-5 w-2/3" />

      <div className="mt-10 space-y-5 border-t border-line pt-8">
        {[10, 10, 32].map((height, i) => (
          <div key={i}>
            <Skeleton className="mb-1.5 h-3 w-20" />
            <Skeleton className={`w-full rounded-lg ${height === 32 ? 'h-32' : 'h-10'}`} />
          </div>
        ))}
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </main>
  )
}
