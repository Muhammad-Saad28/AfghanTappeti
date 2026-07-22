"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart"
import { placeOrder, type CheckoutInput } from "@/lib/checkout-actions"

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart()
  const [billingSame, setBillingSame] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [shipping, setShipping] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Italy",
  })

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="font-headline-sm text-headline-sm text-on-surface mb-3">Your Cart is Empty</h1>
        <Link href="/shop" className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md no-underline hover:bg-primary-fixed-dim transition-colors">
          Browse Rugs
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError("")
    try {
      const data: CheckoutInput = {
        ...form,
        shippingAddress: shipping,
        billingSame,
        billingAddress: billingSame ? undefined : shipping,
        cart: cart.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.sale_price ?? i.price })),
        subtotal,
      }
      clearCart()
      await placeOrder(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setPending(false)
    }
  }

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const updateShipping = (e: React.ChangeEvent<HTMLInputElement>) =>
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <div className="min-h-screen pt-32 pb-16 px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto">
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
          <section className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
            <h2 className="font-headline-xs text-headline-xs text-on-surface">Contact</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">First Name *</label>
                <input name="firstName" required value={form.firstName} onChange={updateForm} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Last Name *</label>
                <input name="lastName" required value={form.lastName} onChange={updateForm} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Email *</label>
              <input name="email" type="email" required value={form.email} onChange={updateForm} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Phone</label>
              <input name="phone" type="tel" value={form.phone} onChange={updateForm} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
            </div>
          </section>

          <section className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
            <h2 className="font-headline-xs text-headline-xs text-on-surface">Shipping Address</h2>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Address *</label>
              <input name="line1" required value={shipping.line1} onChange={updateShipping} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Apt / Suite</label>
              <input name="line2" value={shipping.line2} onChange={updateShipping} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">City *</label>
                <input name="city" required value={shipping.city} onChange={updateShipping} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Postal Code *</label>
                <input name="postalCode" required value={shipping.postalCode} onChange={updateShipping} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">State / Province</label>
                <input name="state" value={shipping.state} onChange={updateShipping} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Country *</label>
                <input name="country" required value={shipping.country} onChange={updateShipping} className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} className="accent-secondary" />
              <span className="font-body-md text-on-surface">Billing address same as shipping</span>
            </label>
          </section>

          {error && <p className="text-error font-body-md">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="bg-primary text-on-primary w-full py-3 rounded-lg text-label-md hover:bg-primary-fixed-dim transition-colors disabled:opacity-50"
          >
            {pending ? "Placing Order..." : `Place Order — €${subtotal.toLocaleString()}`}
          </button>
        </div>

        <div className="lg:w-80">
          <div className="bg-surface rounded-xl border border-outline-variant p-6 sticky top-32 space-y-4">
            <h2 className="font-headline-xs text-headline-xs text-on-surface">Order Summary</h2>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-body-md">
                <span className="text-on-surface-variant truncate mr-2">{item.name} x{item.quantity}</span>
                <span className="text-on-surface flex-shrink-0">€{((item.sale_price ?? item.price) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-outline-variant pt-3 flex justify-between font-label-md">
              <span className="text-on-surface">Total</span>
              <span className="text-on-surface">€{subtotal.toLocaleString()}</span>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Payment upon confirmation (bank transfer or wire)</p>
          </div>
        </div>
      </form>
    </div>
  )
}
