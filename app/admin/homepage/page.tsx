import { createClient } from "@/lib/supabase/server"
import { createSection, updateSection, deleteSection, toggleSection } from "./actions"

export const dynamic = "force-dynamic"

export default async function AdminHomepagePage() {
  const supabase = await createClient()
  const { data: sections } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("display_order")

  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-6">Homepage Sections</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-surface rounded-xl border border-outline-variant p-6">
          <h2 className="font-headline-xs text-headline-xs text-on-surface mb-6">Add Section</h2>
          <form action={createSection} className="space-y-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Section Name *</label>
              <input name="section_name" required className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Title</label>
              <input name="title" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Subtitle</label>
              <input name="subtitle" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Button Text</label>
                <input name="button_text" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Button Link</label>
                <input name="button_link" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Image URL</label>
              <input name="image" className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
            </div>
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Display Order</label>
                <input name="display_order" type="number" defaultValue={0} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
              </div>
              <label className="flex items-center gap-2 pb-2">
                <input name="is_active" type="checkbox" defaultChecked className="rounded border-outline-variant text-secondary focus:ring-secondary w-4 h-4" />
                <span className="font-label-sm text-label-sm text-on-surface-variant">Active</span>
              </label>
            </div>
            <button type="submit" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm hover:bg-primary-fixed-dim transition-colors">Create Section</button>
          </form>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Section</th>
                <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Title</th>
                <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Order</th>
                <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-on-surface-variant font-body-md">
                    No sections configured yet.
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
                    <div className="flex items-center justify-end gap-2">
                      <form action={toggleSection.bind(null, section.id, section.is_active)}>
                        <button type="submit" className="text-label-sm text-secondary hover:text-secondary-fixed-dim transition-colors">
                          {section.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                      <form action={deleteSection.bind(null, section.id)} onSubmit={(e) => { if (!confirm("Delete this section?")) e.preventDefault() }}>
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
