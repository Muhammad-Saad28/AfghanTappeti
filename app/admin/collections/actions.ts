"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function createCollection(formData: FormData) {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const slug = raw.name
    ? (raw.name as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    : ""

  await supabase.from("collections").insert({
    name: raw.name as string,
    slug,
    description: raw.description as string,
    banner_image: raw.banner_image as string,
    is_active: raw.is_active === "on",
  })

  revalidatePath("/admin/collections")
  redirect("/admin/collections")
}

export async function updateCollection(id: string, formData: FormData) {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const slug = raw.name
    ? (raw.name as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    : ""

  await supabase.from("collections").update({
    name: raw.name as string,
    slug,
    description: raw.description as string,
    banner_image: raw.banner_image as string,
    is_active: raw.is_active === "on",
  }).eq("id", id)

  revalidatePath("/admin/collections")
  redirect("/admin/collections")
}

export async function deleteCollection(id: string) {
  const supabase = await createClient()
  await supabase.from("collections").delete().eq("id", id)
  revalidatePath("/admin/collections")
}
