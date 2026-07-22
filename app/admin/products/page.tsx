import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { deleteProduct } from "./actions"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md no-underline hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">SKU</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Price</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Stock</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Status</th>
              <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant font-body-md">
                  No products yet.
                </td>
              </tr>
            )}
            {products?.map((product) => (
              <tr key={product.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-body-md text-on-surface hover:text-secondary no-underline transition-colors"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant hidden md:table-cell">
                  {product.sku}
                </td>
                <td className="px-4 py-4 font-body-md text-on-surface hidden md:table-cell">
                  €{product.price?.toFixed(2)}
                  {product.sale_price && (
                    <span className="text-on-surface-variant line-through ml-2">
                      €{product.sale_price.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant hidden lg:table-cell">
                  {product.stock_quantity}
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-label-sm font-label-sm ${
                      product.is_active
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-label-sm text-on-surface-variant hover:text-secondary no-underline transition-colors"
                    >
                      Edit
                    </Link>
                    <form action={deleteProduct.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="text-label-sm text-on-surface-variant hover:text-error transition-colors"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
