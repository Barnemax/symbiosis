import { getFamilies, getSpeciesBySlugAdmin } from '@/lib/api'
import { updateSpecies, updateSpeciesTranslation } from '@/lib/actions'
import { routing } from '@/i18n/routing'
import SpeciesForm from '../../new/_form'
import SpeciesTranslationForm from '../../new/_translation-form'

export default async function EditSpeciesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<React.JSX.Element> {
  const { slug } = await params
  const [species, familiesData] = await Promise.all([getSpeciesBySlugAdmin(slug), getFamilies()])
  const boundAction = updateSpecies.bind(null, species.id)
  const boundTranslationAction = updateSpeciesTranslation.bind(null, species.id)
  const hasTranslations = routing.locales.length > 1

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">
        Edit <span className="italic">{species.scientificName}</span>
      </h1>
      <div className="space-y-6">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-stone-400">{routing.defaultLocale}</p>
          <SpeciesForm
            families={familiesData.member}
            action={boundAction}
            initialData={species}
            submitLabel="Save changes"
          />
        </div>
        {hasTranslations && (
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-stone-400">Translations</p>
            <SpeciesTranslationForm species={species} action={boundTranslationAction} />
          </div>
        )}
      </div>
    </div>
  )
}
