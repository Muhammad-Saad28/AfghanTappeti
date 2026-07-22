import { createClient } from "@/lib/supabase/server"
import { getProductImageUrl } from "@/lib/supabase/storage"
import { deleteProductImage, reorderProductImage } from "./actions"

export async function ProductForm({
  product,
  images,
  action,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product?: Record<string, any>
  images?: { id: string; image_url: string; display_order: number; is_primary: boolean }[]
  action: (formData: FormData) => Promise<void>
}) {
  const supabase = await createClient()

  const [{ data: origins }, { data: materials }, { data: sizes }, { data: shapes }, { data: colors }] =
    await Promise.all([
      supabase.from("origins").select("id, name").order("name"),
      supabase.from("materials").select("id, name").order("name"),
      supabase.from("sizes").select("id, name").order("display_order"),
      supabase.from("shapes").select("id, name").order("name"),
      supabase.from("colors").select("id, name").order("name"),
    ])

  return (
    <div className="max-w-3xl">
      <form action={action} className="space-y-8">
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Name *
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={product?.name ?? ""}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              />
            </div>
            <div>
              <label htmlFor="sku" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                SKU *
              </label>
              <input
                id="sku"
                name="sku"
                required
                defaultValue={product?.sku ?? ""}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="short_description" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
              Short Description
            </label>
            <textarea
              id="short_description"
              name="short_description"
              rows={2}
              defaultValue={product?.short_description ?? ""}
              className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
              className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none"
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Pricing &amp; Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Price (€) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                defaultValue={product?.price ?? ""}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              />
            </div>
            <div>
              <label htmlFor="sale_price" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Sale Price (€)
              </label>
              <input
                id="sale_price"
                name="sale_price"
                type="number"
                step="0.01"
                defaultValue={product?.sale_price ?? ""}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              />
            </div>
            <div>
              <label htmlFor="stock_quantity" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Stock Quantity
              </label>
              <input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                defaultValue={product?.stock_quantity ?? "0"}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="weight" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
              Weight (kg)
            </label>
            <input
              id="weight"
              name="weight"
              type="number"
              step="0.01"
              defaultValue={product?.weight ?? ""}
              className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Classification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="origin_id" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Origin
              </label>
              <select
                id="origin_id"
                name="origin_id"
                defaultValue={product?.origin_id ?? ""}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              >
                <option value="">Select origin</option>
                {origins?.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="material_id" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Material
              </label>
              <select
                id="material_id"
                name="material_id"
                defaultValue={product?.material_id ?? ""}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              >
                <option value="">Select material</option>
                {materials?.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="size_id" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Size
              </label>
              <select
                id="size_id"
                name="size_id"
                defaultValue={product?.size_id ?? ""}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              >
                <option value="">Select size</option>
                {sizes?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="shape_id" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Shape
              </label>
              <select
                id="shape_id"
                name="shape_id"
                defaultValue={product?.shape_id ?? ""}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              >
                <option value="">Select shape</option>
                {shapes?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="primary_color_id" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Primary Color
              </label>
              <select
                id="primary_color_id"
                name="primary_color_id"
                defaultValue={product?.primary_color_id ?? ""}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              >
                <option value="">Select color</option>
                {colors?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="secondary_color_id" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Secondary Color
              </label>
              <select
                id="secondary_color_id"
                name="secondary_color_id"
                defaultValue={product?.secondary_color_id ?? ""}
                className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
              >
                <option value="">Select color</option>
                {colors?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Visibility
          </h2>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={product?.is_featured ?? false}
                className="rounded border-outline-variant text-secondary focus:ring-secondary w-4 h-4"
              />
              <span className="font-body-md text-on-surface">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_best_seller"
                defaultChecked={product?.is_best_seller ?? false}
                className="rounded border-outline-variant text-secondary focus:ring-secondary w-4 h-4"
              />
              <span className="font-body-md text-on-surface">Best Seller</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={product?.is_active ?? true}
                className="rounded border-outline-variant text-secondary focus:ring-secondary w-4 h-4"
              />
              <span className="font-body-md text-on-surface">Active</span>
            </label>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Images
          </h2>

          {images && images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={img.id} className="relative group aspect-[3/4] bg-surface-container-low rounded-lg overflow-hidden">
                  <img src={getProductImageUrl(img.image_url)} alt="" className="w-full h-full object-cover" />
                  {img.is_primary && (
                    <span className="absolute top-2 left-2 bg-secondary text-on-secondary text-label-xs font-label-xs px-1.5 py-0.5 rounded">Primary</span>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <form action={deleteProductImage.bind(null, img.id)}>
                      <button type="submit" className="bg-error text-on-error text-label-xs font-label-xs px-2 py-1 rounded hover:bg-error/80 transition-colors">Delete</button>
                    </form>
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx > 0 && (
                      <form action={reorderProductImage.bind(null, img.id, "up")}>
                        <button type="submit" className="bg-surface/80 text-on-surface text-label-xs font-label-xs px-2 py-1 rounded hover:bg-surface transition-colors">↑</button>
                      </form>
                    )}
                    {idx < images.length - 1 && (
                      <form action={reorderProductImage.bind(null, img.id, "down")}>
                        <button type="submit" className="bg-surface/80 text-on-surface text-label-xs font-label-xs px-2 py-1 rounded hover:bg-surface transition-colors">↓</button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <label htmlFor="images" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
              {images && images.length > 0 ? "Add More Images" : "Upload Images"}
            </label>
            <input
              id="images"
              name="images"
              type="file"
              accept="image/webp,image/jpeg,image/png"
              multiple
              className="w-full text-label-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-label-sm file:font-label-sm file:bg-primary file:text-on-primary hover:file:bg-primary-fixed-dim transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors"
          >
            {product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
