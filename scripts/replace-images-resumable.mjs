import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync, statSync, existsSync } from "fs"
import { join, extname, basename as pathBasename } from "path"
import { config } from "dotenv"
import sharp from "sharp"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products"
const BUCKET = "product-images"
const PROGRESS_FILE = join(import.meta.dirname, "replace-progress.json")

const FOLDER_TO_PREFIX = {
  "1-Ghazni Kazak Gold-cropped": "SKG",
  "2-Mamluk-48-cropped": "MLK",
  "3-Sultani Bakhtiari-cropped": "SB",
  "4-Sultani Khurgeen": "SKH",
  "5-Sultani Tree Design": "STD",
  "6-Sultani Farhan Ziegler": "SFZ",
  "7-Sultani Gabbah": "SG",
}

const FOLDER_TO_CATEGORY = {
  "1-Ghazni Kazak Gold-cropped": "Sultani Kazak Gold",
  "2-Mamluk-48-cropped": "Mamluk",
  "3-Sultani Bakhtiari-cropped": "Sultani Bakhtiari",
  "4-Sultani Khurgeen": "Sultani Khurgeen",
  "5-Sultani Tree Design": "Sultani Tree Design",
  "6-Sultani Farhan Ziegler": "Sultani Farhan Ziegler",
  "7-Sultani Gabbah": "Sultani Gabbah",
}

function calculatePrice(w, h) {
  return Math.round((w / 100) * (h / 100) * 100) / 100 * 310
}

function parseNewFilename(filename) {
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

function loadProgress() {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, "utf-8"))
  }
  return { processed: [], stats: { replaced: 0, created: 0, imagesUploaded: 0, dbRowsChanged: 0, failures: [] } }
}

import { writeFileSync } from "fs"

function saveProgress(progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2))
}

async function convertToWebp(jpgPath) {
  return sharp(jpgPath).webp({ quality: 85 }).toBuffer()
}

async function getOrCreateCategory(name) {
  const { data } = await supabase.from("categories").select("id").eq("name", name).single()
  if (data) return data.id
  const id = crypto.randomUUID()
  const slug = name.toLowerCase().replace(/\s+/g, "-")
  await supabase.from("categories").insert({ id, name, slug, display_order: 999, is_active: true })
  return id
}

async function getOrCreateCollection(name) {
  const { data } = await supabase.from("collections").select("id").eq("name", name).single()
  if (data) return data.id
  const id = crypto.randomUUID()
  const slug = name.toLowerCase().replace(/\s+/g, "-")
  await supabase.from("collections").insert({ id, name, slug, is_active: true })
  return id
}

