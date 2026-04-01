'use client'

import { useActionState, useState } from 'react'
import { routing, type AppLocale } from '@/i18n/routing'

type ActionState = { error: string } | null
type ActionFn = (prevState: ActionState, formData: FormData) => Promise<ActionState>

const nonDefaultLocales = routing.locales.filter(l => l !== routing.defaultLocale) as AppLocale[]

export default function TranslationForm({
    action,
    renderFields,
}: {
    action: ActionFn
    renderFields: (locale: AppLocale) => React.ReactNode
}): React.JSX.Element {
    const [state, formAction, pending] = useActionState(action, null)
    const [locale, setLocale] = useState<AppLocale>(nonDefaultLocales[0])

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />

            <div className="flex gap-1 rounded-lg bg-stone-100 p-1">
                {nonDefaultLocales.map(l => (
                    <button
                        key={l}
                        type="button"
                        onClick={() => setLocale(l)}
                        className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${locale === l ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                            }`}
                    >
                        {l.toUpperCase()}
                    </button>
                ))}
            </div>

            {renderFields(locale)}

            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

            <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
            >
                {pending ? 'Saving…' : `Save ${locale.toUpperCase()} translation`}
            </button>
        </form>
    )
}
