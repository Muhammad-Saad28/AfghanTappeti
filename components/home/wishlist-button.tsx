"use client"

import { useWishlist } from "@/lib/wishlist"
import { cn } from "@/lib/utils"

export function WishlistButton({ slug }: { slug: string }) {
  const { toggle, isWishlisted } = useWishlist()
  const active = isWishlisted(slug)

  return (
    <button
      onClick={() => toggle(slug)}
      className={cn(
        "absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors z-10",
        active && "text-secondary",
      )}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        className="w-5 h-5"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}
