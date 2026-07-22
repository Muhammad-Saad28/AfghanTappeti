"use client"

import { useActionState } from "react"
import { login } from "./actions"

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: "" })

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-error-container text-on-error-container text-label-md px-4 py-3 rounded-lg">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="text-label-sm text-on-surface-variant block mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-md
                     placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary"
          placeholder="admin@afghantappeti.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-label-sm text-on-surface-variant block mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-md
                     placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary text-on-primary py-3 rounded-lg text-label-md tracking-widest uppercase
                   hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
