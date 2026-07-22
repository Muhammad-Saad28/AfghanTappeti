import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: ordersCount },
    { count: customersCount },
    { count: reviewsCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    { label: "Products", value: productsCount ?? 0 },
    { label: "Orders", value: ordersCount ?? 0 },
    { label: "Customers", value: customersCount ?? 0 },
    { label: "Reviews", value: reviewsCount ?? 0 },
  ]

  return (
    <div>
      <h1 className="font-headline-sm text-on-surface mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface p-6 rounded-xl border border-outline-variant"
          >
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="font-headline-md text-on-surface mt-1">
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
