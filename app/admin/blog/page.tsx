import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { deleteBlog } from "./actions"

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md no-underline hover:bg-primary-fixed-dim transition-colors"
        >
          New Post
        </Link>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Title</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Status</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-on-surface-variant font-body-md">No posts yet.</td>
              </tr>
            )}
            {posts?.map((post) => (
              <tr key={post.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-4">
                  <Link href={`/admin/blog/${post.id}`} className="font-body-md text-on-surface hover:text-secondary no-underline transition-colors">
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className={`inline-block px-2 py-0.5 rounded text-label-sm font-label-sm ${
                    post.status === "published" ? "bg-secondary-container text-on-secondary-container" :
                    post.status === "draft" ? "bg-surface-variant text-on-surface-variant" :
                    "bg-error-container text-on-error-container"
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant hidden lg:table-cell">
                  {post.created_at ? new Date(post.created_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/blog/${post.id}`} className="text-label-sm text-on-surface-variant hover:text-secondary no-underline transition-colors">Edit</Link>
                    <form action={deleteBlog.bind(null, post.id)}>
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
  )
}
