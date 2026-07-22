"use server"

import { createClient } from "@/lib/supabase/server"

export async function subscribeNewsletter(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const email = formData.get("email") as string
  if (!email) return { error: "Email is required" }

  const supabase = await createClient()

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email, is_active: true }, { onConflict: "email" })

  if (error) return { error: error.message }
  return { success: true }
}
