"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function toggleSubscriber(id: string, isActive: boolean) {
  const supabase = await createClient()
  await supabase.from("newsletter_subscribers").update({ is_active: !isActive }).eq("id", id)
  revalidatePath("/admin/newsletter")
}

export async function deleteSubscriber(id: string) {
  const supabase = await createClient()
  await supabase.from("newsletter_subscribers").delete().eq("id", id)
  revalidatePath("/admin/newsletter")
}
