"use client"

import { useActionState } from "react"
import { registerCustomer } from "@/lib/customer-actions"

export function RegisterForm({ locale }: { locale: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      formData.set("lang", locale)
      try {
        await registerCustomer(formData)
        return null
      } catch (e) {
        return e instanceof Error ? e.message : "Registration failed"
      }
    },
    null
  )

  return (
    <form action={formAction} className="space-y-6">
      {state && <p className="bg-error-container text-error px-4 py-3 rounded-lg font-body-md">{state}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block font-label-sm text-label-sm text-on-surface-variant mb-1">First Name *</label>
          <input id="first_name" name="first_name" required className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
        </div>
        <div>
          <label htmlFor="last_name" className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Last Name *</label>
          <input id="last_name" name="last_name" required className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Email *</label>
        <input id="email" name="email" type="email" required className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
      </div>
      <div>
        <label htmlFor="password" className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Password *</label>
        <input id="password" name="password" type="password" required minLength={6} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
      </div>
      <button type="submit" disabled={pending} className="w-full bg-primary text-on-primary py-4 rounded-lg text-label-md hover:bg-primary-fixed-dim transition-colors disabled:opacity-50">
        {pending ? "Creating account..." : "Create Account"}
      </button>
    </form>
  )
}
