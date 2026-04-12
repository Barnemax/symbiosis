'use client'

import { useEffect, useRef, useState } from 'react'

export interface ComboboxOption {
  value: string | number
  label: string
}

export default function Combobox({
  name,
  options,
  defaultValue,
  placeholder = 'Search…',
  required,
  disabled = false,
  onChange,
}: {
  name: string
  options: ComboboxOption[]
  defaultValue?: string | number
  placeholder?: string
  required?: boolean
  disabled?: boolean
  onChange?: (value: string | number) => void
}): React.JSX.Element {
  const initial = defaultValue != null
    ? (options.find(o => String(o.value) === String(defaultValue)) ?? null)
    : null

  const [selected, setSelected] = useState<ComboboxOption | null>(initial)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = query
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  useEffect(() => {
    function onMouseDown(e: MouseEvent): void {
      if (containerRef.current?.contains(e.target as Node) === false) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function select(option: ComboboxOption): void {
    setSelected(option)
    setOpen(false)
    setQuery('')
    onChange?.(option.value)
  }

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true)
        e.preventDefault()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        setHighlighted(h => Math.min(h + 1, filtered.length - 1))
        e.preventDefault()
        break
      case 'ArrowUp':
        setHighlighted(h => Math.max(h - 1, 0))
        e.preventDefault()
        break
      case 'Enter':
        if (highlighted < filtered.length) {
          select(filtered[highlighted])
        }
        e.preventDefault()
        break
      case 'Escape':
        setOpen(false)
        setQuery('')
        break
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selected?.value ?? ''} />
      <input
        type="text"
        value={open ? query : (selected?.label ?? '')}
        placeholder={disabled ? undefined : placeholder}
        disabled={disabled}
        required={required}
        onChange={e => {
 setQuery(e.target.value); setOpen(true); setHighlighted(0) 
}}
        onFocus={() => {
 setOpen(true); setQuery(''); setHighlighted(0) 
}}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400 disabled:opacity-50"
      />
      {open && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-stone-200 bg-white py-1 shadow-md">
          {filtered.length > 0 ? filtered.map((option, i) => {
            const isSelected = selected?.value === option.value
            const isHighlighted = i === highlighted
            return (
              <li
                key={option.value}
                onMouseDown={() => select(option)}
                onMouseEnter={() => setHighlighted(i)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  isSelected
                    ? 'bg-stone-900 text-white'
                    : isHighlighted
                      ? 'bg-stone-100 text-stone-900'
                      : 'text-stone-700'
                }`}
              >
                {option.label}
              </li>
            )
          }) : (
            <li className="px-3 py-2 text-sm text-stone-400">No results</li>
          )}
        </ul>
      )}
    </div>
  )
}
