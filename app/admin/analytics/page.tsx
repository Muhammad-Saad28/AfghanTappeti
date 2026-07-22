import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const { count: totalProducts } = await supabase
    .from("products").select("*", { count: "exact", head: true })

  const { count: totalOrders } = await supabase
    .from("orders").select("*", { count: "exact", head: true })

  const { count: totalCustomers } = await supabase
    .from("customers").select("*", { count: "exact", head: true })

  const { data: revenueData } = await supabase
    .from("orders")
    .select("total")
    .eq("payment_status", "paid")

  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("order_number, total, status, created_at, customer_email")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: topProducts } = await supabase
    .from("products")
    .select("name, price")
    .eq("is_featured", true)
    .limit(5)

  return (
    <div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-6">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `€${totalRevenue.toLocaleString()}`, className: "text-secondary" },
          { label: "Total Orders", value: totalOrders ?? 0, className: "text-primary" },
          { label: "Products", value: totalProducts ?? 0, className: "text-on-surface" },
          { label: "Customers", value: totalCustomers ?? 0, className: "text-on-surface" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-outline-variant p-5">
            <p className={`font-headline-lg text-headline-lg ${stat.className}`}>{stat.value}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-xl border border-outline-variant p-6">
          <h2 className="font-headline-xs text-headline-xs text-on-surface mb-4">Recent Orders</h2>
          {recentOrders?.length === 0 ? (
            <p className="text-on-surface-variant font-body-md">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders?.map((order) => (
                <div key={order.order_number} className="flex justify-between items-center pb-3 border-b border-outline-variant/50 last:border-0">
                  <div>
                    <p className="font-body-md text-on-surface">{order.order_number}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {order.customer_email || "Guest"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body-md text-on-surface">€{Number(order.total).toLocaleString()}</p>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-6">
          <h2 className="font-headline-xs text-headline-xs text-on-surface mb-4">Featured Products</h2>
          {topProducts?.length === 0 ? (
            <p className="text-on-surface-variant font-body-md">No featured products.</p>
          ) : (
            <div className="space-y-3">
              {topProducts?.map((product) => (
                <div key={product.name} className="flex justify-between items-center pb-3 border-b border-outline-variant/50 last:border-0">
                  <p className="font-body-md text-on-surface">{product.name}</p>
                  <p className="font-body-md text-on-surface">€{Number(product.price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