async function main() {
  console.log("=== IMAGE REPLACEMENT (RESUMABLE) ===\n")

  // Load progress
  const progress = loadProgress()
  const processedSet = new Set(progress.processed)
  console.log(`Previously processed: ${processedSet.size} products`)

  // Get all existing products
  const { data: products } = await supabase
    .from("products")
    .select("id, name, sku, product_images (id, image_url, display_order, is_primary)")
    .is("deleted_at", null)

  const productBySku = {}
  for (const p of products) {
    productBySku[p.sku] = p
  }

  // Process folders
  const folders = readdirSync(PRODUCTS_DIR).filter(f => {
    const path = join(PRODUCTS_DIR, f)
    return statSync(path).isDirectory() && FOLDER_TO_PREFIX[f]
  })

  for (const folder of folders) {
    const folderPath = join(PRODUCTS_DIR, folder)
    const prefix = FOLDER_TO_PREFIX[folder]
    const categoryName = FOLDER_TO_CATEGORY[folder]

    console.log(`\n📁 ${folder}`)

    const files = readdirSync(folderPath).filter(f => {
      const ext = extname(f).toLowerCase()
      return ext === ".jpg" || ext === ".jpeg"
    })

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
      p.images.sort((a, b) => a.variant - b.variant)
    }

    const categoryId = await getOrCreateCategory(categoryName)
    const collectionId = await getOrCreateCollection("Sultani Collection")

    for (const [num, product] of productMap) {
      const sku = `${prefix}-${num.padStart(3, "0")}`

      if (processedSet.has(sku)) {
        continue // Skip already processed
      }

      const existingProduct = productBySku[sku]

      if (existingProduct) {
        // REPLACE images
        let success = true
        for (let i = 0; i < product.images.length; i++) {
          const img = product.images[i]
          const storageName = getStorageName(sku, i + 1)
          const filePath = join(folderPath, img.file)

          try {
            const webpBuffer = await convertToWebp(filePath)
            const { error } = await supabase.storage
              .from(BUCKET)
              .upload(storageName, webpBuffer, { upsert: true, contentType: "image/webp" })

            if (error) {
              console.log(`  ❌ ${sku}: Upload failed - ${error.message}`)
              success = false
              progress.stats.failures.push({ sku, image: storageName, error: error.message })
              break
            }

            progress.stats.imagesUploaded++

            // Check if record exists
            const existingImg = existingProduct.product_images?.find(img => img.image_url === storageName)
            if (!existingImg) {
              await supabase.from("product_images").insert({
                product_id: existingProduct.id,
                image_url: storageName,
                alt_text: existingProduct.name,
                display_order: i,
                is_primary: i === 0,
              })
              progress.stats.dbRowsChanged++
            } else if (existingImg.display_order !== i || existingImg.is_primary !== (i === 0)) {
              await supabase.from("product_images")
                .update({ display_order: i, is_primary: i === 0 })
                .eq("id", existingImg.id)
              progress.stats.dbRowsChanged++
            }
          } catch (err) {
            console.log(`  ❌ ${sku}: ${err.message}`)
            success = false
            progress.stats.failures.push({ sku, image: img.file, error: err.message })
            break
          }
        }

        if (success) {
          progress.stats.replaced++
          console.log(`  ✅ ${sku}: Replaced ${product.images.length} images`)
        }
      } else {
        // CREATE new product
        const productId = crypto.randomUUID()
        const price = calculatePrice(product.width, product.height)
        const slug = `${categoryName.toLowerCase().replace(/\s+/g, "-")}-${num}`

        const { error: prodError } = await supabase.from("products").insert({
          id: productId,
          name: `${categoryName} Rug ${num}`,
          slug,
          sku,
          price,
          description: `Hand-knotted ${categoryName} rug. Size: ${product.width}×${product.height} cm.`,
          stock_quantity: 1,
          is_active: true,
        })

        if (prodError) {
          console.log(`  ❌ ${sku}: Create failed - ${prodError.message}`)
          progress.stats.failures.push({ sku, error: prodError.message })
          processedSet.add(sku)
          progress.processed.push(sku)
          saveProgress(progress)
          continue
        }

        await supabase.from("product_categories").insert({ product_id: productId, category_id: categoryId })
        await supabase.from("product_collections").insert({ product_id: productId, collection_id: collectionId })

        let success = true
        for (let i = 0; i < product.images.length; i++) {
          const img = product.images[i]
          const storageName = getStorageName(sku, i + 1)
          const filePath = join(folderPath, img.file)

          try {
            const webpBuffer = await convertToWebp(filePath)
            const { error } = await supabase.storage
              .from(BUCKET)
              .upload(storageName, webpBuffer, { upsert: true, contentType: "image/webp" })

            if (error) {
              console.log(`  ❌ ${sku}: Upload failed - ${error.message}`)
              success = false
              progress.stats.failures.push({ sku, image: storageName, error: error.message })
              break
            }

            await supabase.from("product_images").insert({
              product_id: productId,
              image_url: storageName,
              alt_text: `${categoryName} Rug ${num}`,
              display_order: i,
              is_primary: i === 0,
            })
            progress.stats.imagesUploaded++
            progress.stats.dbRowsChanged++
          } catch (err) {
            console.log(`  ❌ ${sku}: ${err.message}`)
            success = false
            progress.stats.failures.push({ sku, image: img.file, error: err.message })
            break
          }
        }

        if (success) {
          progress.stats.created++
          console.log(`  🆕 ${sku}: Created with ${product.images.length} images`)
        }
      }

      processedSet.add(sku)
      progress.processed.push(sku)
      saveProgress(progress)
    }
  }

  // Final report
  console.log("\n\n=== FINAL REPORT ===")
  console.log(`Products with images replaced: ${progress.stats.replaced}`)
  console.log(`New products created: ${progress.stats.created}`)
  console.log(`Total images uploaded: ${progress.stats.imagesUploaded}`)
  console.log(`Database rows changed: ${progress.stats.dbRowsChanged}`)

  if (progress.stats.failures.length > 0) {
    console.log(`\n❌ Failures (${progress.stats.failures.length}):`)
    for (const f of progress.stats.failures) {
      console.log(`  - ${f.sku || f.file}: ${f.error}`)
    }
  }

  console.log("\nDone!")
}

main().catch(console.error)
