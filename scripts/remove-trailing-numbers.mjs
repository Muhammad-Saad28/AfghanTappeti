import { createClient } from "@supabase/supabase-js"
import { join } from "path"
import { config } from "dotenv"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  console.log("=== Remove Trailing Numbers from Product Names ===\n")

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, slug")
    .is("deleted_at", null)
    .eq("is_active", true)

  if (error) {
    console.error("Error fetching products:", error.message)
    process.exit(1)
  }

  console.log(`Found ${products.length} products\n`)

  let updated = 0
  let skipped = 0

  for (const product of products) {
    // Remove trailing number from name: "Mamluk Rug 79" → "Mamluk Rug"
    const newName = product.name.replace(/\s+\d+\s*$/, "").trim()

    if (newName === product.name) {
      skipped++
      continue
    }

    // Only update the name, keep slug unchanged for uniqueness
    const { error: updateErr } = await supabase
      .from("products")
      .update({ name: newName })
      .eq("id", product.id)

    if (updateErr) {
      console.error(`Failed to update ${product.name}:`, updateErr.message)
    } else {
      console.log(`"${product.name}" → "${newName}"`)
      updated++
    }
  }

  console.log(`\n=== DONE ===`)
  console.log(`Updated: ${updated}`)
  console.log(`Skipped (no trailing number): ${skipped}`)
}

main()
