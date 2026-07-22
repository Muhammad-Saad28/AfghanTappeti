import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-8">
        Profile
      </h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-surface p-6 rounded-xl border border-outline-variant space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                Email
              </span>
              <span className="font-body-md text-on-surface">{user.email}</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                Role
              </span>
              <span className="font-body-md text-on-surface capitalize">
                {profile?.role ?? "admin"}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                Name
              </span>
              <span className="font-body-md text-on-surface">
                {profile?.full_name ?? "—"}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant block">
                Last Login
              </span>
              <span className="font-body-md text-on-surface">
                {profile?.last_login
                  ? new Date(profile.last_login).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
