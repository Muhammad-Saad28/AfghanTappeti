"use client"

import { useActionState } from "react"
import { submitContactMessage } from "@/lib/contact-actions"

export function ContactForm({ t }: { t: Record<string, string> }) {
  const [state, formAction] = useActionState(submitContactMessage, null)

  return (
    <form action={formAction} className="space-y-8">
      {state?.success && (
        <p className="font-body-md text-green-700 bg-green-100 px-4 py-3 rounded-lg">Message sent successfully! We&apos;ll get back to you soon.</p>
      )}
      {state?.error && (
        <p className="font-body-md text-red-700 bg-red-100 px-4 py-3 rounded-lg">{state.error}</p>
      )}
      <div>
        <label htmlFor="name" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">{t.form_name}</label>
        <input id="name" name="name" type="text" required className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" />
      </div>
      <div>
        <label htmlFor="email" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">{t.form_email}</label>
        <input id="email" name="email" type="email" required className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" />
      </div>
      <div>
        <label htmlFor="subject" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">{t.form_subject}</label>
        <input id="subject" name="subject" type="text" className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" />
      </div>
      <div>
        <label htmlFor="message" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">{t.form_message}</label>
        <textarea id="message" name="message" rows={4} required className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none" />
      </div>
      <button type="submit" className="bg-primary text-white px-12 py-4 font-label-md text-label-md hover:bg-secondary transition-colors">{t.form_submit}</button>
    </form>
  )
}
