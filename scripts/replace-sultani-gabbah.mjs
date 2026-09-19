import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync, writeFileSync, existsSync } from "fs"
import { join, extname, basename as pathBasename } from "path"
import { config } from "dotenv"
import sharp from "sharp"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products\\7-Sultani Gabbah"
const BUCKET = "product-images"
const PREFIX = "SG"
const CATEGORY_NAME = "Sultani Gabbah"
const COLLECTION_NAME = "Sultani Collection"
const PROGRESS_FILE = join(import.meta.dirname, "sg-replace-progress.json")

function parseFilename(filename) {
  const ext = extname(filename)
  const name = pathBasename(filename, ext)
  const match = name.match(/^(\d+)-(\d+)x(\d+)(?:\s*\((\d+)\))?$/)
  if (!match) return null
  return {
    productNumber: match[1],
    width: parseInt(match[2]),
    height: parseInt(match[3]),
    variant: match[4] ? parseInt(match[4]) : 0,
  }
}

function getStorageName(sku, imageIndex) {
  return `${sku}-${String(imageIndex).padStart(2, "0")}.webp`
}

function calculatePrice(w, h) {
  return Math.round((w / 100) * (h / 100) * 100) / 100 * 310
}

function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, "utf-8"))
  }
  return { processed: [], stats: { replaced: 0, created: 0, imagesUploaded: 0, failures: [] } }
}

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2))
}

async function convertToWebp(jpgPath) {
  return sharp(jpgPath).webp({ quality: 85 }).toBuffer()
}

