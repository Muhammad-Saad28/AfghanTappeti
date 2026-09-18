import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync, statSync } from "fs"
import { join, extname, basename } from "path"
import { config } from "dotenv"

config({ path: join(import.meta.dirname, "..", ".env.local") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products"

// Size calculation: ROUND((width × height) / 1000, 1) × 310
function calculateSize(width, height) {
  const area = width * height
  const converted = area / 1000
  const rounded = Math.round(converted * 10) / 10
  return Math.round(rounded * 310)
}

// Parse filename like "10-298x82.JPG" or "10-298x82 (1).JPG"
function parseFilename(filename) {
  const ext = extname(filename).toLowerCase()
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") return null

  const name = basename(filename, ext)
  // Match: number-dimensions with optional variant (1), (2), etc.
  const match = name.match(/^(\d+)-(\d+)x(\d+)(?:\s*\((\d+)\))?$/)
  if (!match) return null

  return {
    productNumber: match[1],
    width: parseInt(match[2]),
    height: parseInt(match[3]),
    variant: match[4] ? parseInt(match[4]) : 0, // 0 = main image
    ext,
  }
}

// Category name mapping (folder name → Supabase category name)
const CATEGORY_MAP = {
  "Sultani Bakhtiari": "Sultani Bakhtiari",
  "Sultani Farhan Ziegler": "Sultani Farhan Ziegler",
  "Sultani gabah": "Sultani Gabbah",
  "Sultani Kazak Gold": "Sultani Kazak Gold",
  "Sultani Tree Design": "Sultani Tree Design",
}

async function findOrCreateCategory(name) {
  // Check if category exists
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("name", name)
    .single()

  if (existing) return existing.id

  // Create new category
  const id = crypto.randomUUID()
  const { error } = await supabase.from("categories").insert({
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    display_order: 999,
    is_active: true,
  })
  if (error) {
    console.error(`  Failed to create category "${name}":`, error.message)
    return null
  }
  console.log(`  Created category: ${name}`)
  return id
}

async function findOrCreateCollection(name) {
  const { data: existing } = await supabase
    .from("collections")
    .select("id")
    .eq("name", name)
    .single()

  if (existing) return existing.id

  const id = crypto.randomUUID()
  const { error } = await supabase.from("collections").insert({
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    is_active: true,
  })
  if (error) {
    console.error(`  Failed to create collection "${name}":`, error.message)
    return null
  }
  console.log(`  Created collection: ${name}`)
  return id
}

async function uploadImage(filePath, storageName) {
  const content = readFileSync(filePath)
  const ext = extname(filePath).toLowerCase()
  const contentType = ext === ".webp" ? "image/webp" : ext === ".png" ? "image/png" : "image/jpeg"

  const { error } = await supabase.storage
    .from("product-images")
    .upload(storageName, content, {
      upsert: true,
      contentType,
    })

  if (error) {
    console.error(`    Upload failed ${storageName}:`, error.message)
    return false
  }
  return true
}

async function main() {
  console.log("=== Product Importer ===\n")

  const folders = readdirSync(PRODUCTS_DIR).filter(f => {
    const path = join(PRODUCTS_DIR, f)
    return statSync(path).isDirectory() && f !== "Uploaded"
  })

  // First, get or create default category and collection
  const defaultCategoryId = await findOrCreateCategory("Afghan Rugs")
  const defaultCollectionId = await findOrCreateCollection("Sultani Collection")

  // Get existing product SKUs to avoid duplicates
  const { data: existingProducts } = await supabase.from("products").select("sku")
  const existingSkus = new Set((existingProducts ?? []).map(p => p.sku))

  let totalProducts = 0
  let totalImages = 0
  let skipped = 0

  for (const folder of folders) {
    const folderPath = join(PRODUCTS_DIR, folder)
    const files = readdirSync(folderPath).filter(f => !f.startsWith("."))

    console.log(`\n📁 ${folder} (${files.length} files)`)

    // Parse all files and group by product number
    const productMap = new Map()

    for (const file of files) {
      const parsed = parseFilename(file)
      if (!parsed) {
        console.log(`  ⚠️  Skipping unrecognized file: ${file}`)
        continue
      }

      const key = parsed.productNumber
      if (!productMap.has(key)) {
        productMap.set(key, {
          number: key,
          width: parsed.width,
          height: parsed.height,
          images: [],
        })
      }
      productMap.get(key).images.push({
        file,
        variant: parsed.variant,
        ext: parsed.ext,
      })
    }

    // Sort images: main (variant 0) first, then (1), (2), etc.
    for (const product of productMap.values()) {
      product.images.sort((a, b) => a.variant - b.variant)
    }

    // Process each product
    for (const [productNumber, product] of productMap) {
      const sku = `AK-${productNumber.padStart(3, "0")}`

      // Skip if already exists
      if (existingSkus.has(sku)) {
        console.log(`  ⏭️  ${sku} already exists, skipping`)
        skipped++
        continue
      }

      const size = calculateSize(product.width, product.height)
      const productId = crypto.randomUUID()

      console.log(`\n  🏷️  ${sku}: ${product.width}×${product.height} → ${size}`)
      console.log(`     Images: ${product.images.map(i => i.file).join(", ")}`)

      // Create product
      const { error: prodErr } = await supabase.from("products").insert({
        id: productId,
        name: `${folder} Rug ${productNumber}`,
        slug: `${folder.toLowerCase().replace(/\s+/g, "-")}-${productNumber}`,
        sku,
        price: 1500,
        size_value: size.toString(),
        width_cm: product.width,
        height_cm: product.height,
        short_description: `Hand-knotted ${folder} rug`,
        description: `A masterfully hand-knotted ${folder} rug featuring intricate patterns and rich natural dyes.\nSize: ${product.width}×${product.height} cm (${size}).`,
        stock_quantity: 1,
        is_active: true,
        is_best_seller: false,
      })

      if (prodErr) {
        console.error(`     ❌ Failed to create product:`, prodErr.message)
        continue
      }

      // Link to category
      const catId = await findOrCreateCategory(CATEGORY_MAP[folder] || folder)
      if (catId) {
        await supabase.from("product_categories").insert({
          product_id: productId,
          category_id: catId,
        })
      }

      // Link to collection
      if (defaultCollectionId) {
        await supabase.from("product_collections").insert({
          product_id: productId,
          collection_id: defaultCollectionId,
        })
      }

      // Upload images
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i]
        const storageName = `${sku}-${String(i + 1).padStart(2, "0")}${img.ext}`
        const filePath = join(folderPath, img.file)

        const uploaded = await uploadImage(filePath, storageName)
        if (!uploaded) continue

        await supabase.from("product_images").insert({
          product_id: productId,
          image_url: storageName,
          alt_text: `${folder} Rug ${productNumber}`,
          display_order: i,
          is_primary: i === 0,
        })

        totalImages++
        console.log(`     📷 ${storageName}`)
      }

      totalProducts++
      existingSkus.add(sku) // Prevent duplicates within this run
    }
  }

  console.log(`\n=== Done ===`)
  console.log(`Products created: ${totalProducts}`)
  console.log(`Images uploaded: ${totalImages}`)
  console.log(`Products skipped (already exist): ${skipped}`)
}

main().catch(console.error)
