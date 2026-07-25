"use server"

import { createClient } from "@/lib/supabase/server"

export async function submitContactMessage(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean } | null> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject,
    message,
  })

  if (error) {
    return { error: "Failed to send message. Please try again." }
  }

  return { success: true }
}