async function main() {
  console.log("=== SULTANI GABBAH IMAGE REPLACEMENT ===\n")

  const progress = loadProgress()
  const processedSet = new Set(progress.processed)
  console.log(`Previously processed: ${processedSet.size} products`)

  // Get all existing SG products
  const { data: products, error: fetchError } = await supabase
    .from("products")
    .select("id, name, sku, product_images (id, image_url, display_order, is_primary)")
    .is("deleted_at", null)
    .like("sku", "SG-%")

  if (fetchError) {
    console.error("Failed to fetch products:", fetchError)
    return
  }

  console.log(`Found ${products.length} existing SG products in database`)

  const productBySku = {}
  for (const p of products) {
    productBySku[p.sku] = p
  }

  // Read images from the folder
  const files = readdirSync(PRODUCTS_DIR).filter(f => {
    const ext = extname(f).toLowerCase()
    return ext === ".jpg" || ext === ".jpeg"
  })

  console.log(`Found ${files.length} images in folder`)

  // Group by product number
  const productMap = new Map()
  for (const file of files) {
    const parsed = parseFilename(file)
    if (!parsed) continue
    const key = parsed.productNumber
    if (!productMap.has(key)) {
      productMap.set(key, { number: key, width: parsed.width, height: parsed.height, images: [] })
    }
    productMap.get(key).images.push({ file, variant: parsed.variant })
  }

  // Sort images by variant
  for (const p of productMap.values()) {
    p.images.sort((a, b) => a.variant - b.variant)
  }

  console.log(`Found ${productMap.size} unique products to process\n`)

  let replacedCount = 0
  let createdCount = 0
  let imagesUploaded = 0
  let skippedCount = 0
  const failures = []

  for (const [num, product] of productMap) {
    const sku = `${PREFIX}-${num.padStart(3, "0")}`

    if (processedSet.has(sku)) {
      skippedCount++
      continue
    }

    const existingProduct = productBySku[sku]

    if (existingProduct) {
      // REPLACE images
      let success = true
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i]
        const storageName = getStorageName(sku, i + 1)
        const filePath = join(PRODUCTS_DIR, img.file)

        try {
          const webpBuffer = await convertToWebp(filePath)
          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(storageName, webpBuffer, { upsert: true, contentType: "image/webp" })

          if (error) {
            console.log(`  ❌ ${sku}: Upload failed - ${error.message}`)
            success = false
            failures.push({ sku, image: storageName, error: error.message })
            break
          }

          imagesUploaded++

          // Check if record exists in product_images
          const existingImg = existingProduct.product_images?.find(img => img.image_url === storageName)
          if (!existingImg) {
            await supabase.from("product_images").insert({
              product_id: existingProduct.id,
              image_url: storageName,
              alt_text: existingProduct.name,
              display_order: i,
              is_primary: i === 0,
            })
          } else if (existingImg.display_order !== i || existingImg.is_primary !== (i === 0)) {
            await supabase.from("product_images")
              .update({ display_order: i, is_primary: i === 0 })
              .eq("id", existingImg.id)
          }
        } catch (err) {
          console.log(`  ❌ ${sku}: ${err.message}`)
          success = false
          failures.push({ sku, image: img.file, error: err.message })
          break
        }
      }

      if (success) {
        replacedCount++
        console.log(`  ✅ ${sku}: Replaced ${product.images.length} images`)
      }
    } else {
      // CREATE new product
      const productId = crypto.randomUUID()
      const price = calculatePrice(product.width, product.height)
      const slug = `sultani-gabbah-${num}`

      const { error: prodError } = await supabase.from("products").insert({
        id: productId,
        name: `Sultani Gabbah Rug ${num}`,
        slug,
        sku,
        price,
        description: `Hand-knotted Sultani Gabbah rug.\nSize: ${product.width}×${product.height} cm.`,
        stock_quantity: 1,
        is_active: true,
      })

      if (prodError) {
        console.log(`  ❌ ${sku}: Create failed - ${prodError.message}`)
        failures.push({ sku, error: prodError.message })
        processedSet.add(sku)
        progress.processed.push(sku)
        saveProgress(progress)
        continue
      }

      // Get or create category and collection
      const { data: cat } = await supabase.from("categories").select("id").eq("name", CATEGORY_NAME).single()
      if (cat) {
        await supabase.from("product_categories").insert({ product_id: productId, category_id: cat.id })
      }

      const { data: coll } = await supabase.from("collections").select("id").eq("name", COLLECTION_NAME).single()
      if (coll) {
        await supabase.from("product_collections").insert({ product_id: productId, collection_id: coll.id })
      }

      let success = true
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i]
        const storageName = getStorageName(sku, i + 1)
        const filePath = join(PRODUCTS_DIR, img.file)

        try {
          const webpBuffer = await convertToWebp(filePath)
          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(storageName, webpBuffer, { upsert: true, contentType: "image/webp" })

          if (error) {
            console.log(`  ❌ ${sku}: Upload failed - ${error.message}`)
            success = false
            failures.push({ sku, image: storageName, error: error.message })
            break
          }

          await supabase.from("product_images").insert({
            product_id: productId,
            image_url: storageName,
            alt_text: `Sultani Gabbah Rug ${num}`,
            display_order: i,
            is_primary: i === 0,
          })
          imagesUploaded++
        } catch (err) {
          console.log(`  ❌ ${sku}: ${err.message}`)
          success = false
          failures.push({ sku, image: img.file, error: err.message })
          break
        }
      }

      if (success) {
        createdCount++
        console.log(`  🆕 ${sku}: Created with ${product.images.length} images`)
      }
    }

    processedSet.add(sku)
    progress.processed.push(sku)
    saveProgress(progress)
  }

  // Clean up old images that don't match new naming
  console.log("\n🧹 Cleaning up old images...")
  for (const [num, product] of productMap) {
    const sku = `${PREFIX}-${num.padStart(3, "0")}`
    const existingProduct = productBySku[sku]
    if (existingProduct && existingProduct.product_images) {
      const validStorageNames = product.images.map((_, i) => getStorageName(sku, i + 1))
      const oldImages = existingProduct.product_images.filter(
        img => !validStorageNames.includes(img.image_url)
      )
      for (const oldImg of oldImages) {
        console.log(`  🗑️ ${sku}: Removing old image ${oldImg.image_url}`)
        await supabase.from("product_images").delete().eq("id", oldImg.id)
        await supabase.storage.from(BUCKET).remove([oldImg.image_url])
      }
    }
  }

  // Report
  console.log("\n\n=== FINAL REPORT ===")
  console.log(`Products replaced: ${replacedCount}`)
  console.log(`Products created: ${createdCount}`)
  console.log(`Products skipped (already processed): ${skippedCount}`)
  console.log(`Total images uploaded: ${imagesUploaded}`)

  if (failures.length > 0) {
    console.log(`\n❌ Failures (${failures.length}):`)
    for (const f of failures) {
      console.log(`  - ${f.sku || f.file}: ${f.error}`)
    }
  }

  console.log("\nDone!")
}

main().catch(console.error)
