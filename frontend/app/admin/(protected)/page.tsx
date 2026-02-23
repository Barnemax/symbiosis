import Link from 'next/link'
import { getAllSpecies, getAllRelationships } from '@/lib/api'
import { getCommonName, getRelationshipLabel } from '@/lib/helpers'

export default async function AdminDashboard(): Promise<React.JSX.Element> {
  const [speciesData, relationshipsData] = await Promise.all([getAllSpecies(), getAllRelationships()])

  const species = speciesData.member.toSorted((a, b) =>
    a.scientificName.localeCompare(b.scientificName),
  )
  const relationships = relationshipsData.member

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">Admin</h1>
      </div>

      {/* Species */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-stone-500">
            Species ({species.length})
          </h2>
          <Link
            href="/admin/species/new"
            className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700"
          >
            + Add species
          </Link>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white divide-y divide-stone-100">
          {species.map(s => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="text-sm italic text-stone-900">{s.scientificName}</span>
                <span className="ml-2 text-xs text-stone-400">{s.family.kingdom}</span>
                <span className="ml-2 text-xs text-stone-500">
                  {getCommonName(s)}
                </span>
              </div>
              <Link
                href={`/admin/species/${s.slug}/edit`}
                className="text-xs text-stone-400 hover:text-stone-700"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Relationships */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-stone-500">
            Relationships ({relationships.length})
          </h2>
          <Link
            href="/admin/relationships/new"
            className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700"
          >
            + Add relationship
          </Link>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white divide-y divide-stone-100">
          {relationships.map(r => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-stone-900">
                <span className="italic">{r.subject.scientificName}</span>
                <span className="mx-2 text-stone-400">
                  {getRelationshipLabel(r.type)}
                </span>
                <span className="italic">{r.object.scientificName}</span>
              </span>
              <Link
                href={`/admin/relationships/${r.id}/edit`}
                className="text-xs text-stone-400 hover:text-stone-700"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
