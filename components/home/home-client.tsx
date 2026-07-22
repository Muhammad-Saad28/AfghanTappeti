"use client"

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
}: {
  name: string
  color: string
}) {
  return (
    <button className="flex flex-col items-center gap-2 group">
      <div
        className="w-16 h-16 rounded-full border border-outline-variant transition-transform group-hover:scale-110 shadow-sm"
        style={{ backgroundColor: color }}
      />
      <span className="font-label-sm text-label-sm text-on-surface-variant">
        {name}
      </span>
    </button>
  )
}

export function SizeCard({
  label,
  size,
}: {
  label: string
  size: string
}) {
  return (
    <button className="border border-outline-variant py-6 px-4 text-center hover:bg-primary-container hover:text-white transition-colors group">
      <span className="block font-label-md text-label-md uppercase tracking-widest">
        {label}
      </span>
      <span className="block font-body-md text-body-md opacity-60 mt-1">
        {size}
      </span>
    </button>
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
