import { createClient } from "@supabase/supabase-js"
import { join } from "path"
import { config } from "dotenv"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const PRICE_PER_SQM = 310

function calculatePrice(widthCm, lengthCm) {
  return Math.round((widthCm / 100) * (lengthCm / 100) * PRICE_PER_SQM)
}

async function main() {
  // Fetch all active products with their sizes
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, sku, price, size_id, sizes(name, width_cm, length_cm)")
    .is("deleted_at", null)
    .eq("is_active", true)

  if (error) {
    console.error("Error fetching products:", error.message)
    process.exit(1)
  }

  console.log(`Found ${products.length} active products\n`)

  let updated = 0
  let skipped = 0
  let noSize = 0
  const changes = []

  for (const product of products) {
    const size = product.sizes
    if (!size || !size.width_cm || !size.length_cm) {
      noSize++
      continue
    }

    const correctPrice = calculatePrice(size.width_cm, size.length_cm)
    const currentPrice = Math.round(product.price)

    if (currentPrice !== correctPrice) {
      changes.push({
        name: product.name,
        sku: product.sku,
        size: size.name,
        dimensions: `${size.width_cm}x${size.length_cm}`,
        oldPrice: currentPrice,
        newPrice: correctPrice,
        diff: correctPrice - currentPrice,
      })

      const { error: updateErr } = await supabase
        .from("products")
        .update({ price: correctPrice })
        .eq("id", product.id)

      if (updateErr) {
        console.error(`Failed to update ${product.name}:`, updateErr.message)
      } else {
        updated++
      }
    } else {
      skipped++
    }
  }

  console.log("=== PRICE FIX REPORT ===\n")
  console.log(`Total products: ${products.length}`)
  console.log(`Updated: ${updated}`)
  console.log(`Already correct: ${skipped}`)
  console.log(`No size assigned: ${noSize}`)

  if (changes.length > 0) {
    console.log(`\n=== CHANGES (${changes.length}) ===\n`)
    console.log("Product".padEnd(35) + "Size".padEnd(12) + "Dimensions".padEnd(15) + "Old".padEnd(10) + "New".padEnd(10) + "Diff")
    console.log("-".repeat(92))
    for (const c of changes) {
      const sign = c.diff > 0 ? "+" : ""
      console.log(
        c.name.padEnd(35) +
        c.size.padEnd(12) +
        c.dimensions.padEnd(15) +
        `€${c.oldPrice}`.padEnd(10) +
        `€${c.newPrice}`.padEnd(10) +
        `${sign}€${c.diff}`
      )
    }
  } else {
    console.log("\nAll prices are correct!")
  }
}

main()
