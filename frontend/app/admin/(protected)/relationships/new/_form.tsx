'use client'

import { useActionState } from 'react'
import type { Relationship, Species } from '@/lib/types'
import { getRelationshipLabel } from '@/lib/helpers'
import Combobox from '@/components/Combobox'

type ActionState = { error: string } | null
type ActionFn = (prevState: ActionState, formData: FormData) => Promise<ActionState>

export default function RelationshipForm({
  species,
  types,
  action,
  initialData,
  submitLabel = 'Create relationship',
}: {
  species: Species[]
  types: string[]
  action: ActionFn
  initialData?: Relationship
  submitLabel?: string
}): React.JSX.Element {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-stone-500">Subject (who acts)</label>
        <Combobox
          name="subjectId"
          options={species.map(s => ({ label: `${s.scientificName} (${s.family.kingdom})`, value: s.id }))}
          defaultValue={initialData?.subject.id}
          placeholder="Search species…"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-500">Relationship</label>
        <Combobox
          name="type"
          options={types.map(t => ({ label: getRelationshipLabel(t), value: t }))}
          defaultValue={initialData?.type}
          placeholder="Select type…"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-500">Object (acted upon)</label>
        <Combobox
          name="objectId"
          options={species.map(s => ({ label: `${s.scientificName} (${s.family.kingdom})`, value: s.id }))}
          defaultValue={initialData?.object.id}
          placeholder="Search species…"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-500">Notes (optional)</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={initialData?.notes ?? ''}
          placeholder="Additional ecological context…"
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
      >
        {pending ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
