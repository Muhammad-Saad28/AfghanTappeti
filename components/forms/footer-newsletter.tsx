"use client"

import { useActionState } from "react"
import { subscribeNewsletter } from "@/lib/newsletter-actions"

export function FooterNewsletter({ placeholder, cta }: { placeholder: string; cta: string }) {
  const [state, formAction] = useActionState(subscribeNewsletter, null)

  return (
    <div className="space-y-4">
      <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-primary">Newsletter</h4>
      {state?.success ? (
        <p className="text-label-sm text-green-700">Subscribed!</p>
      ) : (
        <form action={formAction} className="flex gap-2">
          <input name="email" type="email" placeholder={placeholder} required className="flex-1 bg-transparent border-b border-outline-variant py-2 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-on-surface-variant/60" />
          <button type="submit" className="text-label-sm font-label-sm text-secondary whitespace-nowrap hover:text-secondary-fixed-dim transition-colors">{cta}</button>
        </form>
      )}
      {state?.error && <p className="text-label-sm text-red-600">{state.error}</p>}
    </div>
  )
}
