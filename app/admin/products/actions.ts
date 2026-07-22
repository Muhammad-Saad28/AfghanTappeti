"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const raw = Object.fromEntries(formData)

  const { error } = await supabase
    .from("products")
    .insert({
      name,
      slug: slugify(name),
      short_description: raw.short_description as string,
      description: raw.description as string,
      sku: raw.sku as string,
      price: parseFloat(raw.price as string),
      sale_price: raw.sale_price ? parseFloat(raw.sale_price as string) : null,
      stock_quantity: parseInt(raw.stock_quantity as string) || 0,
      weight: raw.weight ? parseFloat(raw.weight as string) : null,
      origin_id: raw.origin_id || null,
      material_id: raw.material_id || null,
      size_id: raw.size_id || null,
      shape_id: raw.shape_id || null,
      primary_color_id: raw.primary_color_id || null,
      secondary_color_id: raw.secondary_color_id || null,
      is_featured: raw.is_featured === "on",
      is_best_seller: raw.is_best_seller === "on",
      is_active: raw.is_active !== "off",
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const raw = Object.fromEntries(formData)
  const name = raw.name as string

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug: slugify(name),
      short_description: raw.short_description as string,
      description: raw.description as string,
      sku: raw.sku as string,
      price: parseFloat(raw.price as string),
      sale_price: raw.sale_price ? parseFloat(raw.sale_price as string) : null,
      stock_quantity: parseInt(raw.stock_quantity as string) || 0,
      weight: raw.weight ? parseFloat(raw.weight as string) : null,
      origin_id: raw.origin_id || null,
      material_id: raw.material_id || null,
      size_id: raw.size_id || null,
      shape_id: raw.shape_id || null,
      primary_color_id: raw.primary_color_id || null,
      secondary_color_id: raw.secondary_color_id || null,
      is_featured: raw.is_featured === "on",
      is_best_seller: raw.is_best_seller === "on",
      is_active: raw.is_active !== "off",
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/products")
}

export async function restoreProduct(id: string) {
  "use server"
  const supabase = await createClient()
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: null })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/products")
}
