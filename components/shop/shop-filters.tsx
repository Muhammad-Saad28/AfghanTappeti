"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import Link from "next/link"

interface FilterOption {
  id: string
  name: string
  hex_code?: string
}

interface ShopFiltersProps {
  locale: string
  origins: FilterOption[]
  materials: FilterOption[]
  colors: FilterOption[]
  sizes: FilterOption[]
  labels: {
    filters: string
    clear_all: string
    filter_origin: string
    filter_material: string
    filter_color: string
    filter_size: string
  }
}

export function ShopFilters({
  locale,
  origins,
  materials,
  colors,
  sizes,
  labels,
}: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedOrigins = searchParams.get("origin")?.split(",").filter(Boolean) ?? []
  const selectedMaterials = searchParams.get("material")?.split(",").filter(Boolean) ?? []
  const selectedColors = searchParams.get("color")?.split(",").filter(Boolean) ?? []
  const selectedSizes = searchParams.get("size")?.split(",").filter(Boolean) ?? []

  const toggleFilter = useCallback(
    (paramName: string, value: string, current: string[]) => {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]

      const params = new URLSearchParams(searchParams.toString())
      if (next.length > 0) {
        params.set(paramName, next.join(","))
      } else {
        params.delete(paramName)
      }
      params.delete("page")
      router.push(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <>
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant">
        <h3 className="font-headline-sm text-headline-sm">{labels.filters}</h3>
        <Link
          href={`/${locale}/shop`}
          className="text-label-sm font-label-sm text-secondary uppercase no-underline"
        >
          {labels.clear_all}
        </Link>
      </div>

      <div className="space-y-10">
        <div>
          <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">
            {labels.filter_origin}
          </h4>
          <div className="space-y-3">
            {origins.map((o) => (
              <label
                key={o.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedOrigins.includes(o.id)}
                  onChange={() =>
                    toggleFilter("origin", o.id, selectedOrigins)
                  }
                  className="rounded border-outline-variant text-primary focus:ring-secondary w-4 h-4"
                />
                <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                  {o.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">
            {labels.filter_material}
          </h4>
          <div className="space-y-3">
            {materials.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(m.id)}
                  onChange={() =>
                    toggleFilter("material", m.id, selectedMaterials)
                  }
                  className="rounded border-outline-variant text-primary focus:ring-secondary w-4 h-4"
                />
                <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                  {m.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">
            {labels.filter_color}
          </h4>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <label key={c.id} className="cursor-pointer group relative">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(c.id)}
                  onChange={() =>
                    toggleFilter("color", c.id, selectedColors)
                  }
                  className="sr-only peer"
                />
                <span
                  className="w-9 h-9 rounded-full border-2 border-outline block peer-checked:border-secondary peer-checked:ring-2 peer-checked:ring-secondary/40 transition-all group-hover:border-secondary shadow-sm"
                  style={{ backgroundColor: c.hex_code || "#ccc" }}
                  title={c.name}
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">
            {labels.filter_size}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((s) => (
              <label
                key={s.id}
                className={`border text-center cursor-pointer text-label-sm font-label-sm hover:border-secondary transition-colors ${
                  selectedSizes.includes(s.id)
                    ? "border-secondary bg-secondary-container text-on-secondary-container"
                    : "border-outline-variant"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(s.id)}
                  onChange={() =>
                    toggleFilter("size", s.id, selectedSizes)
                  }
                  className="sr-only"
                />
                <span className="block px-3 py-2">{s.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
