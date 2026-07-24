import { createClient } from "@/lib/supabase/server"
import { getProductImageUrl } from "@/lib/supabase/storage"
import Image from "next/image"

export const dynamic = "force-dynamic"

async function uploadFile(formData: FormData) {
  "use server"
  const file = formData.get("file") as File
  if (!file || file.size === 0) return
  const supabase = await createClient()
  const { error } = await supabase.storage.from("product-images").upload(file.name, file, { upsert: true })
  if (error) throw new Error(error.message)
}

async function deleteFile(filename: string) {
  "use server"
  const supabase = await createClient()
  const { error } = await supabase.storage.from("product-images").remove([filename])
  if (error) throw new Error(error.message)
}

export default async function AdminMediaPage() {
  const supabase = await createClient()
  const { data: files } = await supabase.storage.from("product-images").list()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Media Library</h1>
        <form action={uploadFile} className="flex items-center gap-3">
          <input
            type="file"
            name="file"
            accept="image/webp,image/jpeg,image/png"
            required
            className="text-label-sm text-on-surface-variant file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-label-sm file:font-label-sm file:bg-primary file:text-on-primary hover:file:bg-primary-fixed-dim transition-colors"
          />
          <button type="submit" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm hover:bg-primary-fixed-dim transition-colors">Upload</button>
        </form>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant">
        {(!files || files.length === 0) && (
          <div className="p-12 text-center">
            <p className="font-body-md text-on-surface-variant">No files uploaded yet.</p>
          </div>
        )}

        {files && files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
            {files.map((file) => (
              <div key={file.name} className="relative group aspect-square bg-surface-container-low rounded-lg overflow-hidden">
                <Image src={getProductImageUrl(file.name)} alt={file.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-label-xs font-label-xs truncate">{file.name}</p>
                </div>
                <form action={deleteFile.bind(null, file.name)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="submit" className="bg-error text-on-error text-label-xs font-label-xs px-2 py-1 rounded hover:bg-error/80 transition-colors">Delete</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
