import { getFamilies, getKingdoms } from '@/lib/api'
import { createSpecies } from '@/lib/actions'
import SpeciesForm from './_form'

export default async function NewSpeciesPage(): Promise<React.JSX.Element> {
  const [familiesData, kingdoms] = await Promise.all([getFamilies(), getKingdoms()])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">Add species</h1>
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <SpeciesForm families={familiesData.member} kingdoms={kingdoms} action={createSpecies} submitLabel="Create species" />
      </div>
    </div>
  )
}
