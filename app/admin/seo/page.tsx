import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

async function saveSeo(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)
  const id = raw.id as string

  const payload = {
    meta_title: raw.meta_title as string,
    meta_description: raw.meta_description as string,
    og_title: raw.og_title as string,
    og_description: raw.og_description as string,
    og_image: raw.og_image as string,
    canonical_url: raw.canonical_url as string,
    robots: raw.robots as string,
    schema_json: raw.schema_json as string,
  }

  if (id) {
    await supabase.from("seo_metadata").update(payload).eq("id", id)
  } else {
    await supabase.from("seo_metadata").insert(payload)
  }
  revalidatePath("/admin/seo")
}

export default async function AdminSeoPage() {
  const supabase = await createClient()
  const { data: seoEntries } = await supabase
    .from("seo_metadata")
    .select("*, blogs!left(title)")
    .order("meta_title")

  const { data: defaultEntry } = await supabase
    .from("seo_metadata")
    .select("*")
    .is("canonical_url", null)
    .limit(1)
    .single()

  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-6">SEO</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-xl border border-outline-variant p-6">
          <h2 className="font-headline-xs text-headline-xs text-on-surface mb-6">
            {defaultEntry ? "Edit Default SEO" : "Default SEO"}
          </h2>
          <form action={saveSeo} className="space-y-4">
            {defaultEntry && <input type="hidden" name="id" value={defaultEntry.id} />}
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Meta Title</label>
              <input name="meta_title" defaultValue={defaultEntry?.meta_title ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Meta Description</label>
              <textarea name="meta_description" defaultValue={defaultEntry?.meta_description ?? ""} rows={2} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">OG Title</label>
              <input name="og_title" defaultValue={defaultEntry?.og_title ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">OG Description</label>
              <textarea name="og_description" defaultValue={defaultEntry?.og_description ?? ""} rows={2} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">OG Image URL</label>
              <input name="og_image" defaultValue={defaultEntry?.og_image ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Canonical URL</label>
              <input name="canonical_url" defaultValue={defaultEntry?.canonical_url ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Robots</label>
              <select name="robots" defaultValue={defaultEntry?.robots ?? "index, follow"} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md">
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Schema JSON (optional)</label>
              <textarea name="schema_json" defaultValue={defaultEntry?.schema_json ?? ""} rows={3} className="w-full bg-transparent border border-outline-variant rounded-lg p-3 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none" />
            </div>
            <button type="submit" className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md hover:bg-primary-fixed-dim transition-colors">
              Save SEO
            </button>
          </form>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-6">
          <h2 className="font-headline-xs text-headline-xs text-on-surface mb-6">SEO Entries</h2>
          {seoEntries?.length === 0 ? (
            <p className="text-on-surface-variant font-body-md">No SEO entries. Create a default one.</p>
          ) : (
            <div className="space-y-4">
              {seoEntries?.map((entry) => (
                <div key={entry.id} className="pb-4 border-b border-outline-variant/50 last:border-0">
                  <p className="font-body-md text-on-surface">{entry.meta_title || "Untitled"}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{entry.meta_description}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{entry.canonical_url || "Default"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
