import { routing } from '@/i18n/routing'
import type { ConservationStatus } from './types'

export const COMMON_NAME_LOCALES = [...routing.locales, 'la'] as const

/**
 * Kingdom accents. Two hex values per kingdom because the graph paints to a
 * canvas, where CSS custom properties are not available - keep these in sync
 * with --bird / --tree / --fungus in globals.css.
 */
export const KINGDOM_CONFIG: Record<string, { color: string; colorDark: string }> = {
  bird:   { color: '#40718f', colorDark: '#7dabc9' },
  fungus: { color: '#a8672c', colorDark: '#d09a5f' },
  tree:   { color: '#4f8250', colorDark: '#86b583' },
}

export const KINGDOM_FIELDS: Record<string, { name: string; label: string; type: string; step?: string; placeholder?: string }[]> = {
  bird:   [{ label: 'Wingspan (cm)', name: 'wingspan', placeholder: 'e.g. 52', step: '0.1', type: 'number' }],
  fungus: [{ label: 'Substrate', name: 'substrate', placeholder: 'e.g. Deciduous woodland soil', type: 'text' }],
  tree:   [{ label: 'Max height (m)', name: 'maxHeight', placeholder: 'e.g. 40', step: '0.1', type: 'number' }],
}

const NEUTRAL_STATUS = 'bg-black/5 text-ink-muted dark:bg-white/10'

export const CONSERVATION_STATUSES: Record<ConservationStatus, { label: string; className: string }> = {
  CR: { className: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200', label: 'Critically Endangered' },
  DD: { className: NEUTRAL_STATUS, label: 'Data Deficient' },
  EN: { className: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200', label: 'Endangered' },
  EW: { className: 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200', label: 'Extinct in the Wild' },
  EX: { className: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200', label: 'Extinct' },
  LC: { className: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200', label: 'Least Concern' },
  NE: { className: NEUTRAL_STATUS, label: 'Not Evaluated' },
  NT: { className: 'bg-lime-100 text-lime-900 dark:bg-lime-950 dark:text-lime-200', label: 'Near Threatened' },
  VU: { className: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200', label: 'Vulnerable' },
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

