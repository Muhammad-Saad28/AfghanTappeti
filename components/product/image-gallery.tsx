"use client"

import { useState } from "react"
import Image from "next/image"
import { getProductImageUrl } from "@/lib/supabase/storage"

export function ImageGallery({
  images,
  productName,
}: {
  images: { image_url: string }[]
  productName: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 flex items-center gap-2 border border-outline-variant px-4 py-2 font-label-sm text-label-sm text-on-surface-variant hover:border-secondary hover:text-secondary transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
        View All {images.length} Images
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>

          <div className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={getProductImageUrl(images[activeIndex].image_url)}
              alt={`${productName} - Image ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                >
                  →
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
