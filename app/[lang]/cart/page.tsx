"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/lib/cart"
import { Trash2, Minus, Plus, ArrowLeft } from "lucide-react"

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart, subtotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="font-headline-sm text-headline-sm text-on-surface mb-3">Your Cart is Empty</h1>
        <p className="text-on-surface-variant font-body-md mb-8">Add some rugs to get started.</p>
        <Link
          href="/shop"
          className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md no-underline hover:bg-primary-fixed-dim transition-colors"
        >
          Browse Rugs
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-margin-mobile md:px-margin-desktop max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline-sm text-headline-sm text-on-surface">Shopping Cart</h1>
        <button onClick={clearCart} className="text-label-md text-on-surface-variant hover:text-error transition-colors">
          Clear All
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 pb-6 border-b border-outline-variant">
              <div className="w-24 h-24 bg-surface-variant rounded-lg flex-shrink-0 overflow-hidden relative">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.slug}`} className="font-body-md text-on-surface hover:text-secondary no-underline transition-colors">
                  {item.name}
                </Link>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                  €{(item.sale_price ?? item.price).toLocaleString()}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-outline-variant rounded">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-surface-variant transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="px-3 font-label-sm text-label-sm min-w-[24px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-surface-variant transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-on-surface-variant hover:text-error transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-body-md text-on-surface">
                  €{((item.sale_price ?? item.price) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-80">
          <div className="bg-surface rounded-xl border border-outline-variant p-6 sticky top-32">
            <h2 className="font-headline-xs text-headline-xs text-on-surface mb-4">Order Summary</h2>
            <div className="space-y-3 font-body-md">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-on-surface">€{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="text-on-surface-variant">Calculated at checkout</span>
              </div>
              <div className="border-t border-outline-variant pt-3 flex justify-between font-label-md">
                <span className="text-on-surface">Total</span>
                <span className="text-on-surface">€{subtotal.toLocaleString()}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block text-center bg-primary text-on-primary w-full py-3 rounded-lg text-label-md no-underline hover:bg-primary-fixed-dim transition-colors mt-6"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center gap-1 text-label-sm text-on-surface-variant hover:text-secondary no-underline transition-colors mt-3"
            >
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
