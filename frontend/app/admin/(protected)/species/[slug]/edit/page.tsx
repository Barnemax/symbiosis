import { getFamilies, getSpeciesBySlugAdmin } from '@/lib/api'
import { updateSpecies } from '@/lib/actions'
import SpeciesForm from '../../new/_form'

export default async function EditSpeciesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<React.JSX.Element> {
  const { slug } = await params
  const [species, familiesData] = await Promise.all([getSpeciesBySlugAdmin(slug), getFamilies()])
  const boundAction = updateSpecies.bind(null, species.id)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">
        Edit <span className="italic">{species.scientificName}</span>
      </h1>
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <SpeciesForm
          families={familiesData.member}
          action={boundAction}
          initialData={species}
          submitLabel="Save changes"
        />
      </div>
    </div>
  )
}
