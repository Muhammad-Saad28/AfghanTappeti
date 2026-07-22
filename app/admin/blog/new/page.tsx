import { BlogForm } from "../blog-form"
import { createBlog } from "../actions"

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-8">New Blog Post</h1>
      <BlogForm action={createBlog} />
    </div>
  )
}
