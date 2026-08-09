import type { Kingdom } from '@/lib/types'

type IconProps = {
  className?: string
}

/**
 * Line-art icons drawn on a 24-unit grid with a 1.5 stroke, so they sit at the
 * same optical weight as the type. Kingdom marks are deliberately drawn rather
 * than emoji — emoji render differently per platform and read as placeholder.
 */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.5,
} as const

/**
 * Brand mark: three kingdoms as nodes, bound by the relationships between them
 * — the dataset's own shape. Drawn in currentColor so it inherits the theme and
 * stays crisp at any size, unlike the pixel-art PNG it replaces.
 */
export function SymbiosisMark({ className }: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      {/* Curved rather than straight: growth, not circuitry. */}
      <path
        d="M16 7Q7.6 12.4 6.8 23.4Q16 28.4 25.2 23.4Q24.4 12.4 16 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <g fill="currentColor">
        <circle cx="16" cy="7" r="3.6" />
        <circle cx="6.8" cy="23.4" r="3" />
        <circle cx="25.2" cy="23.4" r="3" />
      </g>
    </svg>
  )
}

export function FeatherIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M19.5 4.5c0 6.9-4.6 11.4-11.5 12.2L5 20" />
      <path d="M19.5 4.5C13.4 4.9 8.6 7.4 8 16.7" />
      <path d="M9.2 15.6h5.2M10.2 12.2h4.6M12 9.1h3.4" />
    </svg>
  )
}

export function TreeIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M12 21v-6.5" />
      <path d="M12 14.5 8.2 11M12 12l3.4-3.2" />
      <path d="M12 3.2c3.3 0 5.6 2.3 5.6 5 0 .7-.1 1.3-.4 1.9 1 .6 1.6 1.7 1.6 3 0 2-1.7 3.6-3.8 3.6H9c-2.1 0-3.8-1.6-3.8-3.6 0-1.3.6-2.4 1.6-3a4.6 4.6 0 0 1-.4-1.9c0-2.7 2.3-5 5.6-5Z" />
    </svg>
  )
}

export function MushroomIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M3.6 11.4c0-4.6 3.8-8 8.4-8s8.4 3.4 8.4 8c0 .9-.8 1.6-1.8 1.6H5.4c-1 0-1.8-.7-1.8-1.6Z" />
      <path d="M9.4 13v5.6c0 1.2.9 2 2.6 2s2.6-.8 2.6-2V13" />
      <path d="M8.2 8.1h.01M12 6.4h.01M15.8 8.6h.01" />
    </svg>
  )
}

const KINGDOM_ICONS: Record<string, (props: IconProps) => React.JSX.Element> = {
  bird: FeatherIcon,
  fungus: MushroomIcon,
  tree: TreeIcon,
}

export function KingdomIcon({
  kingdom,
  className,
}: {
  kingdom: Kingdom | string
  className?: string
}): React.JSX.Element | null {
  const Icon = KINGDOM_ICONS[kingdom]
  return Icon == null ? null : <Icon className={className} />
}

export function SearchIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

export function SunIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.8v2M12 19.2v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.8 12h2M19.2 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  )
}

export function MoonIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2Z" />
    </svg>
  )
}

export function MenuIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function ArrowRightIcon({ className }: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  )
}
