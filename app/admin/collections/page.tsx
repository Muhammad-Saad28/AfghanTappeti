import { createClient } from "@/lib/supabase/server"
import { createCollection, deleteCollection } from "./actions"
import { CollectionForm } from "./collection-form"

export const dynamic = "force-dynamic"

export default async function AdminCollectionsPage() {
  const supabase = await createClient()
  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Collections</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-surface rounded-xl border border-outline-variant p-6">
            <h2 className="font-headline-xs text-headline-xs text-on-surface mb-6">Add Collection</h2>
            <CollectionForm action={createCollection} />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections?.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-12 text-center text-on-surface-variant font-body-md">No collections yet.</td></tr>
              )}
              {collections?.map((col) => (
                <tr key={col.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-body-md text-on-surface">{col.name}</p>
                    {col.description && <p className="font-label-sm text-label-sm text-on-surface-variant truncate max-w-[200px]">{col.description}</p>}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded text-label-sm font-label-sm ${col.is_active ? "bg-secondary-container text-on-secondary-container" : "bg-surface-variant text-on-surface-variant"}`}>
                      {col.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <form action={deleteCollection.bind(null, col.id)}>
                        <button type="submit" className="text-label-sm text-on-surface-variant hover:text-error transition-colors">Delete</button>
                      </form>
                    </div>
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
