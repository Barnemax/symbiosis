export default function Loading(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 h-4 w-64 animate-pulse rounded bg-stone-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="mb-2 h-7 w-8 animate-pulse rounded bg-stone-100" />
            <div className="h-4 w-16 animate-pulse rounded bg-stone-200" />
            <div className="mt-1 h-3 w-full animate-pulse rounded bg-stone-100" />
          </div>
        ))}
      </div>
    </main>
  )
}
