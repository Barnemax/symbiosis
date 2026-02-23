import { getAllSpecies, getRelationshipById, getRelationshipTypes } from '@/lib/api'
import { updateRelationship } from '@/lib/actions'
import RelationshipForm from '../../new/_form'
import { getRelationshipLabel } from '@/lib/helpers'

export default async function EditRelationshipPage({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<React.JSX.Element> {
  const { id } = await params
  const [relationship, speciesData, types] = await Promise.all([getRelationshipById(id), getAllSpecies(), getRelationshipTypes()])
  const boundAction = updateRelationship.bind(null, Number(id))

  const label = getRelationshipLabel(relationship.type)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">
        Edit relationship
        <span className="ml-2 text-base font-normal text-stone-500">
          {relationship.subject.scientificName} → {label} → {relationship.object.scientificName}
        </span>
      </h1>
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <RelationshipForm
          species={speciesData.member}
          types={types}
          action={boundAction}
          initialData={relationship}
          submitLabel="Save changes"
        />
      </div>
    </div>
  )
}
