export function CategoryForm({
  action,
  defaults,
}: {
  action: (formData: FormData) => Promise<void>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaults?: Record<string, any>
}) {
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Name *</label>
        <input name="name" required defaultValue={defaults?.name ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
      </div>
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Description</label>
        <textarea name="description" defaultValue={defaults?.description ?? ""} rows={2} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Display Order</label>
          <input name="display_order" type="number" defaultValue={defaults?.display_order ?? 0} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" defaultChecked={defaults?.is_active ?? true} className="accent-secondary" />
            <span className="font-body-md text-on-surface">Active</span>
          </label>
        </div>
      </div>
      <button type="submit" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md hover:bg-primary-fixed-dim transition-colors">
        {defaults ? "Update" : "Create"}
      </button>
    </form>
  )
}
