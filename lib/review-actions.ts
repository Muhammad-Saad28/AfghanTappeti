"use server"

import { createClient } from "@/lib/supabase/server"

export async function submitReview(productId: string, prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    customer_name: formData.get("name") as string,
    country: (formData.get("country") as string) || null,
    rating: parseInt(formData.get("rating") as string) || 5,
    title: (formData.get("title") as string) || null,
    review: formData.get("review") as string,
    is_approved: false,
  })

  if (error) return { error: error.message }
  return { success: true }
}
