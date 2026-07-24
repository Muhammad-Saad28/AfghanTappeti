"use client"

import { useRouter, useSearchParams } from "next/navigation"

export function ShopSort({ options }: { label: string; options: { value: string; label: string }[] }) {
  const router = useRouter()
  const sp = useSearchParams()

  const current = sp.get("sort") || "newest"

  return (
    <select
      value={current}
      onChange={(e) => {
        const p = new URLSearchParams(sp.toString())
        p.set("sort", e.target.value)
        router.push(`?${p.toString()}`)
      }}
      className="bg-transparent border-none font-label-md text-label-md focus:ring-0 cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
