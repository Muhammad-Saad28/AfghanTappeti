"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useWishlist } from "@/lib/wishlist"
import { createClient } from "@/lib/supabase/client"
import { getProductImageUrl } from "@/lib/supabase/storage"
import en from "@/messages/en.json"
import it from "@/messages/it.json"

const dictionaries = { en, it } as const

export default function WishlistPage() {
  const params = useParams()
  const locale = (params.lang === "it" ? "it" : "en") as keyof typeof dictionaries
  const t = dictionaries[locale].wishlist
  const { items, count } = useWishlist()
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    if (items.length === 0) return
    const fetchImages = async () => {
      const supabase = createClient()
      const { data: products } = await supabase
        .from("products")
        .select("slug, id")
        .in("slug", items)
      const ids = (products ?? []).map((p) => p.id)
      if (ids.length === 0) return
      const { data: images } = await supabase
        .from("product_images")
        .select("product_id, image_url")
        .in("product_id", ids)
        .eq("display_order", 0)
      const slugIdMap = new Map((products ?? []).map((p) => [p.id, p.slug]))
      const map: Record<string, string> = {}
      for (const img of images ?? []) {
        const slug = slugIdMap.get(img.product_id)
        if (slug) map[slug] = getProductImageUrl(img.image_url)
      }
      setImageUrls(map)
    }
    fetchImages()
  }, [items])

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-section-gap">
      <h1 className="font-headline-md text-headline-md text-primary mb-2">{t.title}</h1>
      <p className="font-body-md text-on-surface-variant mb-12">{count} {count === 1 ? t.item_saved : t.items_saved}</p>
      {count === 0 ? (
        <div className="text-center py-24">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">{t.empty}</p>
          <Link href={`/${locale}/shop`} className="bg-primary text-white px-10 py-4 font-label-md text-label-md no-underline inline-block hover:bg-secondary transition-colors">{t.empty_cta}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((slug) => {
            const imgUrl = imageUrls[slug]
            return (
              <div key={slug} className="group">
                <Link href={`/${locale}/product/${slug}`} className="no-underline">
                  <div className="aspect-[3/4] bg-cover bg-center mb-4 overflow-hidden" style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : undefined} />
                  <h3 className="font-label-md text-label-md text-on-surface group-hover:text-secondary transition-colors capitalize">{slug.replace(/-/g, " ")}</h3>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
