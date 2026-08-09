'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SearchIcon } from '@/components/icons'

export default function SearchInput({ defaultValue, placeholder }: { defaultValue: string; placeholder: string }): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const searchParamsRef = useRef(searchParams)
  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  const push = useCallback((search: string) => {
    const params = new URLSearchParams(searchParamsRef.current.toString())
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    params.delete('page') // reset to page 1 on new search
    router.replace(`${pathname}?${params.toString()}`)
  }, [router, pathname])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => push(value), 300)
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [value, push])

  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-line bg-surface py-2 pl-10 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-ink-faint focus:outline-none"
      />
    </div>
  )
}
