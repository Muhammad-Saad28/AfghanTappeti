"use client"

import { useActionState } from "react"
import { submitReview } from "@/lib/review-actions"
import type { submitReview as SubmitReviewType } from "@/lib/review-actions"

export function ReviewForm({
  productId,
  t,
}: {
  productId: string
  t: {
    write_review: string
    your_name: string
    your_country: string
    review_title: string
    review_text: string
    rating: string
    submit_review: string
    review_thanks: string
  }
}) {
  const [state, action, pending] = useActionState(submitReview.bind(null, productId), null)

  if (state?.success) {
    return <p className="font-body-md text-secondary">{t.review_thanks}</p>
  }

  return (
    <form action={action} className="space-y-4">
      <h3 className="font-headline-xs text-headline-xs text-on-surface">{t.write_review}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{t.your_name} *</label>
          <input name="name" required className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{t.your_country}</label>
          <input name="country" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
        </div>
      </div>
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{t.review_title}</label>
        <input name="title" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
      </div>
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{t.rating} *</label>
        <select name="rating" defaultValue="5" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} ★</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{t.review_text} *</label>
        <textarea name="review" required rows={4} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary resize-none" />
      </div>
      <button type="submit" disabled={pending} className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-sm hover:bg-primary-fixed-dim transition-colors disabled:opacity-50">
        {t.submit_review}
      </button>
      {state?.error && <p className="text-error text-label-sm">{state.error}</p>}
    </form>
  )
}
