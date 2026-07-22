import { useSyncExternalStore, useCallback } from "react"

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  sale_price: number | null
  image: string
  quantity: number
}

const listeners = new Set<() => void>()

function emitChange() {
  if (typeof window === "undefined") return
  localStorage.setItem("afghan-cart", JSON.stringify(items))
  listeners.forEach((l) => l())
}

let items: CartItem[] = []
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("afghan-cart")
    items = raw ? JSON.parse(raw) : []
  } catch {
    items = []
  }
}

function subscribeInternal(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshotInternal() {
  return items
}

export function useCart() {
  const cart = useSyncExternalStore(subscribeInternal, getSnapshotInternal, getSnapshotInternal)

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const existing = items.find((i) => i.id === item.id)
      if (existing) {
        existing.quantity += item.quantity ?? 1
      } else {
        items.push({ ...item, quantity: item.quantity ?? 1 })
      }
      emitChange()
    },
    [],
  )

  const removeItem = useCallback((id: string) => {
    items = items.filter((i) => i.id !== id)
    emitChange()
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      items = items.filter((i) => i.id !== id)
    } else {
      const item = items.find((i) => i.id === id)
      if (item) item.quantity = quantity
    }
    emitChange()
  }, [])

  const clearCart = useCallback(() => {
    items = []
    emitChange()
  }, [])

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cart.reduce((sum, i) => sum + (i.sale_price ?? i.price) * i.quantity, 0)

  return { cart, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }
}

export function getCartSnapshot(): CartItem[] {
  return items
}
