import { createClient } from "@/lib/supabase/server"
import { createCategory, deleteCategory } from "./actions"
import { CategoryForm } from "./category-form"

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-surface rounded-xl border border-outline-variant p-6">
            <h2 className="font-headline-xs text-headline-xs text-on-surface mb-6">Add Category</h2>
            <CategoryForm action={createCategory} />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Order</th>
                <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active</th>
                <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-on-surface-variant font-body-md">No categories yet.</td></tr>
              )}
              {categories?.map((cat) => (
                <tr key={cat.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-4 font-body-md text-on-surface">{cat.name}</td>
                  <td className="px-4 py-4 font-body-md text-on-surface-variant hidden md:table-cell">{cat.display_order}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block w-2 h-2 rounded-full ${cat.is_active ? "bg-secondary" : "bg-surface-variant"}`} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <form action={deleteCategory.bind(null, cat.id)}>
                      <button type="submit" className="text-label-sm text-on-surface-variant hover:text-error transition-colors">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
