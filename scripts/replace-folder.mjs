import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync, statSync } from "fs"
import { join, extname, basename as pathBasename } from "path"
import { config } from "dotenv"
import sharp from "sharp"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const BUCKET = "product-images"
const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products"

const FOLDER_CONFIG = {
  "3-Sultani Bakhtiari-cropped": { prefix: "SB", category: "Sultani Bakhtiari" },
  "6-Sultani Farhan Ziegler": { prefix: "SFZ", category: "Sultani Farhan Ziegler" },
}

const folderArg = process.argv[2]
if (!folderArg || !FOLDER_CONFIG[folderArg]) {
  console.error(`Usage: node replace-folder.mjs <folder>`)
  console.error(`Available: ${Object.keys(FOLDER_CONFIG).join(", ")}`)
  process.exit(1)
}

const FOLDER = folderArg
const { prefix: PREFIX, category: CATEGORY } = FOLDER_CONFIG[FOLDER]
const FOLDER_PATH = join(PRODUCTS_DIR, FOLDER)

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

function calculatePrice(w, h) {
  return Math.round((w / 100) * (h / 100) * 100) / 100 * 310
}

async function main() {
  console.log(`=== Convert & Replace: ${FOLDER} (${PREFIX}) ===\n`)

  const { data: products } = await supabase
    .from("products")
    .select("id, name, sku, product_images (id, image_url, display_order, is_primary)")
    .is("deleted_at", null)

  const productBySku = {}
  for (const p of products) {
    productBySku[p.sku] = p
  }
  console.log(`Found ${products.length} existing products in database\n`)

  const files = readdirSync(FOLDER_PATH).filter(f => {
    const ext = extname(f).toLowerCase()
    return ext === ".jpg" || ext === ".jpeg"
  })
  console.log(`Found ${files.length} JPG files in ${FOLDER}\n`)

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

  for (const p of productMap.values()) {
    p.images.sort((a, b) => a.variant - b.variant)
  }

  console.log(`Unique products to process: ${productMap.size}\n`)

  let replaced = 0
  let created = 0
  let failed = 0
  let totalUploaded = 0

  for (const [num, product] of productMap) {
    const sku = `${PREFIX}-${num.padStart(3, "0")}`
    const existing = productBySku[sku]

    if (existing) {
      let success = true
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i]
        const storageName = `${sku}-${String(i + 1).padStart(2, "0")}.webp`
        const filePath = join(FOLDER_PATH, img.file)

        try {
          const webpBuffer = await sharp(filePath).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(storageName, webpBuffer, { upsert: true, contentType: "image/webp" })

          if (error) {
            console.log(`  ❌ ${sku}: Upload failed - ${error.message}`)
            success = false
            break
          }

          const existingImg = existing.product_images?.find(img => img.image_url === storageName)
          if (!existingImg) {
            await supabase.from("product_images").insert({
              product_id: existing.id,
              image_url: storageName,
              alt_text: existing.name,
              display_order: i,
              is_primary: i === 0,
            })
          } else if (existingImg.display_order !== i || existingImg.is_primary !== (i === 0)) {
            await supabase.from("product_images")
              .update({ display_order: i, is_primary: i === 0 })
              .eq("id", existingImg.id)
          }
          totalUploaded++
        } catch (err) {
          console.log(`  ❌ ${sku}: ${err.message}`)
          success = false
          break
        }
      }
      if (success) {
        replaced++
        console.log(`  ✅ ${sku}: Replaced ${product.images.length} images`)
      }
    } else {
      const productId = crypto.randomUUID()
      const price = calculatePrice(product.width, product.height)
      const slug = `${CATEGORY.toLowerCase().replace(/\s+/g, "-")}-${num}`

      const { error: prodError } = await supabase.from("products").insert({
        id: productId,
        name: `${CATEGORY} Rug ${num}`,
        slug,
        sku,
        price,
        description: `Hand-knotted ${CATEGORY} rug.\nSize: ${product.width}×${product.height} cm.`,
        stock_quantity: 1,
        is_active: true,
      })

      if (prodError) {
        console.log(`  ❌ ${sku}: Create failed - ${prodError.message}`)
        failed++
        continue
      }

      let success = true
      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i]
        const storageName = `${sku}-${String(i + 1).padStart(2, "0")}.webp`
        const filePath = join(FOLDER_PATH, img.file)

        try {
          const webpBuffer = await sharp(filePath).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(storageName, webpBuffer, { upsert: true, contentType: "image/webp" })

          if (error) {
            console.log(`  ❌ ${sku}: Upload failed - ${error.message}`)
            success = false
            break
          }

          await supabase.from("product_images").insert({
            product_id: productId,
            image_url: storageName,
            alt_text: `${CATEGORY} Rug ${num}`,
            display_order: i,
            is_primary: i === 0,
          })
          totalUploaded++
        } catch (err) {
          console.log(`  ❌ ${sku}: ${err.message}`)
          success = false
          break
        }
      }

      if (success) {
        created++
        console.log(`  🆕 ${sku}: Created with ${product.images.length} images`)
      }
    }
  }

  console.log(`\n=== Done ===`)
  console.log(`Replaced: ${replaced} products`)
  console.log(`Created: ${created} products`)
  console.log(`Failed: ${failed} products`)
  console.log(`Images uploaded: ${totalUploaded}`)
}

main().catch(console.error)
