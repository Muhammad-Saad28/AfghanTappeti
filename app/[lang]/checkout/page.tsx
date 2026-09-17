"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useCart } from "@/lib/cart"
import { getWhatsAppLink } from "@/lib/whatsapp"
import { roundPrice } from "@/lib/utils"
import en from "@/messages/en.json"
import it from "@/messages/it.json"

const dictionaries = { en, it } as const
const WHATSAPP_NUMBER = "+923054449151"

export default function CheckoutPage() {
  const params = useParams()
  const locale = (params.lang === "it" ? "it" : "en") as keyof typeof dictionaries
  const t = dictionaries[locale].checkout
  const cartMessages = dictionaries[locale].cart
  const { cart, subtotal, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="font-headline-sm text-headline-sm text-on-surface mb-3">{cartMessages.empty}</h1>
        <Link href={`/${locale}/shop`} className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md no-underline hover:bg-primary-fixed-dim transition-colors">{cartMessages.empty_cta}</Link>
      </div>
    )
  }

  const items = cart.map((i) => ({
    name: i.name,
    quantity: i.quantity,
    price: i.sale_price ?? i.price,
  }))

  const lines = [
    "Hello! I would like to place an order:",
    "",
    ...items.map((i) => `• ${i.quantity}x ${i.name} — €${roundPrice(i.price * i.quantity).toLocaleString()}`),
    "",
    `Total: €${roundPrice(subtotal).toLocaleString()}`,
    "",
    "Please confirm availability and share payment details.",
  ]
  const message = lines.join("\n")
  const whatsappUrl = getWhatsAppLink(WHATSAPP_NUMBER, message)

  function handleOrder() {
    clearCart()
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto">
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-2">{t.title}</h1>
      <p className="text-on-surface-variant font-body-md mb-8">Review your order and complete it via WhatsApp.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b border-outline-variant">
              <div className="w-20 h-20 bg-surface-variant rounded-lg flex-shrink-0 overflow-hidden relative">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-contain" sizes="80px" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-md text-on-surface">{item.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                  €{roundPrice(item.sale_price ?? item.price).toLocaleString()} × {item.quantity}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-body-md text-on-surface">€{roundPrice((item.sale_price ?? item.price) * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-80">
          <div className="bg-surface rounded-xl border border-outline-variant p-6 sticky top-32 space-y-4">
            <h2 className="font-headline-xs text-headline-xs text-on-surface">{t.summary}</h2>
            <div className="space-y-3 font-body-md">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{cartMessages.subtotal}</span>
                <span className="text-on-surface">€{roundPrice(subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{cartMessages.shipping}</span>
                <span className="text-on-surface-variant">{cartMessages.shipping_calc}</span>
              </div>
              <div className="border-t border-outline-variant pt-3 flex justify-between font-label-md">
                <span className="text-on-surface">{cartMessages.total}</span>
                <span className="text-on-surface">€{roundPrice(subtotal).toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handleOrder}
              className="bg-[#25D366] hover:bg-[#1da851] text-white w-full py-3 rounded-lg text-label-md transition-colors mt-2 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order via WhatsApp
            </button>
            <Link href={`/${locale}/shop`} className="flex items-center justify-center gap-1 text-label-sm text-on-surface-variant hover:text-secondary no-underline transition-colors mt-3">
              {cartMessages.continue}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
