"use client"

import { useState } from "react"
import Image from "next/image"
import { getProductImageUrl } from "@/lib/supabase/storage"

export function ProductImageCarousel({
  images,
  productName,
}: {
  images: { id: string; image_url: string }[]
  productName: string
}) {
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) return null

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] lg:pr-1 shrink-0">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setCurrent(i)}
            className={`shrink-0 w-16 h-16 lg:w-[80px] lg:h-[100px] relative overflow-hidden rounded-sm transition-all ${
              i === current
                ? "ring-2 ring-secondary ring-offset-1"
                : "ring-1 ring-outline-variant/40 opacity-60 hover:opacity-100 hover:ring-outline"
            }`}
          >
            {img.image_url && (
              <Image
                src={getProductImageUrl(img.image_url)}
                alt={`${productName} - Image ${i + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="80px"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main image with arrows always visible */}
      <div className="relative flex-1 group">
        <div className="aspect-[4/5] relative bg-surface-container-low overflow-hidden rounded-sm">
          <Image
            src={getProductImageUrl(images[current].image_url)}
            alt={`${productName} - Image ${current + 1}`}
            fill
            unoptimized
            className="object-cover scale-[1.4]"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />

          {/* Arrows always visible on image */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface hover:bg-white hover:shadow-lg transition-all z-10"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface hover:bg-white hover:shadow-lg transition-all z-10"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-label-sm z-10">
              {current + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
