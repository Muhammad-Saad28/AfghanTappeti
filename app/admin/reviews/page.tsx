import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

async function approveReview(id: string) {
  "use server"
  const supabase = await createClient()
  await supabase.from("reviews").update({ is_approved: true }).eq("id", id)
  revalidatePath("/admin/reviews")
}

async function deleteReview(id: string) {
  "use server"
  const supabase = await createClient()
  await supabase.from("reviews").delete().eq("id", id)
  revalidatePath("/admin/reviews")
}

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, products(name)")
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-6">Reviews</h1>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Product</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Rating</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Status</th>
              <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-on-surface-variant font-body-md">No reviews yet.</td>
              </tr>
            )}
            {reviews?.map((review) => (
              <tr key={review.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-4">
                  <p className="font-body-md text-on-surface">{review.customer_name}</p>
                  {review.title && <p className="font-label-sm text-label-sm text-on-surface-variant">{review.title}</p>}
                </td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant hidden md:table-cell">
                  {review.products?.name ?? "—"}
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-secondary">{Array.from({ length: review.rating }).map(() => "★").join("")}</span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className={`inline-block px-2 py-0.5 rounded text-label-sm font-label-sm ${
                    review.is_approved ? "bg-secondary-container text-on-secondary-container" : "bg-surface-variant text-on-surface-variant"
                  }`}>
                    {review.is_approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!review.is_approved && (
                      <form action={approveReview.bind(null, review.id)}>
                        <button type="submit" className="text-label-sm text-secondary hover:text-secondary-fixed-dim transition-colors">Approve</button>
                      </form>
                    )}
                    <form action={deleteReview.bind(null, review.id)}>
                      <button type="submit" className="text-label-sm text-on-surface-variant hover:text-error transition-colors">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
