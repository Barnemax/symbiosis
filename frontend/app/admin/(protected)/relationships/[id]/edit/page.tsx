import { getAllSpecies, getRelationshipById, getRelationshipTypes } from '@/lib/api'
import { updateRelationship, updateRelationshipTranslation } from '@/lib/actions'
import { routing } from '@/i18n/routing'
import RelationshipForm from '../../new/_form'
import RelationshipTranslationForm from '../../new/_translation-form'
import { getRelationshipLabel } from '@/lib/helpers'

export default async function EditRelationshipPage({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<React.JSX.Element> {
  const { id } = await params
  const [relationship, speciesData, types] = await Promise.all([getRelationshipById(id), getAllSpecies(), getRelationshipTypes()])
  const boundAction = updateRelationship.bind(null, Number(id))
  const boundTranslationAction = updateRelationshipTranslation.bind(null, Number(id))
  const hasTranslations = routing.locales.length > 1

  const label = getRelationshipLabel(relationship.type)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">
        Edit relationship
        <span className="ml-2 text-base font-normal text-stone-500">
          {relationship.subject.scientificName} → {label} → {relationship.object.scientificName}
        </span>
      </h1>
      <div className="space-y-6">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-stone-400">{routing.defaultLocale}</p>
          <RelationshipForm
            species={speciesData.member}
            types={types}
            action={boundAction}
            initialData={relationship}
            submitLabel="Save changes"
          />
        </div>
        {hasTranslations && (
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-stone-400">Translations</p>
            <RelationshipTranslationForm relationship={relationship} action={boundTranslationAction} />
          </div>
        )}
      </div>
    </div>
  )
}
