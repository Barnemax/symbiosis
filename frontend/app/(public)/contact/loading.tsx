export default function Loading(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <div className="mb-2 h-7 w-32 animate-pulse rounded bg-stone-200" />
      <div className="mb-8 h-4 w-3/4 animate-pulse rounded bg-stone-100" />

      <div className="space-y-5">
        {/* Email field */}
        <div>
          <div className="mb-1 h-4 w-20 animate-pulse rounded bg-stone-100" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-stone-200" />
        </div>
        {/* Species combobox */}
        <div>
          <div className="mb-1 h-4 w-32 animate-pulse rounded bg-stone-100" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-stone-200" />
        </div>
        {/* Message textarea */}
        <div>
          <div className="mb-1 h-4 w-24 animate-pulse rounded bg-stone-100" />
          <div className="h-32 w-full animate-pulse rounded-lg bg-stone-200" />
        </div>
        {/* Submit button */}
        <div className="h-10 w-full animate-pulse rounded-lg bg-stone-200" />
      </div>
    </main>
  )
}
