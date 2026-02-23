'use client'

import { useActionState } from 'react'
import { login } from '@/lib/actions'

export default function LoginPage(): React.JSX.Element {
  const [state, action, pending] = useActionState(login, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-8">
        <h1 className="mb-6 text-xl font-semibold text-stone-900">Admin login</h1>
        <form action={action} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            autoFocus
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none focus:border-stone-400"
          />
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
          >
            {pending ? 'Checking…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
