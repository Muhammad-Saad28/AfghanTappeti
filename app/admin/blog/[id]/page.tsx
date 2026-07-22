import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { updateBlog } from "../actions"
import { BlogForm } from "../blog-form"

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from("blogs").select("*").eq("id", id).single()
  if (!post) redirect("/admin/blog")

  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-8">Edit Post</h1>
      <BlogForm post={post} action={updateBlog.bind(null, id)} />
    </div>
  )
}
