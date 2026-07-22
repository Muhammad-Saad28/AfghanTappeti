"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

export async function createBlog(formData: FormData) {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)

  const { error } = await supabase.from("blogs").insert({
    title: raw.title as string,
    slug: slugify(raw.title as string),
    excerpt: raw.excerpt as string,
    content: raw.content as string,
    status: (raw.status as string) || "draft",
    published_at: raw.status === "published" ? new Date().toISOString() : null,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/admin/blog")
  redirect("/admin/blog")
}

export async function updateBlog(id: string, formData: FormData) {
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const wasPublished = raw._prev_status !== "published" && raw.status === "published"

  const { error } = await supabase
    .from("blogs")
    .update({
      title: raw.title as string,
      slug: slugify(raw.title as string),
      excerpt: raw.excerpt as string,
      content: raw.content as string,
      status: raw.status as string,
      published_at: wasPublished ? new Date().toISOString() : undefined,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/blog")
  redirect("/admin/blog")
}

export async function deleteBlog(id: string) {
  const supabase = await createClient()
  await supabase.from("blogs").delete().eq("id", id)
  revalidatePath("/admin/blog")
}
