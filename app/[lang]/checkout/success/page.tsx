import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getDictionary, type Locale } from "@/lib/i18n"
import { getWhatsAppLink, buildOrderMessage } from "@/lib/whatsapp"

interface OrderItem {
  id: string
  quantity: number
  price: number
  products?: { name: string } | null
}

interface OrderData {
  id: string
  order_number: string
  total: number
  customer_email: string
  order_items?: OrderItem[] | null
}

export default async function CheckoutSuccessPage(props: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ order?: string }>
}) {
  const { lang } = await props.params
  const { order } = await props.searchParams
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const supabase = await createClient()

  const [orderRes, settingsRes] = await Promise.all([
    supabase.from("orders").select("*, order_items(*, products(name))").eq("order_number", order).maybeSingle(),
    supabase.from("site_settings").select("whatsapp, phone").limit(1).maybeSingle(),
  ])

  const orderData = orderRes.data as OrderData | null
  const settings = settingsRes.data

  if (!orderData) notFound()

  const whatsappNumber = settings?.whatsapp || settings?.phone || ""
  const items = (orderData.order_items ?? []).map((oi: OrderItem) => ({
    name: oi.products?.name ?? "Product",
    quantity: oi.quantity,
    price: oi.price,
  }))
  const message = buildOrderMessage(orderData.order_number, items, orderData.total, orderData.customer_email)
  const waLink = getWhatsAppLink(whatsappNumber, message)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center text-2xl mb-6">✓</div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-3">{t.checkout_success.title}</h1>
      <p className="text-on-surface-variant font-body-md max-w-md mb-2">{t.checkout_success.subtitle}</p>
      {order && (
        <p className="font-label-md text-label-md text-on-surface mb-4">
          {t.checkout_success.order_number}: <span className="text-secondary">{order}</span>
        </p>
      )}

      <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 mb-6 w-full max-w-md text-left">
        <h3 className="font-label-md text-label-md text-on-surface mb-3">Order Summary</h3>
        {orderData.order_items?.map((oi: OrderItem) => (
          <div key={oi.id} className="flex justify-between text-label-sm text-on-surface-variant mb-2">
            <span>{oi.quantity}x {oi.products?.name ?? "Product"}</span>
            <span>€{(oi.price * oi.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-outline-variant mt-3 pt-3 flex justify-between font-label-md text-label-md text-on-surface">
          <span>Total</span>
          <span>€{orderData.total.toFixed(2)}</span>
        </div>
      </div>

      <p className="font-body-md text-on-surface-variant mb-8 max-w-md">{t.checkout_success.message}</p>

      {whatsappNumber && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-lg text-label-md no-underline hover:opacity-90 transition-opacity mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          {t.checkout_success.confirm_whatsapp}
        </a>
      )}

      <div className="flex gap-4">
        <Link href={`/${locale}/shop`} className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md no-underline hover:bg-primary-fixed-dim transition-colors">{t.checkout_success.continue}</Link>
        <Link href={`/${locale}`} className="border border-outline-variant text-on-surface px-6 py-3 rounded-lg text-label-md no-underline hover:bg-surface-variant transition-colors">{t.checkout_success.home}</Link>
      </div>
    </div>
  )
}
