'use client'

import Image from 'next/image'
import { useState } from 'react'
import { KingdomIcon } from '@/components/icons'

/**
 * Wraps next/image with a kingdom-marked placeholder, so a dead media URL
 * degrades to a plate frame instead of a broken-image glyph.
 */
export default function SpeciesImage({
  src,
  alt,
  kingdom,
  className,
  sizes,
  priority,
}: {
  src: string | undefined
  alt: string
  kingdom?: string
  className?: string
  sizes?: string
  priority?: boolean
}): React.JSX.Element {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-paper-sunk">
        {kingdom && <KingdomIcon kingdom={kingdom} className="h-8 w-8 text-ink-faint/40" />}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={className}
      unoptimized
    />
  )
}
