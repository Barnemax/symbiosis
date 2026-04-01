'use client'

import TranslationForm from '@/components/TranslationForm'
import type { Relationship } from '@/lib/types'

type ActionState = { error: string } | null
type ActionFn = (prevState: ActionState, formData: FormData) => Promise<ActionState>

export default function RelationshipTranslationForm({
  relationship,
  action,
}: {
  relationship: Relationship
  action: ActionFn
}): React.JSX.Element {
  return (
    <TranslationForm action={action} renderFields={locale => {
      const translation = relationship.translations.find(t => t.locale === locale)
      return (
        <div>
          <label className="mb-1 block text-sm text-stone-500">Notes</label>
          <textarea
            key={`notes-${locale}`}
            name="notes"
            rows={3}
            defaultValue={translation?.notes ?? ''}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
          />
        </div>
      )
    }} />
  )
}
