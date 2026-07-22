import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

async function toggleSection(id: string, isActive: boolean) {
  "use server"
  const supabase = await createClient()
  await supabase.from("homepage_sections").update({ is_active: !isActive }).eq("id", id)
  revalidatePath("/admin/homepage")
}

export default async function AdminHomepagePage() {
  const supabase = await createClient()
  const { data: sections } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("display_order")

  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-6">Homepage Sections</h1>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Section</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Title</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Order</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {sections?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-on-surface-variant font-body-md">
                  No sections configured yet. Add them via the database.
                </td>
              </tr>
            )}
            {sections?.map((section) => (
              <tr key={section.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-4 font-body-md text-on-surface">{section.section_name}</td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant hidden md:table-cell">{section.title || "—"}</td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant hidden md:table-cell">{section.display_order}</td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-label-sm font-label-sm ${
                    section.is_active ? "bg-secondary-container text-on-secondary-container" : "bg-surface-variant text-on-surface-variant"
                  }`}>
                    {section.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <form action={toggleSection.bind(null, section.id, section.is_active)}>
                    <button type="submit" className="text-label-sm text-secondary hover:text-secondary-fixed-dim transition-colors">
                      {section.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
