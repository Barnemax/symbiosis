import { routing } from '@/i18n/routing'
import type { ConservationStatus } from './types'

export const COMMON_NAME_LOCALES = [...routing.locales, 'la'] as const

export const KINGDOM_CONFIG: Record<string, { color: string; icon: string }> = {
  bird:   { color: '#3b82f6', icon: '🪶' },
  fungus: { color: '#f97316', icon: '🍄' },
  tree:   { color: '#22c55e', icon: '🌳' },
}

export const KINGDOM_FIELDS: Record<string, { name: string; label: string; type: string; step?: string; placeholder?: string }[]> = {
  bird:   [{ label: 'Wingspan (cm)', name: 'wingspan', placeholder: 'e.g. 52', step: '0.1', type: 'number' }],
  fungus: [{ label: 'Substrate', name: 'substrate', placeholder: 'e.g. Deciduous woodland soil', type: 'text' }],
  tree:   [{ label: 'Max height (m)', name: 'maxHeight', placeholder: 'e.g. 40', step: '0.1', type: 'number' }],
}

export const CONSERVATION_STATUSES: Record<ConservationStatus, { label: string; className: string }> = {
  CR: { className: 'bg-red-100 text-red-800', label: 'Critically Endangered' },
  DD: { className: 'bg-stone-100 text-stone-600', label: 'Data Deficient' },
  EN: { className: 'bg-orange-100 text-orange-800', label: 'Endangered' },
  EW: { className: 'bg-purple-100 text-purple-800', label: 'Extinct in the Wild' },
  EX: { className: 'bg-gray-100 text-gray-800', label: 'Extinct' },
  LC: { className: 'bg-green-100 text-green-800', label: 'Least Concern' },
  NE: { className: 'bg-stone-100 text-stone-600', label: 'Not Evaluated' },
  NT: { className: 'bg-lime-100 text-lime-800', label: 'Near Threatened' },
  VU: { className: 'bg-yellow-100 text-yellow-800', label: 'Vulnerable' },
}

export const RELATIONSHIP_LABELS: Record<string, string> = {
  disperses_seeds_of: 'Disperses seeds of',
  disperses_spores_of: 'Disperses spores of',
  feeds_on: 'Feeds on',
  grows_on: 'Grows on',
  mycorrhiza_with: 'Mycorrhizal partner of',
  nests_in: 'Nests in',
  parasitises: 'Parasitises',
  symbiosis_with: 'Symbiosis with',
}

