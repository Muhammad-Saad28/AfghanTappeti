"use client"

import Link from "next/link"
import { useRef } from "react"
import { cn } from "@/lib/utils"

export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="text-center mb-16">
      <h2 className="font-headline-md text-headline-md text-primary mb-4">
        {title}
      </h2>
      <div className="w-24 h-px bg-outline-variant mx-auto" />
    </div>
  )
}

export function ColorSwatch({
  name,
  color,
  href,
}: {
  name: string
  color: string
  href: string
}) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 group no-underline">
      <div
        className="w-16 h-16 rounded-full border-2 border-outline-variant transition-all group-hover:scale-110 group-hover:border-secondary shadow-sm"
        style={{ backgroundColor: color }}
      />
      <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-secondary transition-colors">
        {name}
      </span>
    </Link>
  )
}

export function SizeCard({
  label,
  size,
  href,
}: {
  label: string
  size: string
  href: string
}) {
  return (
    <Link href={href} className="border border-outline-variant py-6 px-4 text-center hover:bg-primary-container hover:text-white transition-colors group block no-underline">
      <span className="block font-label-md text-label-md uppercase tracking-widest text-on-surface group-hover:text-white transition-colors">
        {label}
      </span>
      <span className="block font-body-md text-body-md opacity-60 mt-1 text-on-surface-variant group-hover:text-white/80 transition-colors">
        {size}
      </span>
    </Link>
  )
}

export function BestSellersCarousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 340
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <div>
      <div className="flex gap-4 justify-end mb-6">
        <button
          onClick={() => scroll("left")}
          className="w-12 h-12 border border-outline-variant rounded-full flex items-center justify-center hover:border-primary hover:bg-surface-container transition-all"
          aria-label="Scroll left"
        >
          <span className="text-lg">←</span>
        </button>
        <button
          onClick={() => scroll("right")}
          className="w-12 h-12 border border-outline-variant rounded-full flex items-center justify-center hover:border-primary hover:bg-surface-container transition-all"
          aria-label="Scroll right"
        >
          <span className="text-lg">→</span>
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-gutter overflow-x-auto pb-10 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </div>
  )
}

export function CarouselArrow({
  direction,
}: {
  direction: "left" | "right"
}) {
  return (
    <button
      className={cn(
        "w-12 h-12 border border-outline-variant rounded-full flex items-center justify-center hover:border-primary transition-colors",
      )}
    >
      <span className="text-lg">{direction === "left" ? "←" : "→"}</span>
    </button>
  )
}
