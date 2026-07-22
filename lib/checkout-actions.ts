"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

function generateOrderNumber(): string {
  const date = new Date()
  const y = date.getFullYear().toString().slice(-2)
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const d = date.getDate().toString().padStart(2, "0")
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `AFG-${y}${m}${d}-${rand}`
}

export interface CheckoutInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
  billingSame: boolean
  billingAddress?: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
  cart: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
}

export async function placeOrder(data: CheckoutInput) {
  const supabase = await createClient()

  // Upsert customer
  const { data: customer } = await supabase
    .from("customers")
    .upsert(
      { first_name: data.firstName, last_name: data.lastName, email: data.email, phone: data.phone },
      { onConflict: "email", ignoreDuplicates: false },
    )
    .select()
    .single()

  const orderNumber = generateOrderNumber()

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customer?.id ?? null,
      order_number: orderNumber,
      status: "pending",
      subtotal: data.subtotal,
      shipping_cost: 0,
      discount: 0,
      tax: 0,
      total: data.subtotal,
      payment_status: "pending",
      customer_email: data.email,
      customer_phone: data.phone,
      shipping_address: data.shippingAddress,
      billing_address: data.billingSame ? data.shippingAddress : data.billingAddress,
    })
    .select()
    .single()

  if (orderError) throw new Error(orderError.message)

  // Create order items
  const orderItems = data.cart.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
  if (itemsError) throw new Error(itemsError.message)

  redirect(`/checkout/success?order=${orderNumber}`)
}
