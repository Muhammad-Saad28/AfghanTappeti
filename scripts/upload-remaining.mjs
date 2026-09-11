import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync } from "fs"
import { join, extname } from "path"
import { config } from "dotenv"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products"

function basename(filePath, ext) {
  const name = filePath.split(/[\\/]/).pop()
  if (ext && name.toLowerCase().endsWith(ext.toLowerCase())) return name.slice(0, -ext.length)
  return name
}

// Map SKU prefix to folder
const PREFIX_FOLDER = {
  SB: "Sultani Bakhtiari",
  SFZ: "Sultani Farhan Ziegler",
  SKG: "Sultani Kazak Gold",
  STD: "Sultani Tree Design",
  SG: "Sultani gabah",
  SKH: "4-Sultani Khurgeen",
  MLK: "2-Mamluk-48-cropped",
}

// Map SKU number to raw product number
function skuToNumber(sku) {
  return sku.split("-")[1] // e.g., "SB-010" → "010"
}

async function main() {
  // Get products without images
  const { data: products } = await supabase.from("products").select("id, sku, name")
  const { data: existingImages } = await supabase.from("product_images").select("product_id")
  const imageProductIds = new Set((existingImages ?? []).map(i => i.product_id))
  const needsImages = products?.filter(p => !imageProductIds.has(p.id)) ?? []

  console.log(`Uploading images for ${needsImages.length} products...\n`)

  let uploaded = 0

  for (const product of needsImages) {
    const prefix = product.sku.split("-")[0]
    const num = skuToNumber(product.sku)
    const folder = PREFIX_FOLDER[prefix]

    if (!folder) {
      console.log(`  ⚠️  ${product.sku}: unknown prefix ${prefix}`)
      continue
    }

    const folderPath = join(PRODUCTS_DIR, folder)
    // Find matching webp files: e.g., "10-298x82.webp", "10-298x82 (1).webp"
    const pattern = new RegExp(`^${parseInt(num)}-\\d+x\\d+`, "i")
    const files = readdirSync(folderPath).filter(f => {
      const ext = extname(f).toLowerCase()
      return ext === ".webp" && pattern.test(basename(f, ext))
    })

    if (files.length === 0) {
      console.log(`  ⚠️  ${product.sku}: no matching files in ${folder}`)
      continue
    }

    // Sort: no (N) first, then (1), (2), etc.
    files.sort((a, b) => {
      const na = basename(a, extname(a))
      const nb = basename(b, extname(b))
      const va = na.match(/\((\d+)\)/)?.[1] || "0"
      const vb = nb.match(/\((\d+)\)/)?.[1] || "0"
      return parseInt(va) - parseInt(vb)
    })

    console.log(`  📦 ${product.sku}: ${files.length} images`)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const storageName = `${product.sku}-${String(i + 1).padStart(2, "0")}.webp`
      const filePath = join(folderPath, file)
      const content = readFileSync(filePath)

      const { error } = await supabase.storage
        .from("product-images")
        .upload(storageName, content, { upsert: true, contentType: "image/webp" })

      if (error) {
        console.log(`    ❌ ${storageName}: ${error.message}`)
        continue
      }

      await supabase.from("product_images").insert({
        product_id: product.id,
        image_url: storageName,
        alt_text: product.name,
        display_order: i,
        is_primary: i === 0,
      })

      console.log(`    ✅ ${storageName}`)
      uploaded++
    }
  }

  console.log(`\nDone! Uploaded ${uploaded} images for ${needsImages.length} products.`)
}

main().catch(console.error)
