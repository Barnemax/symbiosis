import { act, render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import SearchInput from '@/components/SearchInput'

const mockReplace = vi.fn()
const mockPathname = '/birds'
let mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}))

beforeEach(() => {
  mockReplace.mockClear()
  mockSearchParams = new URLSearchParams()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function type(value: string): void {
  fireEvent.change(screen.getByRole('textbox'), { target: { value } })
}

describe('SearchInput', () => {
  it('renders with the provided default value', () => {
    render(<SearchInput defaultValue="jay" />)
    expect(screen.getByRole('textbox')).toHaveValue('jay')
  })

  it('renders empty when defaultValue is empty string', () => {
    render(<SearchInput defaultValue="" />)
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('debounces: does not call router.replace before 300ms', () => {
    render(<SearchInput defaultValue="" />)
    type('oak')
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('calls router.replace with search param after 300ms', () => {
    render(<SearchInput defaultValue="" />)
    type('oak')
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(mockReplace).toHaveBeenCalledWith('/birds?search=oak')
  })

  it('removes search param when input is cleared', () => {
    mockSearchParams = new URLSearchParams('search=jay')
    render(<SearchInput defaultValue="jay" />)
    type('')
    act(() => {
      vi.advanceTimersByTime(300)
    })
    const url = mockReplace.mock.calls.at(-1)?.[0] as string
    expect(url).not.toContain('search=')
  })

  it('resets page param on new search', () => {
    mockSearchParams = new URLSearchParams('page=3')
    render(<SearchInput defaultValue="" />)
    type('pine')
    act(() => {
      vi.advanceTimersByTime(300)
    })
    const url = mockReplace.mock.calls.at(-1)?.[0] as string
    expect(url).not.toContain('page=')
    expect(url).toContain('search=pine')
  })

  it('preserves unrelated query params', () => {
    mockSearchParams = new URLSearchParams('sort=name')
    render(<SearchInput defaultValue="" />)
    type('oak')
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(mockReplace).toHaveBeenCalledWith('/birds?sort=name&search=oak')
  })

  it('resets the debounce timer on rapid typing', () => {
    render(<SearchInput defaultValue="" />)
    type('o')
    act(() => {
      vi.advanceTimersByTime(200)
    })
    type('oa')
    act(() => {
      vi.advanceTimersByTime(200)
    })
    // 400ms elapsed but timer restarted, should not have fired yet
    expect(mockReplace).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(mockReplace).toHaveBeenCalledWith('/birds?search=oa')
  })
})
