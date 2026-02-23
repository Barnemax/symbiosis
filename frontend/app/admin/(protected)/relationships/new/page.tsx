import { getAllSpecies, getRelationshipTypes } from '@/lib/api'
import { createRelationship } from '@/lib/actions'
import RelationshipForm from './_form'

export default async function NewRelationshipPage(): Promise<React.JSX.Element> {
  const [speciesData, types] = await Promise.all([getAllSpecies(), getRelationshipTypes()])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">Add relationship</h1>
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <RelationshipForm species={speciesData.member} types={types} action={createRelationship} submitLabel="Create relationship" />
      </div>
    </div>
  )
}
