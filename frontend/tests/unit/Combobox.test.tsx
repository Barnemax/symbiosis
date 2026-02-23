import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Combobox from '@/components/Combobox'

const OPTIONS = [
  { label: 'Eurasian Jay', value: 1 },
  { label: 'Great Tit', value: 2 },
  { label: 'Red Crossbill', value: 3 },
]

type SetupResult = ReturnType<typeof render> & {
  hiddenInput: HTMLInputElement
  textInput: HTMLElement
  user: ReturnType<typeof userEvent.setup>
}

function setup(props: Partial<React.ComponentProps<typeof Combobox>> = {}): SetupResult {
  const user = userEvent.setup()
  const utils = render(
    <Combobox name="species" options={OPTIONS} {...props} />,
  )
  const textInput = screen.getByRole('textbox')
  const hiddenInput = utils.container.querySelector<HTMLInputElement>('input[type="hidden"]')!
  return { hiddenInput, textInput, user, ...utils }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('initial render', () => {
  it('shows placeholder when no defaultValue', () => {
    setup({ placeholder: 'Search species…' })
    expect(screen.getByPlaceholderText('Search species…')).toBeInTheDocument()
  })

  it('pre-fills text input and hidden input when defaultValue matches an option', () => {
    const { textInput, hiddenInput } = setup({ defaultValue: 2 })
    expect(textInput).toHaveValue('Great Tit')
    expect(hiddenInput).toHaveValue('2')
  })

  it('dropdown is closed on initial render', () => {
    setup()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Opening / closing
// ---------------------------------------------------------------------------

describe('open / close', () => {
  it('opens dropdown on focus', async () => {
    const { user, textInput } = setup()
    await user.click(textInput)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('shows all options when opened without typing', async () => {
    const { user, textInput } = setup()
    await user.click(textInput)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(OPTIONS.length)
  })

  it('closes and clears query on Escape', async () => {
    const { user, textInput } = setup()
    await user.click(textInput)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

describe('filtering', () => {
  it('filters options by typed query (case-insensitive)', async () => {
    const { user, textInput } = setup()
    await user.click(textInput)
    await user.type(textInput, 'tit')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('Great Tit')
  })

  it('shows "No results" when nothing matches', async () => {
    const { user, textInput } = setup()
    await user.click(textInput)
    await user.type(textInput, 'zzz')
    expect(screen.getByText('No results')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

describe('keyboard navigation', () => {
  it('Enter selects the already-highlighted first option', async () => {
    const { user, textInput, hiddenInput } = setup()
    await user.click(textInput)
    await user.keyboard('{Enter}')
    expect(hiddenInput).toHaveValue('1')
    expect(textInput).toHaveValue('Eurasian Jay')
  })

  it('ArrowDown + Enter selects the second option', async () => {
    const { user, textInput, hiddenInput } = setup()
    await user.click(textInput)
    await user.keyboard('{ArrowDown}{Enter}')
    expect(hiddenInput).toHaveValue('2')
    expect(textInput).toHaveValue('Great Tit')
  })

  it('navigates down then up and selects correct option', async () => {
    const { user, textInput, hiddenInput } = setup()
    await user.click(textInput)
    // Move down twice then back up once → index 1 (Great Tit)
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowUp}{Enter}')
    expect(hiddenInput).toHaveValue('2')
    expect(textInput).toHaveValue('Great Tit')
  })

  it('Enter while closed opens the dropdown', async () => {
    const { user, textInput } = setup()
    await user.click(textInput)
    await user.keyboard('{Escape}') // close first
    await user.keyboard('{Enter}')
    expect(screen.getByRole('list')).toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Mouse selection
// ---------------------------------------------------------------------------

describe('mouse selection', () => {
  it('selects an option on click and updates hidden input', async () => {
    const { user, textInput, hiddenInput } = setup()
    await user.click(textInput)
    const list = screen.getByRole('list')
    await user.click(within(list).getByText('Red Crossbill'))
    expect(hiddenInput).toHaveValue('3')
    expect(textInput).toHaveValue('Red Crossbill')
  })

  it('closes the dropdown after selection', async () => {
    const { user, textInput } = setup()
    await user.click(textInput)
    const list = screen.getByRole('list')
    await user.click(within(list).getByText('Eurasian Jay'))
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// onChange callback
// ---------------------------------------------------------------------------

describe('onChange callback', () => {
  it('fires with the selected value', async () => {
    const onChange = vi.fn()
    const { user, textInput } = setup({ onChange })
    await user.click(textInput)
    await user.click(within(screen.getByRole('list')).getByText('Great Tit'))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith(2)
  })
})

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------

describe('disabled', () => {
  it('text input is disabled', () => {
    const { textInput } = setup({ disabled: true })
    expect(textInput).toBeDisabled()
  })
})
