'use client'

import { useActionState, useState } from 'react'
import { CONSERVATION_STATUSES } from '@/lib/constants'
import { routing, type AppLocale } from '@/i18n/routing'
import type { Family, Species } from '@/lib/types'
import Combobox from '@/components/Combobox'

type ActionState = { error: string } | null
type ActionFn = (prevState: ActionState, formData: FormData) => Promise<ActionState>

const KINGDOMS = ['bird', 'tree', 'fungus'] as const

export default function SpeciesForm({
  families,
  action,
  initialData,
  submitLabel = 'Create species',
}: {
  families: Family[]
  action: ActionFn
  initialData?: Species
  submitLabel?: string
}): React.JSX.Element {
  const [state, formAction, pending] = useActionState(action, null)
  const [kingdom, setKingdom] = useState(initialData?.family.kingdom ?? '')

  const filteredFamilies = kingdom ? families.filter(f => f.kingdom === kingdom) : []

  const cn = (locale: AppLocale | 'la'): string =>
    initialData?.commonNames.find(c => c.locale === locale)?.name ?? ''

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-stone-500">Kingdom</label>
        <Combobox
          name="kingdom"
          options={KINGDOMS.map(k => ({ label: k.charAt(0).toUpperCase() + k.slice(1), value: k }))}
          defaultValue={initialData?.family.kingdom}
          placeholder="Select kingdom…"
          required
          onChange={v => setKingdom(v as string)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-500">Family</label>
        <Combobox
          key={kingdom}
          name="familyId"
          options={filteredFamilies.map(f => ({ label: f.name, value: f.id }))}
          defaultValue={kingdom === initialData?.family.kingdom ? initialData?.family.id : undefined}
          placeholder={kingdom ? 'Search families…' : 'Select kingdom first'}
          required
          disabled={!kingdom}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-500">Scientific name</label>
        <input
          type="text"
          name="scientificName"
          required
          defaultValue={initialData?.scientificName}
          placeholder="e.g. Quercus robur"
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm italic text-stone-900 outline-none focus:border-stone-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-500">IUCN status</label>
        <Combobox
          name="conservationStatus"
          options={[
            { label: 'None', value: '' },
            ...Object.entries(CONSERVATION_STATUSES).map(([code, { label }]) => ({ label: `${code}, ${label}`, value: code })),
          ]}
          defaultValue={initialData?.conservationStatus ?? ''}
          placeholder="Select status…"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-500">Habitat</label>
        <input
          type="text"
          name="habitat"
          defaultValue={initialData?.habitat ?? ''}
          placeholder="e.g. Temperate broadleaf forests"
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
        />
      </div>

      {kingdom === 'bird' && (
        <div>
          <label className="mb-1 block text-sm text-stone-500">Wingspan (cm)</label>
          <input
            type="number"
            name="wingspan"
            step="0.1"
            defaultValue={initialData?.wingspan ?? ''}
            placeholder="e.g. 52"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
          />
        </div>
      )}

      {kingdom === 'tree' && (
        <div>
          <label className="mb-1 block text-sm text-stone-500">Max height (m)</label>
          <input
            type="number"
            name="maxHeight"
            step="0.1"
            defaultValue={initialData?.maxHeight ?? ''}
            placeholder="e.g. 40"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
          />
        </div>
      )}

      {kingdom === 'fungus' && (
        <div>
          <label className="mb-1 block text-sm text-stone-500">Substrate</label>
          <input
            type="text"
            name="substrate"
            defaultValue={initialData?.substrate ?? ''}
            placeholder="e.g. Deciduous woodland soil"
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
          />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm text-stone-500">Common names</label>
        <div className="space-y-2">
          {([...routing.locales, 'la'] as Array<AppLocale | 'la'>).map(locale => (
            <div key={locale} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-xs font-medium text-stone-400">{locale}</span>
              <input
                type="text"
                name={`cn_${locale}`}
                defaultValue={cn(locale)}
                placeholder={locale === routing.defaultLocale ? 'e.g. English Oak' : locale === 'fr' ? 'e.g. Chêne pédonculé' : 'e.g. Quercus robur'}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
              />
            </div>
          ))}
        </div>
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
