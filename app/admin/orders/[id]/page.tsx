import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  subtotal: number
  products?: { name: string } | null
}

export const dynamic = "force-dynamic"

const statusOptions = ["pending", "confirmed", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]
const paymentOptions = ["pending", "paid", "failed", "refunded"]

async function updateOrder(id: string, formData: FormData) {
  "use server"
  const supabase = await createClient()
  const status = formData.get("status") as string
  const paymentStatus = formData.get("payment_status") as string
  const tracking = formData.get("tracking_number") as string
  const notes = formData.get("notes") as string

  await supabase.from("orders").update({
    status: status || undefined,
    payment_status: paymentStatus || undefined,
    tracking_number: tracking || null,
    notes: notes || null,
  }).eq("id", id)

  revalidatePath(`/admin/orders/${id}`)
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: order } = await supabase
    .from("orders")
    .select("*, customers(*), order_items(*, products(name, slug))")
    .eq("id", id)
    .single()

  if (!order) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">
          Order {order.order_number}
        </h1>
        <span className={`px-3 py-1 rounded text-label-sm font-label-sm ${
          order.status === "delivered" ? "bg-secondary-container text-on-secondary-container" :
          order.status === "cancelled" ? "bg-error-container text-on-error-container" :
          "bg-surface-variant text-on-surface-variant"
        }`}>
          {order.status}
        </span>
      </div>

      <form action={updateOrder.bind(null, id)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
            <h2 className="font-headline-xs text-headline-xs text-on-surface">Customer</h2>
            {order.customers ? (
              <>
                <p className="font-body-md text-on-surface">{order.customers.first_name} {order.customers.last_name}</p>
                <p className="font-body-md text-on-surface-variant">{order.customer_email}</p>
                <p className="font-body-md text-on-surface-variant">{order.customer_phone}</p>
              </>
            ) : (
              <p className="font-body-md text-on-surface-variant">{order.customer_email || "Guest"}</p>
            )}
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
            <h2 className="font-headline-xs text-headline-xs text-on-surface">Summary</h2>
            <div className="space-y-2 font-body-md">
              <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span>€{order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Shipping</span><span>€{order.shipping_cost.toLocaleString()}</span></div>
              {order.discount > 0 && <div className="flex justify-between"><span className="text-on-surface-variant">Discount</span><span>-€{order.discount.toLocaleString()}</span></div>}
              <div className="flex justify-between font-label-md border-t border-outline-variant pt-2"><span>Total</span><span>€{order.total.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
            <h2 className="font-headline-xs text-headline-xs text-on-surface">Shipping Address</h2>
            {order.shipping_address ? (
              <div className="font-body-md text-on-surface-variant">
                <p>{(order.shipping_address as Address).line1}</p>
                {(order.shipping_address as Address).line2 && <p>{(order.shipping_address as Address).line2}</p>}
                <p>{(order.shipping_address as Address).city}, {(order.shipping_address as Address).state} {(order.shipping_address as Address).postalCode}</p>
                <p>{(order.shipping_address as Address).country}</p>
              </div>
            ) : <p className="text-on-surface-variant">Not provided</p>}
          </div>

          <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
            <h2 className="font-headline-xs text-headline-xs text-on-surface">Billing Address</h2>
            {order.billing_address ? (
              <div className="font-body-md text-on-surface-variant">
                <p>{(order.billing_address as Address).line1}</p>
                {(order.billing_address as Address).line2 && <p>{(order.billing_address as Address).line2}</p>}
                <p>{(order.billing_address as Address).city}, {(order.billing_address as Address).state} {(order.billing_address as Address).postalCode}</p>
                <p>{(order.billing_address as Address).country}</p>
              </div>
            ) : <p className="text-on-surface-variant">Same as shipping</p>}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
          <h2 className="font-headline-xs text-headline-xs text-on-surface">Update Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Order Status</label>
              <select name="status" defaultValue={order.status} className="w-full bg-transparent border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:border-secondary font-body-md">
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Payment Status</label>
              <select name="payment_status" defaultValue={order.payment_status} className="w-full bg-transparent border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:border-secondary font-body-md">
                {paymentOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Tracking Number</label>
              <input name="tracking_number" defaultValue={order.tracking_number ?? ""} className="w-full bg-transparent border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:border-secondary font-body-md" />
            </div>
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Notes</label>
            <textarea name="notes" defaultValue={order.notes ?? ""} rows={3} className="w-full bg-transparent border border-outline-variant rounded-lg px-3 py-2 focus:outline-none focus:border-secondary font-body-md resize-none" />
          </div>
          <button type="submit" className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md hover:bg-primary-fixed-dim transition-colors">
            Update Order
          </button>
        </div>
      </form>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden mt-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Item</th>
              <th className="text-left px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Qty</th>
              <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Price</th>
              <th className="text-right px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item: OrderItem) => (
              <tr key={item.id} className="border-b border-outline-variant/50">
                <td className="px-4 py-4 font-body-md text-on-surface">{item.products?.name ?? "Deleted product"}</td>
                <td className="px-4 py-4 font-body-md text-on-surface-variant">{item.quantity}</td>
                <td className="px-4 py-4 font-body-md text-on-surface text-right">€{item.price.toLocaleString()}</td>
                <td className="px-4 py-4 font-body-md text-on-surface text-right">€{item.subtotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
