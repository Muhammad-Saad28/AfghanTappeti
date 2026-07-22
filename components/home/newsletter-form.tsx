"use client"

import { useActionState } from "react"
import { subscribeNewsletter } from "@/lib/newsletter-actions"

export function NewsletterForm({ placeholder, cta }: { placeholder: string; cta: string }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, null)

  if (state?.success) {
    return <p className="font-body-md text-white/80">Thank you for subscribing!</p>
  }

  return (
    <form action={action} className="relative max-w-md mx-auto">
      <input
        name="email"
        type="email"
        required
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-white/30 py-4 focus:outline-none focus:border-secondary transition-colors font-body-md text-center placeholder:text-white/40"
      />
      <button
        type="submit"
        disabled={pending}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-secondary hover:text-white transition-colors text-3xl disabled:opacity-50"
      >
        →
      </button>
      {state?.error && <p className="text-error text-label-sm mt-2">{state.error}</p>}
    </form>
  )
}
