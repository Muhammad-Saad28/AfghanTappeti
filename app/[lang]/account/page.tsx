import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { logoutCustomer } from "@/lib/customer-actions"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)
  return {
    title: t.common?.my_account ?? "My Account",
    alternates: {
      canonical: `${siteUrl}/${lang}/account`,
      languages: { en: `${siteUrl}/en/account`, it: `${siteUrl}/it/account`, "x-default": `${siteUrl}/en/account` },
    },
  }
}

export default async function AccountPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as Locale
  const supabase = await createClient()
  const t = await getDictionary(locale)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .single()

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, total_amount, status, created_at")
    .eq("customer_id", customer?.id ?? "")
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-section-gap">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-md text-headline-md">{t.common?.my_account ?? "My Account"}</h1>
        <form action={logoutCustomer}>
          <button type="submit" className="text-label-sm text-secondary hover:underline">{t.common?.sign_out ?? "Sign Out"}</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface rounded-xl border border-outline-variant p-6">
          <h2 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-4">{t.common?.profile ?? "Profile"}</h2>
          <div className="space-y-3 font-body-md">
            <p><span className="text-on-surface-variant">{t.common?.name ?? "Name"}:</span> {customer?.first_name} {customer?.last_name}</p>
            <p><span className="text-on-surface-variant">Email:</span> {customer?.email ?? user.email}</p>
            {customer?.phone && <p><span className="text-on-surface-variant">{t.common?.phone ?? "Phone"}:</span> {customer.phone}</p>}
          </div>
        </div>

        <div className="md:col-span-2 bg-surface rounded-xl border border-outline-variant p-6">
          <h2 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-4">{t.common?.order_history ?? "Order History"}</h2>
          {(!orders || orders.length === 0) && (
            <p className="font-body-md text-on-surface-variant">{t.common?.no_orders ?? "No orders yet."}</p>
          )}
          {orders && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-outline-variant/50 pb-4">
                  <div>
                    <p className="font-body-md font-semibold">{order.order_number}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {new Date(order.created_at).toLocaleDateString()} — €{Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-label-sm font-label-sm ${
                    order.status === "delivered" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-variant text-on-surface-variant"
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
