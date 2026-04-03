export default function Loading(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-stone-100" />
            <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-stone-100" />
          </div>
        ))}
      </div>
    </main>
  )
}
