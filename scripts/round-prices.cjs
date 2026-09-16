require("dotenv").config()
const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function round(p) { return Math.round(p) }

async function roundTable(table, columns) {
  console.log(`\n--- ${table} ---`)
  const { data: rows, error } = await supabase.from(table).select(`id, ${columns.join(", ")}`)
  if (error) { console.error("Fetch error:", error.message); return }

  let count = 0
  for (const row of rows) {
    const patch = {}
    for (const col of columns) {
      if (row[col] != null) {
        const r = round(row[col])
        if (r !== row[col]) patch[col] = r
      }
    }
    if (Object.keys(patch).length > 0) {
      const { error: updErr } = await supabase.from(table).update(patch).eq("id", row.id)
      if (updErr) console.error(`  Error ${row.id}:`, updErr.message)
      else count++
    }
  }
  console.log(`  Updated ${count}/${rows.length} rows`)
}

async function main() {
  console.log("Starting price rounding...")
  await roundTable("products", ["price", "sale_price"])
  await roundTable("orders", ["subtotal", "shipping_cost", "discount", "tax", "total"])
  await roundTable("order_items", ["price", "subtotal"])
  console.log("\nDone!")
}

main().catch(console.error)
