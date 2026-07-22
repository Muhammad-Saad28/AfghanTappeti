import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

async function saveSettings(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const raw = Object.fromEntries(formData)

  const { data: existing } = await supabase.from("site_settings").select("id").limit(1)

  const payload = {
    site_name: raw.site_name as string,
    tagline: raw.tagline as string,
    logo: raw.logo as string,
    favicon: raw.favicon as string,
    contact_email: raw.contact_email as string,
    phone: raw.phone as string,
    whatsapp: raw.whatsapp as string,
    address: raw.address as string,
    facebook: raw.facebook as string,
    instagram: raw.instagram as string,
    youtube: raw.youtube as string,
    linkedin: raw.linkedin as string,
    default_language: raw.default_language as string,
    currency: raw.currency as string,
    timezone: raw.timezone as string,
  }

  if (existing && existing.length > 0) {
    await supabase.from("site_settings").update(payload).eq("id", existing[0].id)
  } else {
    await supabase.from("site_settings").insert(payload)
  }
  revalidatePath("/admin/settings")
}

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from("site_settings").select("*").limit(1).single()

  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-6">Settings</h1>

      <div className="max-w-2xl">
        <form action={saveSettings} className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
          <fieldset>
            <legend className="font-headline-xs text-headline-xs text-on-surface mb-4">Brand</legend>
            <div className="space-y-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Site Name</label>
                <input name="site_name" defaultValue={settings?.site_name ?? "Afghan Tappeti"} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Tagline</label>
                <input name="tagline" defaultValue={settings?.tagline ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Logo URL</label>
                <input name="logo" defaultValue={settings?.logo ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Favicon URL</label>
                <input name="favicon" defaultValue={settings?.favicon ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-headline-xs text-headline-xs text-on-surface mb-4">Contact</legend>
            <div className="space-y-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Email</label>
                <input name="contact_email" type="email" defaultValue={settings?.contact_email ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Phone</label>
                <input name="phone" defaultValue={settings?.phone ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">WhatsApp Number (for order confirmations)</label>
                <input name="whatsapp" defaultValue={settings?.whatsapp ?? ""} placeholder="+393XXXXXXXXX" className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Address</label>
                <textarea name="address" defaultValue={settings?.address ?? ""} rows={2} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-headline-xs text-headline-xs text-on-surface mb-4">Social</legend>
            <div className="space-y-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Facebook</label>
                <input name="facebook" defaultValue={settings?.facebook ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Instagram</label>
                <input name="instagram" defaultValue={settings?.instagram ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">YouTube</label>
                <input name="youtube" defaultValue={settings?.youtube ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">LinkedIn</label>
                <input name="linkedin" defaultValue={settings?.linkedin ?? ""} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-headline-xs text-headline-xs text-on-surface mb-4">Localization</legend>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Language</label>
                <select name="default_language" defaultValue={settings?.default_language ?? "en"} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md">
                  <option value="en">English</option>
                  <option value="it">Italian</option>
                </select>
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Currency</label>
                <select name="currency" defaultValue={settings?.currency ?? "EUR"} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md">
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Timezone</label>
                <select name="timezone" defaultValue={settings?.timezone ?? "Europe/Rome"} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md">
                  <option value="Europe/Rome">Europe/Rome</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
            </div>
          </fieldset>

          <button type="submit" className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md hover:bg-primary-fixed-dim transition-colors">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  )
}
