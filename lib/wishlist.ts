"use client"

import { useCallback, useSyncExternalStore } from "react"

const listeners = new Set<() => void>()

let items: string[] = []
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("afghan-wishlist")
    items = raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    items = []
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getSnapshot() {
  return items
}

const emptyArray: string[] = []
function getServerSnapshot() {
  return emptyArray
}

function emit() {
  localStorage.setItem("afghan-wishlist", JSON.stringify(items))
  listeners.forEach((l) => l())
}

export function useWishlist() {
  const wishlist = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback((slug: string) => {
    const next = items.includes(slug)
      ? items.filter((s) => s !== slug)
      : [...items, slug]
    items = next
    emit()
  }, [])

  const isWishlisted = useCallback(
    (slug: string) => wishlist.includes(slug),
    [wishlist],
  )

  return { items: wishlist, toggle, isWishlisted, count: wishlist.length }
}
