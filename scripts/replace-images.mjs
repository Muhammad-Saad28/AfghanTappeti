import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync, statSync } from "fs"
import { join, extname, basename as pathBasename } from "path"
import { config } from "dotenv"
import sharp from "sharp"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products"
const BUCKET = "product-images"

// Folder to SKU prefix mapping
const FOLDER_TO_PREFIX = {
  "1-Ghazni Kazak Gold-cropped": "SKG",
  "2-Mamluk-48-cropped": "MLK",
  "3-Sultani Bakhtiari-cropped": "SB",
  "4-Sultani Khurgeen": "SKH",
  "5-Sultani Tree Design": "STD",
  "6-Sultani Farhan Ziegler": "SFZ",
}

// Category names for new products
const FOLDER_TO_CATEGORY = {
  "1-Ghazni Kazak Gold-cropped": "Sultani Kazak Gold",
  "2-Mamluk-48-cropped": "Mamluk",
  "3-Sultani Bakhtiari-cropped": "Sultani Bakhtiari",
  "4-Sultani Khurgeen": "Sultani Khurgeen",
  "5-Sultani Tree Design": "Sultani Tree Design",
  "6-Sultani Farhan Ziegler": "Sultani Farhan Ziegler",
}

// Price formula: ROUND((width_cm / 100) * (length_cm / 100), 2) * 310
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

function sortImagesByVariant(images) {
  return images.sort((a, b) => a.variant - b.variant)
}

function getStorageName(sku, imageIndex) {
  return `${sku}-${String(imageIndex).padStart(2, "0")}.webp`
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
  console.log(`  Created category: ${name}`)
  return id
}

async function getOrCreateCollection(name) {
  const { data } = await supabase.from("collections").select("id").eq("name", name).single()
  if (data) return data.id
  const id = crypto.randomUUID()
  const slug = name.toLowerCase().replace(/\s+/g, "-")
  await supabase.from("collections").insert({ id, name, slug, is_active: true })
  console.log(`  Created collection: ${name}`)
  return id
}

async function uploadToStorage(storageName, content) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storageName, content, { upsert: true, contentType: "image/webp" })
  if (error) {
    console.log(`    ❌ Upload failed: ${storageName}: ${error.message}`)
    return false
  }
  return true
}

