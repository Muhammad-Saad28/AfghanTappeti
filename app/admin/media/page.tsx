

export const dynamic = "force-dynamic"

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-6">Media Library</h1>
      <p className="font-body-md text-on-surface-variant mb-8">
        Upload and manage product images. Configure Supabase Storage buckets first.
      </p>
      <div className="bg-surface rounded-xl border border-outline-variant p-12 text-center">
        <p className="font-body-md text-on-surface-variant">
          Storage not yet configured. Set up a public bucket in Supabase Dashboard &rarr; Storage.
        </p>
      </div>
    </div>
  )
}
