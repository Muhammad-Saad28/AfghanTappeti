"use client"

import { useActionState } from "react"
import { loginCustomer } from "@/lib/customer-actions"

export function LoginForm({ locale }: { locale: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      formData.set("lang", locale)
      try {
        await loginCustomer(formData)
        return null
      } catch (e) {
        return e instanceof Error ? e.message : "Invalid credentials"
      }
    },
    null
  )

  return (
    <form action={formAction} className="space-y-6">
      {state && <p className="bg-error-container text-error px-4 py-3 rounded-lg font-body-md">{state}</p>}
      <div>
        <label htmlFor="email" className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Email *</label>
        <input id="email" name="email" type="email" required className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
      </div>
      <div>
        <label htmlFor="password" className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Password *</label>
        <input id="password" name="password" type="password" required className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
      </div>
      <button type="submit" disabled={pending} className="w-full bg-primary text-on-primary py-4 rounded-lg text-label-md hover:bg-primary-fixed-dim transition-colors disabled:opacity-50">
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}
