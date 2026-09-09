import { createClient } from "@supabase/supabase-js"
import { readdirSync, readFileSync } from "fs"
import { join, extname, basename } from "path"
import { config } from "dotenv"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products"

function basenameFn(filePath, ext) {
  const name = filePath.split(/[\\/]/).pop()
  if (ext && name.toLowerCase().endsWith(ext.toLowerCase())) return name.slice(0, -ext.length)
  return name
}

function parseRawFilename(filename) {
  const ext = extname(filename)
  const name = basenameFn(filename, ext)
  const match = name.match(/^(\d+)-(\d+)x(\d+)(?:\s*\((\d+)\))?$/)
  if (!match) return null
  return { productNumber: match[1], width: parseInt(match[2]), height: parseInt(match[3]) }
}

function calculateSize(width, height) {
  const area = width * height
  const converted = area / 1000
  const rounded = Math.round(converted * 10) / 10
  return Math.round(rounded * 310)
}

const PREFIX_FOLDER = {
  SB: "Sultani Bakhtiari",
  SFZ: "Sultani Farhan Ziegler",
  SKG: "Sultani Kazak Gold",
  STD: "Sultani Tree Design",
  SG: "Sultani gabah",
}

// Number to SKU mapping based on folder
const NUM_TO_SKU = {}

async function main() {
  // Build mapping: for each folder, find which SKU prefix maps to which product numbers
  for (const [prefix, folder] of Object.entries(PREFIX_FOLDER)) {
    const folderPath = join(PRODUCTS_DIR, folder)
    try {
      const files = readdirSync(folderPath).filter(f => extname(f).toLowerCase() === ".webp")
      for (const file of files) {
        const parsed = parseRawFilename(file)
        if (parsed) {
          NUM_TO_SKU[parsed.productNumber] = prefix
        }
      }
    } catch {}
  }

  // Get all products
  const { data: products } = await supabase.from("products").select("id, sku, name")
  console.log(`Processing ${products.length} products...\n`)

  let updated = 0

  for (const product of products) {
    const prefix = product.sku.split("-")[0]
    const num = product.sku.split("-")[1]

    // Find matching raw folder files
    const folder = PREFIX_FOLDER[prefix]
    if (!folder) continue

    const folderPath = join(PRODUCTS_DIR, folder)
    let files
    try {
      files = readdirSync(folderPath).filter(f => {
        const ext = extname(f).toLowerCase()
        return ext === ".webp" && f.startsWith(num + "-")
      })
    } catch { continue }

    if (files.length === 0) continue

    // Get dimensions from the first matching file
    const parsed = parseRawFilename(files[0])
    if (!parsed) continue

    const sizeValue = calculateSize(parsed.width, parsed.height)

    const { error } = await supabase.from("products").update({
      size_value: sizeValue.toString(),
      width_cm: parsed.width,
      height_cm: parsed.height,
      price: sizeValue,
    }).eq("id", product.id)

    if (error) {
      console.error(`  ❌ ${product.sku}: ${error.message}`)
    } else {
      updated++
      console.log(`  ✅ ${product.sku}: ${parsed.width}×${parsed.height} → size=${sizeValue}, price=€${sizeValue}`)
    }
  }

  console.log(`\nDone! Updated ${updated} products with sizes and prices.`)
}

main().catch(console.error)
