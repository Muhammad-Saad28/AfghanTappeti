import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { updateProduct } from "../actions"
import { ProductForm } from "../product-form"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [product, images] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase
      .from("product_images")
      .select("id, image_url, display_order, is_primary")
      .eq("product_id", id)
      .order("display_order"),
  ])

  if (!product.data) redirect("/admin/products")

  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-8">
        Edit Product
      </h1>
      <ProductForm product={product.data} images={images.data ?? []} action={updateProduct.bind(null, id)} />
    </div>
  )
}
