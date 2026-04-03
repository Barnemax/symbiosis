'use client'

import TranslationForm from '@/components/TranslationForm'
import type { Species } from '@/lib/types'

type ActionState = { error: string } | null
type ActionFn = (prevState: ActionState, formData: FormData) => Promise<ActionState>

export default function SpeciesTranslationForm({
  species,
  action,
}: {
  species: Species
  action: ActionFn
}): React.JSX.Element {
  const isFungus = species.family.kingdom === 'fungus'

  return (
    <TranslationForm action={action} renderFields={locale => {
      const translation = species.translations.find(t => t.locale === locale)
      return (
        <>
          <div>
            <label className="mb-1 block text-sm text-stone-500">Habitat</label>
            <input
              key={`habitat-${locale}`}
              type="text"
              name="habitat"
              defaultValue={translation?.habitat ?? ''}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
            />
          </div>

          {isFungus && (
            <div>
              <label className="mb-1 block text-sm text-stone-500">Substrate</label>
              <input
                key={`substrate-${locale}`}
                type="text"
                name="substrate"
                defaultValue={translation?.substrate ?? ''}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
              />
            </div>
          )}
        </>
      )
    }} />
  )
}
