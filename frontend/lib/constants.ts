import { routing } from '@/i18n/routing'
import type { ConservationStatus, Kingdom } from './types'

export const COMMON_NAME_LOCALES = [...routing.locales, 'la'] as const

export const KINGDOM_HREFS = {
  bird: '/birds',
  fungus: '/fungi',
  tree: '/trees',
} as const satisfies Record<Kingdom, string>

export const KINGDOM_SLUG_HREFS = {
  bird: '/birds/[slug]',
  fungus: '/fungi/[slug]',
  tree: '/trees/[slug]',
} as const satisfies Record<Kingdom, string>

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

export const KINGDOM_MAP: Record<string, Kingdom> = {
  birds: 'bird',
  fungi: 'fungus',
  trees: 'tree',
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

