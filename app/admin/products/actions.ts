"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

const BUCKET = "product-images"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

async function uploadImage(file: File, sku: string, index: number): Promise<string> {
  const ext = file.name.split(".").pop() || "webp"
  const filename = `${sku}-${String(index + 1).padStart(2, "0")}.${ext}`
  const supabase = await createClient()
  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, { upsert: true })
  if (error) throw new Error(`Image upload failed: ${error.message}`)
  return filename
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const raw = Object.fromEntries(formData)
  const files = formData.getAll("images") as File[]

  const { data: product, error } = await supabase
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
      seo_id: raw.seo_id || null,
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  const categories = formData.getAll("categories") as string[]
  if (categories.length > 0) {
    const { error: catError } = await supabase.from("product_categories").insert(
      categories.map((category_id) => ({ product_id: product.id, category_id }))
    )
    if (catError) throw new Error(`Category assign failed: ${catError.message}`)
  }

  const collections = formData.getAll("collections") as string[]
  if (collections.length > 0) {
    const { error: colError } = await supabase.from("product_collections").insert(
      collections.map((collection_id) => ({ product_id: product.id, collection_id }))
    )
    if (colError) throw new Error(`Collection assign failed: ${colError.message}`)
  }

  const sku = raw.sku as string
  const imageRows = []
  for (let i = 0; i < files.length; i++) {
    if (files[i].size === 0) continue
    const filename = await uploadImage(files[i], sku, i)
    imageRows.push({
      product_id: product.id,
      image_url: filename,
      display_order: i,
      is_primary: i === 0,
    })
  }

  if (imageRows.length > 0) {
    const { error: imgError } = await supabase.from("product_images").insert(imageRows)
    if (imgError) throw new Error(`Image record insert failed: ${imgError.message}`)
  }

  revalidatePath("/admin/products")
  redirect("/admin/products")
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const raw = Object.fromEntries(formData)
  const name = raw.name as string
  const files = formData.getAll("images") as File[]

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
      seo_id: raw.seo_id || null,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)

  const categories = formData.getAll("categories") as string[]
  await supabase.from("product_categories").delete().eq("product_id", id)
  if (categories.length > 0) {
    const { error: catError } = await supabase.from("product_categories").insert(
      categories.map((category_id) => ({ product_id: id, category_id }))
    )
    if (catError) throw new Error(`Category assign failed: ${catError.message}`)
  }

  const collections = formData.getAll("collections") as string[]
  await supabase.from("product_collections").delete().eq("product_id", id)
  if (collections.length > 0) {
    const { error: colError } = await supabase.from("product_collections").insert(
      collections.map((collection_id) => ({ product_id: id, collection_id }))
    )
    if (colError) throw new Error(`Collection assign failed: ${colError.message}`)
  }

  const deleteIds = formData.get("delete_images") as string
  if (deleteIds) {
    const ids = deleteIds.split(",").filter(Boolean)
    if (ids.length > 0) {
      const { data: imagesToDelete } = await supabase
        .from("product_images")
        .select("image_url")
        .in("id", ids)
      const { error: delDbError } = await supabase
        .from("product_images")
        .delete()
        .in("id", ids)
      if (delDbError) throw new Error(`Failed to delete image records: ${delDbError.message}`)
      if (imagesToDelete) {
        const storageFiles = imagesToDelete.map((img) => img.image_url).filter(Boolean)
        if (storageFiles.length > 0) {
          await supabase.storage.from(BUCKET).remove(storageFiles)
        }
      }
    }
  }

  const sku = raw.sku as string
  if (files.length > 0) {
    const { data: existing } = await supabase
      .from("product_images")
      .select("display_order")
      .eq("product_id", id)
      .order("display_order", { ascending: false })
      .limit(1)

    const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0
    const imageRows = []
    for (let i = 0; i < files.length; i++) {
      if (files[i].size === 0) continue
      const filename = await uploadImage(files[i], sku, nextOrder + i)
      imageRows.push({
        product_id: id,
        image_url: filename,
        display_order: nextOrder + i,
        is_primary: nextOrder + i === 0,
      })
    }
    if (imageRows.length > 0) {
      const { error: imgError } = await supabase.from("product_images").insert(imageRows)
      if (imgError) throw new Error(`Image record insert failed: ${imgError.message}`)
    }
  }

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

export async function reorderProductImage(imageId: string, direction: "up" | "down") {
  const supabase = await createClient()

  const { data: current } = await supabase
    .from("product_images")
    .select("id, product_id, display_order, is_primary")
    .eq("id", imageId)
    .single()

  if (!current) return

  const { data: neighbor } = await supabase
    .from("product_images")
    .select("id, display_order, is_primary")
    .eq("product_id", current.product_id)
    .eq("display_order", direction === "up" ? current.display_order - 1 : current.display_order + 1)
    .single()

  if (!neighbor) return

  await supabase.from("product_images").update({ display_order: neighbor.display_order }).eq("id", current.id)
  await supabase.from("product_images").update({ display_order: current.display_order }).eq("id", neighbor.id)

  const { data: lowest } = await supabase
    .from("product_images")
    .select("id")
    .eq("product_id", current.product_id)
    .order("display_order", { ascending: true })
    .limit(1)
    .single()

  await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", current.product_id)

  if (lowest) {
    await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", lowest.id)
  }

  revalidatePath("/admin/products")
}

export async function deleteProductImage(imageId: string) {
  const supabase = await createClient()
  const { data: img } = await supabase
    .from("product_images")
    .select("image_url, product_id")
    .eq("id", imageId)
    .single()

  if (img) {
    await supabase.storage.from(BUCKET).remove([img.image_url])
    await supabase.from("product_images").delete().eq("id", imageId)
  }

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

export async function duplicateProduct(id: string) {
  const supabase = await createClient()

  const { data: original } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single()

  if (!original) throw new Error("Product not found")

  const newName = `${original.name} (Copy)`
  const newSku = `${original.sku}-CPY`

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: newName,
      slug: slugify(newName),
      short_description: original.short_description,
      description: original.description,
      sku: newSku,
      price: original.price,
      sale_price: original.sale_price,
      stock_quantity: original.stock_quantity,
      weight: original.weight,
      origin_id: original.origin_id,
      material_id: original.material_id,
      size_id: original.size_id,
      shape_id: original.shape_id,
      primary_color_id: original.primary_color_id,
      secondary_color_id: original.secondary_color_id,
      is_featured: false,
      is_best_seller: false,
      is_active: false,
      seo_id: null,
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  if (original.product_images?.length > 0) {
    const imageRows = original.product_images.map(
      (img: { image_url: string; display_order: number; is_primary: boolean }) => ({
        product_id: product.id,
        image_url: img.image_url,
        display_order: img.display_order,
        is_primary: img.is_primary,
      })
    )
    const { error: imgError } = await supabase.from("product_images").insert(imageRows)
    if (imgError) throw new Error(`Image copy failed: ${imgError.message}`)
  }

  const { data: pc } = await supabase.from("product_categories").select("category_id").eq("product_id", id)
  if (pc && pc.length > 0) {
    await supabase.from("product_categories").insert(
      pc.map((r: { category_id: string }) => ({ product_id: product.id, category_id: r.category_id }))
    )
  }

  const { data: pcol } = await supabase.from("product_collections").select("collection_id").eq("product_id", id)
  if (pcol && pcol.length > 0) {
    await supabase.from("product_collections").insert(
      pcol.map((r: { collection_id: string }) => ({ product_id: product.id, collection_id: r.collection_id }))
    )
  }

  revalidatePath("/admin/products")
}
