import { createClient } from "@/lib/supabase/server"
import { updateCustomer, deleteCustomer } from "./actions"

export const dynamic = "force-dynamic"

export default async function AdminCustomersPage() {
  const supabase = await createClient()
  const { data: customers } = await supabase
    .from("customers")
    .select("*, orders(count)")
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Customers</h1>
        <div className="text-right">
          <p className="font-headline-md text-headline-md text-secondary">{customers?.length ?? 0}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Total customers</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Phone</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Orders</th>
              <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-on-surface-variant font-body-md">No customers yet.</td>
              </tr>
            )}
            {customers?.map((customer) => (
              <tr key={customer.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-4 font-body-md text-on-surface">
                  {customer.first_name} {customer.last_name}
                </td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant hidden md:table-cell">{customer.email}</td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant hidden md:table-cell">{customer.phone || "—"}</td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant hidden lg:table-cell">{Array.isArray(customer.orders) ? customer.orders.length : 0}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <form action={deleteCustomer.bind(null, customer.id)} onSubmit={(e) => { if (!confirm("Delete this customer?")) e.preventDefault() }}>
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
