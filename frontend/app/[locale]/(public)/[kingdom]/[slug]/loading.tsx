export default function Loading(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8 space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-stone-200" />
        <div className="h-8 w-1/2 animate-pulse rounded bg-stone-200" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-stone-100" />
      </div>
      <div className="mb-6 h-40 animate-pulse rounded-xl border border-stone-200 bg-white" />
      <div className="h-48 animate-pulse rounded-xl border border-stone-200 bg-white" />
    </main>
  )
}
