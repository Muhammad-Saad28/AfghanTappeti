import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function roundPrice(p) {
  return Math.round(p)
}

async function roundTable(table, columns) {
  const { data: rows, error: fetchErr } = await supabase.from(table).select("id")
  if (fetchErr) { console.error(`Fetch ${table} error:`, fetchErr.message); return 0 }

  let updated = 0
  for (const row of rows) {
    const { data: full } = await supabase.from(table).select("*").eq("id", row.id).single()
    if (!full) continue

    const patch = {}
    for (const col of columns) {
      if (full[col] != null) {
        const rounded = roundPrice(full[col])
        if (rounded !== full[col]) patch[col] = rounded
      }
    }
    if (Object.keys(patch).length > 0) {
      const { error } = await supabase.from(table).update(patch).eq("id", row.id)
      if (error) console.error(`Update ${table} ${row.id} error:`, error.message)
      else updated++
    }
  }
  return updated
}

async function main() {
  console.log("Rounding products.price, products.sale_price...")
  const p = await roundTable("products", ["price", "sale_price"])
  console.log(`  Updated ${p} products`)

  console.log("Rounding orders subtotal/shipping/discount/tax/total...")
  const o = await roundTable("orders", ["subtotal", "shipping_cost", "discount", "tax", "total"])
  console.log(`  Updated ${o} orders`)

  console.log("Rounding order_items price/subtotal...")
  const oi = await roundTable("order_items", ["price", "subtotal"])
  console.log(`  Updated ${oi} order items`)

  console.log("Done!")
}

main().catch(console.error)
