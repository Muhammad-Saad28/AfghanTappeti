import { createClient } from "@supabase/supabase-js"
import { readdirSync } from "fs"
import { join } from "path"
import { config } from "dotenv"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const PRICE_PER_SQM = 310
const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products"

// Parse image filenames like "79-388x308.JPG" → { number: "79", length: 388, width: 308 }
function parseImageFilename(filename) {
  const match = filename.match(/^(\d+)-(\d+)x(\d+)\s*(?:\(\d+\))?\.\w+$/i)
  if (!match) return null
  return { number: match[1], length: parseInt(match[2]), width: parseInt(match[3]) }
}

// Correct formula: (L / 100) × (W / 100) × 310 → round
function calculatePrice(lengthCm, widthCm) {
  return Math.round((lengthCm / 100) * (widthCm / 100) * PRICE_PER_SQM)
}

async function main() {
  console.log("=== Fix Prices from Image Filenames ===\n")

  // Step 1: Build a map of product number → dimensions from image files
  const imageDimensions = new Map()

  const folders = readdirSync(PRODUCTS_DIR).filter(f => {
    const path = join(PRODUCTS_DIR, f)
    try { return readdirSync(path).length > 0 } catch { return false }
  })

  for (const folder of folders) {
    const folderPath = join(PRODUCTS_DIR, folder)
    const files = readdirSync(folderPath).filter(f => f.toUpperCase().endsWith(".JPG"))

    for (const file of files) {
      const parsed = parseImageFilename(file)
      if (!parsed) continue
      // Use the main image (no variant number in parens) for dimensions
      if (!imageDimensions.has(parsed.number)) {
        imageDimensions.set(parsed.number, { length: parsed.length, width: parsed.width, file })
      }
    }
  }

  console.log(`Found ${imageDimensions.size} unique product numbers from images\n`)

  // Step 2: Fetch all products from database
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, sku, price")
    .is("deleted_at", null)
    .eq("is_active", true)

  if (error) {
    console.error("Error fetching products:", error.message)
    process.exit(1)
  }

  console.log(`Found ${products.length} products in database\n`)

  // Step 3: Match and update prices
  let updated = 0
  let noMatch = 0
  let alreadyCorrect = 0
  const changes = []

  for (const product of products) {
    // Extract product number from SKU (e.g., "AK-079" → "79") or from name (e.g., "Mamluk Rug 79" → "79")
    let productNumber = null

    if (product.sku) {
      const skuMatch = product.sku.match(/(\d+)$/)
      if (skuMatch) productNumber = skuMatch[1]
    }

    if (!productNumber && product.name) {
      const nameMatch = product.name.match(/(\d+)\s*$/)
      if (nameMatch) productNumber = nameMatch[1]
    }

    if (!productNumber || !imageDimensions.has(productNumber)) {
      noMatch++
      continue
    }

    const dims = imageDimensions.get(productNumber)
    const correctPrice = calculatePrice(dims.length, dims.width)
    const currentPrice = Math.round(product.price)

    if (currentPrice === correctPrice) {
      alreadyCorrect++
      continue
    }

    changes.push({
      name: product.name,
      sku: product.sku,
      productNumber,
      dimensions: `${dims.length}x${dims.width}`,
      oldPrice: currentPrice,
      newPrice: correctPrice,
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
  }

  console.log("=== PRICE FIX REPORT ===\n")
  console.log(`Total products: ${products.length}`)
  console.log(`Updated: ${updated}`)
  console.log(`Already correct: ${alreadyCorrect}`)
  console.log(`No matching image: ${noMatch}`)

  if (changes.length > 0) {
    console.log(`\n=== CHANGES (${changes.length}) ===\n`)
    console.log("Product".padEnd(40) + "SKU".padEnd(12) + "Dims".padEnd(12) + "Old".padEnd(10) + "New")
    console.log("-".repeat(84))
    for (const c of changes) {
      console.log(
        c.name.padEnd(40) +
        (c.sku || "").padEnd(12) +
        c.dimensions.padEnd(12) +
        `€${c.oldPrice}`.padEnd(10) +
        `€${c.newPrice}`
      )
    }
  } else {
    console.log("\nAll prices are correct!")
  }
}

main()
