"use client"

import { useCart } from "@/lib/cart"
import { ShoppingBag } from "lucide-react"

export function AddToCartButton({
  id, name, slug, price, salePrice, image,
}: {
  id: string; name: string; slug: string; price: number; salePrice: number | null; image: string
}) {
  const { addItem } = useCart()

  return (
    <button
      onClick={() => addItem({ id, name, slug, price, sale_price: salePrice, image })}
      className="bg-primary-container text-white py-5 px-8 font-label-md text-label-md tracking-widest hover:bg-secondary transition-all duration-300 flex items-center justify-center gap-3"
    >
      <ShoppingBag size={18} /> ADD TO BAG
    </button>
  )
}
