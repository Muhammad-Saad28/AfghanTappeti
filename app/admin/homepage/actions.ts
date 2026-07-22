"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function createSection(formData: FormData) {
  const supabase = await createClient()
  await supabase.from("homepage_sections").insert({
    section_name: formData.get("section_name") as string,
    title: (formData.get("title") as string) || null,
    subtitle: (formData.get("subtitle") as string) || null,
    button_text: (formData.get("button_text") as string) || null,
    button_link: (formData.get("button_link") as string) || null,
    image: (formData.get("image") as string) || null,
    display_order: parseInt(formData.get("display_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
  })
  revalidatePath("/admin/homepage")
}

export async function updateSection(id: string, formData: FormData) {
  const supabase = await createClient()
  await supabase
    .from("homepage_sections")
    .update({
      section_name: formData.get("section_name") as string,
      title: (formData.get("title") as string) || null,
      subtitle: (formData.get("subtitle") as string) || null,
      button_text: (formData.get("button_text") as string) || null,
      button_link: (formData.get("button_link") as string) || null,
      image: (formData.get("image") as string) || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id)
  revalidatePath("/admin/homepage")
}

export async function deleteSection(id: string) {
  const supabase = await createClient()
  await supabase.from("homepage_sections").delete().eq("id", id)
  revalidatePath("/admin/homepage")
}

export async function toggleSection(id: string, isActive: boolean) {
  const supabase = await createClient()
  await supabase.from("homepage_sections").update({ is_active: !isActive }).eq("id", id)
  revalidatePath("/admin/homepage")
}
