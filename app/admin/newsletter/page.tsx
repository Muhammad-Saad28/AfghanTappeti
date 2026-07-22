import { createClient } from "@/lib/supabase/server"
import { toggleSubscriber, deleteSubscriber } from "./actions"

export const dynamic = "force-dynamic"

export default async function AdminNewsletterPage() {
  const supabase = await createClient()
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })

  const activeCount = subscribers?.filter((s) => s.is_active).length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Newsletter</h1>
        <div className="text-right">
          <p className="font-headline-md text-headline-md text-secondary">{activeCount}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Active subscribers</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Status</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Subscribed</th>
              <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-on-surface-variant font-body-md">No subscribers yet.</td>
              </tr>
            )}
            {subscribers?.map((sub) => (
              <tr key={sub.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-4 font-body-md text-on-surface">{sub.email}</td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className={`inline-block px-2 py-0.5 rounded text-label-sm font-label-sm ${
                    sub.is_active ? "bg-secondary-container text-on-secondary-container" : "bg-surface-variant text-on-surface-variant"
                  }`}>
                    {sub.is_active ? "Active" : "Unsubscribed"}
                  </span>
                </td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant hidden lg:table-cell">
                  {new Date(sub.subscribed_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <form action={toggleSubscriber.bind(null, sub.id, sub.is_active)}>
                      <button type="submit" className="text-label-sm text-secondary hover:text-secondary-fixed-dim transition-colors">
                        {sub.is_active ? "Unsubscribe" : "Re-subscribe"}
                      </button>
                    </form>
                    <form action={deleteSubscriber.bind(null, sub.id)} onSubmit={(e) => { if (!confirm("Delete this subscriber?")) e.preventDefault() }}>
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
