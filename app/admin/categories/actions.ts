"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const slug = raw.name
    ? (raw.name as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    : ""

  await supabase.from("categories").insert({
    name: raw.name as string,
    slug,
    description: raw.description as string,
    display_order: Number(raw.display_order) || 0,
    is_active: raw.is_active === "on",
  })

  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const slug = raw.name
    ? (raw.name as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    : ""

  await supabase.from("categories").update({
    name: raw.name as string,
    slug,
    description: raw.description as string,
    display_order: Number(raw.display_order) || 0,
    is_active: raw.is_active === "on",
  }).eq("id", id)

  revalidatePath("/admin/categories")
  redirect("/admin/categories")
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  await supabase.from("categories").delete().eq("id", id)
  revalidatePath("/admin/categories")
}
