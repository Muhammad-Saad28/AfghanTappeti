import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from("orders")
    .select("*, customers(first_name, last_name, email)")
    .order("created_at", { ascending: false })

  const counts = {
    total: orders?.length ?? 0,
    pending: orders?.filter((o) => o.status === "pending").length ?? 0,
    paid: orders?.filter((o) => o.payment_status === "paid").length ?? 0,
    shipped: orders?.filter((o) => o.status === "shipped").length ?? 0,
  }

  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-6">Orders</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
          {[
          { label: "Total", value: counts.total, className: "text-on-surface" },
          { label: "Pending", value: counts.pending, className: "text-warning" },
          { label: "Paid", value: counts.paid, className: "text-secondary" },
          { label: "Shipped", value: counts.shipped, className: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-outline-variant p-4">
            <p className={`font-headline-md text-headline-md ${stat.className}`}>{stat.value}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Order</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Payment</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant font-body-md">No orders yet.</td>
              </tr>
            )}
            {orders?.map((order) => (
              <tr key={order.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-4">
                  <Link href={`/admin/orders/${order.id}`} className="font-label-md text-label-md text-secondary hover:text-secondary-fixed-dim no-underline transition-colors">
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <p className="font-body-md text-on-surface">{(order.customers?.first_name ?? "") + " " + (order.customers?.last_name ?? order.customer_email ?? "")}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{order.customer_email}</p>
                </td>
                <td className="px-4 py-4 font-body-md text-on-surface">€{order.total.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-label-sm font-label-sm ${
                    order.status === "delivered" ? "bg-secondary-container text-on-secondary-container" :
                    order.status === "cancelled" || order.status === "refunded" ? "bg-error-container text-on-error-container" :
                    order.status === "shipped" ? "bg-primary-container text-on-primary-container" :
                    "bg-surface-variant text-on-surface-variant"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-label-sm font-label-sm ${
                    order.payment_status === "paid" ? "bg-secondary-container text-on-secondary-container" :
                    order.payment_status === "failed" ? "bg-error-container text-on-error-container" :
                    "bg-surface-variant text-on-surface-variant"
                  }`}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