async function main() {
  console.log("=== IMAGE REPLACEMENT SCRIPT ===")
  console.log("Starting image replacement...\n")

  // 1. Get all existing products with images
  const { data: products } = await supabase
    .from("products")
    .select("id, name, sku, product_images (id, image_url, display_order, is_primary)")
    .is("deleted_at", null)

  const productBySku = {}
  for (const p of products) {
    productBySku[p.sku] = p
  }

  // 2. Process each folder
  const folders = readdirSync(PRODUCTS_DIR).filter(f => {
    const path = join(PRODUCTS_DIR, f)
    return statSync(path).isDirectory() && FOLDER_TO_PREFIX[f]
  })

  let totalReplaced = 0
  let totalCreated = 0
  let totalImagesUploaded = 0
  let totalDbRowsChanged = 0
  let totalStorageOverwritten = 0
  const failures = []
  const unmappedFiles = []

  for (const folder of folders) {
    const folderPath = join(PRODUCTS_DIR, folder)
    const prefix = FOLDER_TO_PREFIX[folder]
    const categoryName = FOLDER_TO_CATEGORY[folder]

    console.log(`\n📁 Processing: ${folder} (prefix: ${prefix})`)

    // Read all JPG files
    const files = readdirSync(folderPath).filter(f => {
      const ext = extname(f).toLowerCase()
      return ext === ".jpg" || ext === ".jpeg"
    })

    // Group by product number
    const productMap = new Map()
    for (const file of files) {
      const parsed = parseNewFilename(file)
      if (!parsed) {
        unmappedFiles.push({ file, folder })
        continue
      }
      const key = parsed.productNumber
      if (!productMap.has(key)) {
        productMap.set(key, { number: key, width: parsed.width, height: parsed.height, images: [] })
      }
      productMap.get(key).images.push({ file, variant: parsed.variant })
    }

    for (const p of productMap.values()) {
      sortImagesByVariant(p.images)
    }

    // Get or create category and collection
    const categoryId = await getOrCreateCategory(categoryName)
    const collectionId = await getOrCreateCollection("Sultani Collection")

    for (const [num, product] of productMap) {
      const sku = `${prefix}-${num.padStart(3, "0")}`
      const existingProduct = productBySku[sku]

      if (existingProduct) {
        // === MATCHED PRODUCT: Replace images ===
        console.log(`  ✅ ${sku}: Replacing images (${product.images.length} images)`)

        for (let i = 0; i < product.images.length; i++) {
          const img = product.images[i]
          const storageName = getStorageName(sku, i + 1)
          const filePath = join(folderPath, img.file)

          try {
            const webpBuffer = await convertToWebp(filePath)
            const uploaded = await uploadToStorage(storageName, webpBuffer)

            if (uploaded) {
              totalImagesUploaded++
              totalStorageOverwritten++

              // Check if product_images record exists for this storage name
              const existingImg = existingProduct.product_images?.find(
                img => img.image_url === storageName
              )

              if (!existingImg) {
                // Need to create product_images record
                const { error } = await supabase.from("product_images").insert({
                  product_id: existingProduct.id,
                  image_url: storageName,
                  alt_text: existingProduct.name,
                  display_order: i,
                  is_primary: i === 0,
                })
                if (error) {
                  console.log(`    ❌ DB insert failed: ${error.message}`)
                  failures.push({ sku, image: storageName, error: error.message })
                } else {
                  totalDbRowsChanged++
                }
              } else {
                // Update display_order and is_primary if needed
                if (existingImg.display_order !== i || existingImg.is_primary !== (i === 0)) {
                  const { error } = await supabase
                    .from("product_images")
                    .update({ display_order: i, is_primary: i === 0 })
                    .eq("id", existingImg.id)
                  if (error) {
                    console.log(`    ❌ DB update failed: ${error.message}`)
                    failures.push({ sku, image: storageName, error: error.message })
                  } else {
                    totalDbRowsChanged++
                  }
                }
              }
            }
          } catch (err) {
            console.log(`    ❌ Conversion failed: ${err.message}`)
            failures.push({ sku, image: img.file, error: err.message })
          }
        }

        // Delete excess images if product has more images in DB than in archive
        if (existingProduct.product_images && existingProduct.product_images.length > product.images.length) {
          const excessImages = existingProduct.product_images
            .filter(img => {
              const imgIndex = parseInt(img.image_url.match(/-(\d+)\.webp$/)?.[1] || "0")
              return imgIndex > product.images.length
            })

          for (const excessImg of excessImages) {
            // Delete from storage
            await supabase.storage.from(BUCKET).remove([excessImg.image_url])
            // Delete from DB
            await supabase.from("product_images").delete().eq("id", excessImg.id)
            totalDbRowsChanged++
            console.log(`    🗑️ Removed excess image: ${excessImg.image_url}`)
          }
        }

        totalReplaced++
      } else {
        // === UNMATCHED PRODUCT: Create new product ===
        console.log(`  🆕 ${sku}: Creating new product (${product.images.length} images)`)

        const productId = crypto.randomUUID()
        const price = calculatePrice(product.width, product.height)
        const slug = `${categoryName.toLowerCase().replace(/\s+/g, "-")}-${num}`

        const { error: prodError } = await supabase.from("products").insert({
          id: productId,
          name: `${categoryName} Rug ${num}`,
          slug,
          sku,
          price,
          description: `Hand-knotted ${categoryName} rug.\nSize: ${product.width}×${product.height} cm.`,
          stock_quantity: 1,
          is_active: true,
        })

        if (prodError) {
          console.log(`    ❌ Product create failed: ${prodError.message}`)
          failures.push({ sku, error: prodError.message })
          continue
        }

        // Assign category
        await supabase.from("product_categories").insert({
          product_id: productId,
          category_id: categoryId,
        })

        // Assign collection
        await supabase.from("product_collections").insert({
          product_id: productId,
          collection_id: collectionId,
        })

        // Upload images
        for (let i = 0; i < product.images.length; i++) {
          const img = product.images[i]
          const storageName = getStorageName(sku, i + 1)
          const filePath = join(folderPath, img.file)

          try {
            const webpBuffer = await convertToWebp(filePath)
            const uploaded = await uploadToStorage(storageName, webpBuffer)

            if (uploaded) {
              await supabase.from("product_images").insert({
                product_id: productId,
                image_url: storageName,
                alt_text: `${categoryName} Rug ${num}`,
                display_order: i,
                is_primary: i === 0,
              })
              totalImagesUploaded++
              totalDbRowsChanged++
            }
          } catch (err) {
            console.log(`    ❌ Image upload failed: ${err.message}`)
            failures.push({ sku, image: img.file, error: err.message })
          }
        }

        totalCreated++
      }
    }
  }

  // 3. Final report
  console.log("\n\n=== FINAL REPORT ===")
  console.log(`Products with images replaced: ${totalReplaced}`)
  console.log(`New products created: ${totalCreated}`)
  console.log(`Total images uploaded: ${totalImagesUploaded}`)
  console.log(`Storage objects overwritten: ${totalStorageOverwritten}`)
  console.log(`Database rows changed: ${totalDbRowsChanged}`)

  if (failures.length > 0) {
    console.log(`\n❌ Failures (${failures.length}):`)
    for (const f of failures) {
      console.log(`  - ${f.sku || f.file}: ${f.error}`)
    }
  }

  if (unmappedFiles.length > 0) {
    console.log(`\n⚠️ Unmapped files (${unmappedFiles.length}):`)
    for (const f of unmappedFiles) {
      console.log(`  - ${f.file} (in ${f.folder})`)
    }
  }

  console.log("\nDone!")
}

main().catch(console.error)
