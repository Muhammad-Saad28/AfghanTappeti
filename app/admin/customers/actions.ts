"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase
    .from("customers")
    .update({
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
    })
    .eq("id", id)
  revalidatePath("/admin/customers")
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()
  await supabase.from("customers").delete().eq("id", id)
  revalidatePath("/admin/customers")
}
