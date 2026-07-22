"use client"

import Link from "next/link"
import { useWishlist } from "@/lib/wishlist"

export default function WishlistPage() {
  const { items, count } = useWishlist()

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-section-gap">
      <h1 className="font-headline-md text-headline-md text-primary mb-2">
        Your Wishlist
      </h1>
      <p className="font-body-md text-on-surface-variant mb-12">
        {count} {count === 1 ? "item" : "items"} saved
      </p>

      {count === 0 ? (
        <div className="text-center py-24">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
            Your wishlist is empty.
          </p>
          <Link
            href="/shop"
            className="bg-primary text-white px-10 py-4 font-label-md text-label-md no-underline inline-block hover:bg-secondary transition-colors"
          >
            Browse Rugs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((slug) => (
            <div key={slug} className="group">
              <Link href={`/product/${slug}`} className="no-underline">
                <div className="aspect-[3/4] bg-surface-container-low mb-4 overflow-hidden" />
                <h3 className="font-label-md text-label-md text-on-surface group-hover:text-secondary transition-colors capitalize">
                  {slug.replace(/-/g, " ")}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
