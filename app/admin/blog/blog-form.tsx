export function BlogForm({
  post,
  action,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post?: Record<string, any>
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <div className="max-w-3xl">
      <form action={action} className="space-y-8">
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
          <div>
            <label htmlFor="title" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Title *</label>
            <input
              id="title" name="title" required
              defaultValue={post?.title ?? ""}
              className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Excerpt</label>
            <textarea
              id="excerpt" name="excerpt" rows={2}
              defaultValue={post?.excerpt ?? ""}
              className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none"
            />
          </div>

          <div>
            <label htmlFor="content" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Content</label>
            <textarea
              id="content" name="content" rows={12}
              defaultValue={post?.content ?? ""}
              className="w-full bg-transparent border border-outline-variant rounded-lg p-4 focus:outline-none focus:border-secondary transition-colors font-body-md resize-y"
            />
          </div>

          <div>
            <label htmlFor="status" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Status</label>
            <select
              id="status" name="status"
              defaultValue={post?.status ?? "draft"}
              className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            {post && <input type="hidden" name="_prev_status" value={post.status} />}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md hover:bg-primary-fixed-dim transition-colors"
        >
          {post ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  )
}
