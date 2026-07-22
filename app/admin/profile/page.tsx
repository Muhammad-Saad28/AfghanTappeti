import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { updateProfile } from "./actions"

export default async function AdminProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-8">Profile</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-surface p-6 rounded-xl border border-outline-variant space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant block">Email</span>
              <span className="font-body-md text-on-surface">{user.email}</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant block">Role</span>
              <span className="font-body-md text-on-surface capitalize">{profile?.role ?? "admin"}</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant block">Last Login</span>
              <span className="font-body-md text-on-surface">
                {profile?.last_login ? new Date(profile.last_login).toLocaleDateString() : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-outline-variant">
          <h2 className="font-headline-xs text-headline-xs text-on-surface mb-6">Edit Profile</h2>
          <form action={updateProfile.bind(null, user.id)} className="space-y-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Full Name</label>
              <input
                name="full_name"
                defaultValue={profile?.full_name ?? ""}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Avatar URL</label>
              <input
                name="avatar"
                defaultValue={profile?.avatar ?? ""}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <button type="submit" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-sm hover:bg-primary-fixed-dim transition-colors">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  )
}
