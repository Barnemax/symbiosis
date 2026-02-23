'use client'

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useActionState, useEffect, useRef } from 'react'
import Combobox from './Combobox'
import { sendContact } from '@/lib/actions'
import type { ComboboxOption } from './Combobox'

export default function ContactForm({ speciesOptions }: { speciesOptions: ComboboxOption[] }): React.JSX.Element {
  const [state, action, pending] = useActionState(sendContact, null)
  const formRef = useRef<HTMLFormElement>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      turnstileRef.current?.reset()
    }
  }, [state?.success])

  return (
    <form ref={formRef} action={action} className="space-y-5">
      {state?.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{state.success}</p>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Species (optional)</label>
        <Combobox name="speciesName" options={speciesOptions} placeholder="Search for a species…" />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-stone-700">Message</label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
          placeholder="Describe a correction, suggest a species, or just say hello…"
        />
      </div>

      <Turnstile ref={turnstileRef} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} />

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-stone-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
