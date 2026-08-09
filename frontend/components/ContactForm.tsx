'use client'

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef } from 'react'
import Combobox from './Combobox'
import { sendContact } from '@/lib/actions'
import type { ComboboxOption } from './Combobox'

export default function ContactForm({ speciesOptions }: { speciesOptions: ComboboxOption[] }): React.JSX.Element {
  const t = useTranslations('contact')
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
        <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
          {state.success}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-ink-faint">
          {t('email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-ink-faint"
          placeholder={t('email_placeholder')}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-ink-faint">{t('species')}</label>
        <Combobox name="speciesName" options={speciesOptions} placeholder={t('species_placeholder')} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-ink-faint">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          className="max-h-56 w-full resize-y rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-ink-faint"
          placeholder={t('message_placeholder')}
        />
      </div>

      <Turnstile ref={turnstileRef} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} />

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {pending ? t('sending') : t('send')}
      </button>
    </form>
  )
}
