import { createClient } from "@supabase/supabase-js"
import { readdirSync, statSync } from "fs"
import { join, extname, basename as pathBasename } from "path"
import { config } from "dotenv"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products"

// Folder to SKU prefix mapping (from import scripts)
const FOLDER_TO_PREFIX = {
  "1-Ghazni Kazak Gold-cropped": "SKG",
  "2-Mamluk-48-cropped": "MLK",
  "3-Sultani Bakhtiari-cropped": "SB",
  "4-Sultani Khurgeen": "SKH",
  "5-Sultani Tree Design": "STD",
  "6-Sultani Farhan Ziegler": "SFZ",
}

function basename(fp) {
  return fp.split(/[\\/]/).pop()
}

function parseNewFilename(filename) {
  const ext = extname(filename)
  const name = pathBasename(filename, ext)
  // Match: number-WxH with optional (N) variant
  const match = name.match(/^(\d+)-(\d+)x(\d+)(?:\s*\((\d+)\))?$/)
  if (!match) return null
  return {
    productNumber: match[1],
    width: parseInt(match[2]),
    height: parseInt(match[3]),
    variant: match[4] ? parseInt(match[4]) : 0,
  }
}

function sortImagesByVariant(images) {
  return images.sort((a, b) => a.variant - b.variant)
}

function getStoragePath(sku, imageIndex) {
  return `${sku}-${String(imageIndex).padStart(2, "0")}.webp`
}

async function main() {
  console.log("=== DATABASE PRODUCT QUERY ===\n")

  // 1. Get all products with their images and categories
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select(`
      id, name, sku,
      product_images (id, image_url, display_order, is_primary),
      product_categories (categories (name))
    `)
    .is("deleted_at", null)
    .order("sku")

  if (prodError) {
    console.error("Error fetching products:", prodError.message)
    return
  }

  console.log(`Total products in database: ${products.length}\n`)

  // 2. Print product summary by SKU prefix
  const byPrefix = {}
  for (const p of products) {
    const prefix = p.sku.split("-")[0]
    if (!byPrefix[prefix]) byPrefix[prefix] = []
    byPrefix[prefix].push(p)
  }

  for (const [prefix, prods] of Object.entries(byPrefix)) {
    console.log(`\n--- SKU Prefix: ${prefix} (${prods.length} products) ---`)
    for (const p of prods.slice(0, 5)) {
      const cats = p.product_categories?.map(pc => pc.categories?.name).join(", ") || "none"
      const imgCount = p.product_images?.length || 0
      const imgUrls = p.product_images?.map(img => img.image_url).join(", ") || "none"
      console.log(`  ${p.sku} | ID: ${p.id.slice(0, 8)}... | imgs: ${imgCount} | cats: ${cats}`)
      console.log(`    image_urls: ${imgUrls}`)
    }
    if (prods.length > 5) console.log(`  ... and ${prods.length - 5} more`)
  }

  // 3. List new image folders
  console.log("\n\n=== NEW IMAGE ARCHIVE ===\n")

  const folders = readdirSync(PRODUCTS_DIR).filter(f => {
    const path = join(PRODUCTS_DIR, f)
    return statSync(path).isDirectory() && FOLDER_TO_PREFIX[f]
  })

  for (const folder of folders) {
    const folderPath = join(PRODUCTS_DIR, folder)
    const files = readdirSync(folderPath).filter(f => {
      const ext = extname(f).toLowerCase()
      return ext === ".jpg" || ext === ".jpeg" || ext === ".webp"
    })

    // Group by product number
    const productMap = new Map()
    for (const file of files) {
      const parsed = parseNewFilename(file)
      if (!parsed) continue
      const key = parsed.productNumber
      if (!productMap.has(key)) {
        productMap.set(key, { number: key, width: parsed.width, height: parsed.height, images: [] })
      }
      productMap.get(key).images.push({ file, variant: parsed.variant })
    }

    for (const p of productMap.values()) {
      sortImagesByVariant(p.images)
    }

    const prefix = FOLDER_TO_PREFIX[folder]
    console.log(`\n📁 ${folder} (SKU prefix: ${prefix})`)
    console.log(`   Products: ${productMap.size}, Files: ${files.length}`)

    // 4. Try to match each new image product to a DB product
    for (const [num, product] of productMap) {
      const expectedSku = `${prefix}-${num.padStart(3, "0")}`
      const dbProduct = products.find(p => p.sku === expectedSku)

      if (dbProduct) {
        const existingImages = dbProduct.product_images || []
        console.log(`  ✅ ${num} → ${expectedSku} (DB ID: ${dbProduct.id.slice(0, 8)}...) | ${existingImages.length} existing images`)
        for (const img of existingImages) {
          console.log(`     DB: ${img.image_url} (order: ${img.display_order}, primary: ${img.is_primary})`)
        }
        for (const img of product.images) {
          const role = img.variant === 0 ? "PRIMARY" : `support #${img.variant + 1}`
          console.log(`     NEW: ${img.file} → ${getStoragePath(expectedSku, product.images.indexOf(img) + 1)} [${role}]`)
        }
      } else {
        console.log(`  ❌ ${num} → ${expectedSku} NOT FOUND IN DATABASE`)
      }
    }
  }

  // 5. Check for products in DB that have NO matching new images
  console.log("\n\n=== PRODUCTS WITHOUT MATCHING NEW IMAGES ===\n")
  for (const [prefix, prods] of Object.entries(byPrefix)) {
    const folder = Object.entries(FOLDER_TO_PREFIX).find(([, v]) => v === prefix)?.[0]
    if (!folder) continue

    const folderPath = join(PRODUCTS_DIR, folder)
    const files = readdirSync(folderPath).filter(f => {
      const ext = extname(f).toLowerCase()
      return ext === ".jpg" || ext === ".jpeg" || ext === ".webp"
    })

    const newNumbers = new Set()
    for (const file of files) {
      const parsed = parseNewFilename(file)
      if (parsed) newNumbers.add(parsed.productNumber)
    }

    for (const p of prods) {
      const num = p.sku.split("-")[1]
      const paddedNum = num // Already padded in SKU
      // Check if any new image has this number (padded or unpadded)
      const hasMatch = newNumbers.has(num) || newNumbers.has(parseInt(num).toString())
      if (!hasMatch) {
        console.log(`  ⚠️  ${p.sku} (${p.name}) - no matching new images in ${folder}`)
      }
    }
  }
}

main().catch(console.error)
