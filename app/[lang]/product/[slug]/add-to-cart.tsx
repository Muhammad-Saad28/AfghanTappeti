"use client"

import { useParams } from "next/navigation"
import { useCart } from "@/lib/cart"
import { ShoppingBag } from "lucide-react"
import en from "@/messages/en.json"
import it from "@/messages/it.json"

const dictionaries = { en, it } as const

export function AddToCartButton({
  id, name, slug, price, salePrice, image,
}: {
  id: string; name: string; slug: string; price: number; salePrice: number | null; image: string
}) {
  const params = useParams()
  const locale = (params.lang === "it" ? "it" : "en") as keyof typeof dictionaries
  const t = dictionaries[locale].product
  const { addItem } = useCart()

  return (
    <button
      onClick={() => addItem({ id, name, slug, price, sale_price: salePrice, image })}
      className="bg-primary-container text-white py-5 px-8 font-label-md text-label-md tracking-widest hover:bg-secondary transition-all duration-300 flex items-center justify-center gap-3"
    >
      <ShoppingBag size={18} /> {t.add_to_cart}
    </button>
  )
}
