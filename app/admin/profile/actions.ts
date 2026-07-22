"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateProfile(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase
    .from("profiles")
    .update({
      full_name: (formData.get("full_name") as string) || null,
      avatar: (formData.get("avatar") as string) || null,
    })
    .eq("id", id)
  revalidatePath("/admin/profile")
}
