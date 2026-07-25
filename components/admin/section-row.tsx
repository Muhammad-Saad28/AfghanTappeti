"use client"

import { useActionState, useState } from "react"

export function SectionRow({
  section,
  updateAction,
  toggleAction,
  deleteAction,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  section: Record<string, any>
  updateAction: (id: string, formData: FormData) => Promise<void>
  toggleAction: (id: string, isActive: boolean) => Promise<void>
  deleteAction: (id: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await updateAction(section.id, formData)
      setEditing(false)
    },
    null
  )

  if (editing) {
    return (
      <tr className="border-b border-outline-variant/50 bg-surface-container-low">
        <td colSpan={5} className="px-4 py-4">
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Section Name</label>
                <input name="section_name" defaultValue={section.section_name} required className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Title</label>
                <input name="title" defaultValue={section.title ?? ""} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Subtitle</label>
                <input name="subtitle" defaultValue={section.subtitle ?? ""} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Button Text</label>
                <input name="button_text" defaultValue={section.button_text ?? ""} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Button Link</label>
                <input name="button_link" defaultValue={section.button_link ?? ""} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Image URL</label>
                <input name="image" defaultValue={section.image ?? ""} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Display Order</label>
                <input name="display_order" type="number" defaultValue={section.display_order} className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md" />
              </div>
              <div className="flex items-end gap-4 pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="is_active" type="checkbox" defaultChecked={section.is_active} className="rounded border-outline-variant text-secondary focus:ring-secondary w-4 h-4" />
                  <span className="font-label-sm text-label-sm">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={pending} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm hover:bg-primary-fixed-dim transition-colors disabled:opacity-50">
                {pending ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="border border-outline-variant px-4 py-2 rounded-lg text-label-sm hover:bg-surface-container-low transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
      <td className="px-4 py-4 font-body-md text-on-surface">{section.section_name}</td>
      <td className="px-4 py-4 font-body-md text-on-surface-variant hidden md:table-cell">{section.title || "—"}</td>
      <td className="px-4 py-4 font-body-md text-on-surface-variant hidden md:table-cell">{section.display_order}</td>
      <td className="px-4 py-4">
        <span className={`inline-block px-2 py-0.5 rounded text-label-sm font-label-sm ${section.is_active ? "bg-secondary-container text-on-secondary-container" : "bg-surface-variant text-on-surface-variant"}`}>
          {section.is_active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => setEditing(true)} className="text-label-sm text-on-surface-variant hover:text-secondary transition-colors">
            Edit
          </button>
          <form action={toggleAction.bind(null, section.id, section.is_active)}>
            <button type="submit" className="text-label-sm text-secondary hover:text-secondary-fixed-dim transition-colors">
              {section.is_active ? "Deactivate" : "Activate"}
            </button>
          </form>
          <form action={deleteAction.bind(null, section.id)} onSubmit={(e) => { if (!confirm("Delete this section?")) e.preventDefault() }}>
            <button type="submit" className="text-label-sm text-on-surface-variant hover:text-error transition-colors">Delete</button>
          </form>
        </div>
      </td>
    </tr>
  )
}
