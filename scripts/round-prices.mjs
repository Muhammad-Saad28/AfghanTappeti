import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function round(p) { return Math.round(p) }

async function main() {
  // Round products
  console.log("Fetching products...")
  const { data: products, error: pErr } = await supabase.from("products").select("id, price, sale_price")
  if (pErr) { console.error("Products fetch error:", pErr.message); return }
  console.log(`  Found ${products.length} products`)

  for (const p of products) {
    const patch = {}
    if (p.price != null) patch.price = round(p.price)
    if (p.sale_price != null) patch.sale_price = round(p.sale_price)
    if (Object.keys(patch).length > 0) {
      const { error } = await supabase.from("products").update(patch).eq("id", p.id)
      if (error) console.error(`  Product ${p.id} error:`, error.message)
    }
  }
  console.log("  Products done")

  // Round orders
  console.log("Fetching orders...")
  const { data: orders, error: oErr } = await supabase.from("orders").select("id, subtotal, shipping_cost, discount, tax, total")
  if (oErr) { console.error("Orders fetch error:", oErr.message); return }
  console.log(`  Found ${orders.length} orders`)

  for (const o of orders) {
    const patch = {
      subtotal: round(o.subtotal),
      shipping_cost: round(o.shipping_cost),
      discount: round(o.discount),
      tax: round(o.tax),
      total: round(o.total),
    }
    const { error } = await supabase.from("orders").update(patch).eq("id", o.id)
    if (error) console.error(`  Order ${o.id} error:`, error.message)
  }
  console.log("  Orders done")

  // Round order_items
  console.log("Fetching order_items...")
  const { data: items, error: iErr } = await supabase.from("order_items").select("id, price, subtotal")
  if (iErr) { console.error("Order items fetch error:", iErr.message); return }
  console.log(`  Found ${items.length} order items`)

  for (const i of items) {
    const patch = { price: round(i.price), subtotal: round(i.subtotal) }
    const { error } = await supabase.from("order_items").update(patch).eq("id", i.id)
    if (error) console.error(`  Order item ${i.id} error:`, error.message)
  }
  console.log("  Order items done")

  console.log("All prices rounded!")
}

main().catch(console.error)
