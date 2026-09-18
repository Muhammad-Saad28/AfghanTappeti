import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync, statSync } from "fs"
import { join, extname, parse } from "path"
import { config } from "dotenv"

config({ path: join(import.meta.dirname, "..", ".env.local") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PRODUCTS_DIR = "E:\\Own\\Clients\\AfghanTappeti\\products"

// Size formula: ROUND((width × height) / 1000, 1) × 310
function calculateSize(width, height) {
  const area = width * height
  const converted = area / 1000
  const rounded = Math.round(converted * 10) / 10
  return Math.round(rounded * 310)
}

// Parse raw filename like "10-298x82 (1).webp" or "10-298x82.webp"
function parseRawFilename(filename) {
  const ext = extname(filename)
  const name = basename(filename, ext)
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

// Parse uploaded filename like "AK-001-01.webp" or "SFZ-001-03.jpg"
function parseUploadedFilename(filename) {
  const ext = extname(filename)
  const name = basename(filename, ext)
  // Match: SKU-NN
  const match = name.match(/^([A-Z]+-\d+)-(\d+)$/)
  if (!match) return null
  return {
    sku: match[1],
    imageIndex: parseInt(match[2]),
  }
}

function basename(filePath, ext) {
  const name = filePath.split(/[\\/]/).pop()
  if (ext && name.toLowerCase().endsWith(ext.toLowerCase())) {
    return name.slice(0, -ext.length)
  }
  return name
}

async function getOrCreateCategory(name) {
  const { data } = await supabase.from("categories").select("id").eq("name", name).single()
  if (data) return data.id
  const id = crypto.randomUUID()
  await supabase.from("categories").insert({ id, name, slug: name.toLowerCase().replace(/\s+/g, "-"), display_order: 999, is_active: true })
  console.log(`  Created category: ${name}`)
  return id
}

async function getOrCreateCollection(name) {
  const { data } = await supabase.from("collections").select("id").eq("name", name).single()
  if (data) return data.id
  const id = crypto.randomUUID()
  await supabase.from("collections").insert({ id, name, slug: name.toLowerCase().replace(/\s+/g, "-"), is_active: true })
  console.log(`  Created collection: ${name}`)
  return id
}

async function uploadToStorage(filePath, storageName) {
  const content = readFileSync(filePath)
  const ext = extname(filePath).toLowerCase()
  const contentType = ext === ".webp" ? "image/webp" : ext === ".png" ? "image/png" : "image/jpeg"
  const { error } = await supabase.storage.from("product-images").upload(storageName, content, { upsert: true, contentType })
  return !error
}

// Process raw product folders (Sultani Bakhtiari, etc.)
async function processRawFolders() {
  const folders = readdirSync(PRODUCTS_DIR).filter(f => {
    const path = join(PRODUCTS_DIR, f)
    return statSync(path).isDirectory() && f !== "Uploaded"
  })

  const collectionId = await getOrCreateCollection("Sultani Collection")
  const { data: existing } = await supabase.from("products").select("sku")
  const existingSkus = new Set((existing ?? []).map(p => p.sku))

  let totalProducts = 0, totalImages = 0

  for (const folder of folders) {
    const folderPath = join(PRODUCTS_DIR, folder)
    const files = readdirSync(folderPath).filter(f => {
      const ext = extname(f).toLowerCase()
      return ext === ".webp"
    })

    console.log(`\n📁 ${folder} (${files.length} webp images)`)

    // Group by product number
    const productMap = new Map()
    for (const file of files) {
      const parsed = parseRawFilename(file)
      if (!parsed) continue
      const key = parsed.productNumber
      if (!productMap.has(key)) {
        productMap.set(key, { number: key, width: parsed.width, height: parsed.height, images: [] })
      }
      productMap.get(key).images.push({ file, variant: parsed.variant })
    }

    for (const product of productMap.values()) {
      product.images.sort((a, b) => a.variant - b.variant)
    }

    const categoryId = await getOrCreateCategory(folder)

    for (const [num, product] of productMap) {
      const sku = `AK-${num.padStart(3, "0")}`
      if (existingSkus.has(sku)) {
        console.log(`  ⏭️  ${sku} exists, skipping`)
        continue
      }

      const size = calculateSize(product.width, product.height)
      const productId = crypto.randomUUID()

      const { error } = await supabase.from("products").insert({
        id: productId,
        name: `${folder} Rug ${num}`,
        slug: `${folder.toLowerCase().replace(/\s+/g, "-")}-${num}`,
        sku,
        price: 1500,
        description: `Hand-knotted ${folder} rug.\nSize: ${product.width}×${product.height} cm (${size}).`,
        stock_quantity: 1,
        is_active: true,
      })
      if (error) { console.error(`  ❌ ${sku}:`, error.message); continue }

      await supabase.from("product_categories").insert({ product_id: productId, category_id: categoryId })
      await supabase.from("product_collections").insert({ product_id: productId, collection_id: collectionId })

      for (let i = 0; i < product.images.length; i++) {
        const img = product.images[i]
        const storageName = `${sku}-${String(i + 1).padStart(2, "0")}.webp`
        const filePath = join(folderPath, img.file)
        if (await uploadToStorage(filePath, storageName)) {
          await supabase.from("product_images").insert({
            product_id: productId,
            image_url: storageName,
            alt_text: `${folder} Rug ${num}`,
            display_order: i,
            is_primary: i === 0,
          })
          totalImages++
        }
      }

      totalProducts++
      existingSkus.add(sku)
      console.log(`  ✅ ${sku}: ${product.width}×${product.height} → ${size} (${product.images.length} images)`)
    }
  }
  return { totalProducts, totalImages }
}

// Process Uploaded folder (already has SKU naming)
async function processUploadedFolder() {
  const uploadedDir = join(PRODUCTS_DIR, "Uploaded")
  const files = readdirSync(uploadedDir).filter(f => extname(f).toLowerCase() === ".webp")

  console.log(`\n📁 Uploaded (${files.length} webp images)`)

  const collectionId = await getOrCreateCollection("Uploaded Collection")
  const { data: existing } = await supabase.from("products").select("sku")
  const existingSkus = new Set((existing ?? []).map(p => p.sku))

  // Group by SKU prefix
  const productMap = new Map()
  for (const file of files) {
    const parsed = parseUploadedFilename(file)
    if (!parsed) continue
    if (!productMap.has(parsed.sku)) {
      productMap.set(parsed.sku, { images: [] })
    }
    productMap.get(parsed.sku).images.push({ file, index: parsed.imageIndex })
  }

  for (const product of productMap.values()) {
    product.images.sort((a, b) => a.index - b.index)
  }

  let totalProducts = 0, totalImages = 0

  for (const [sku, product] of productMap) {
    if (existingSkus.has(sku)) {
      console.log(`  ⏭️  ${sku} exists, skipping`)
      continue
    }

    const productId = crypto.randomUUID()
    const prefix = sku.split("-")[0]

    const { error } = await supabase.from("products").insert({
      id: productId,
      name: `${sku} Rug`,
      slug: sku.toLowerCase(),
      sku,
      price: 1500,
      description: `Hand-knotted rug ${sku}.`,
      stock_quantity: 1,
      is_active: true,
    })
    if (error) { console.error(`  ❌ ${sku}:`, error.message); continue }

    for (let i = 0; i < product.images.length; i++) {
      const img = product.images[i]
      const storageName = `${sku}-${String(i + 1).padStart(2, "0")}.webp`
      const filePath = join(uploadedDir, img.file)
      if (await uploadToStorage(filePath, storageName)) {
        await supabase.from("product_images").insert({
          product_id: productId,
          image_url: storageName,
          alt_text: `${sku} Rug`,
          display_order: i,
          is_primary: i === 0,
        })
        totalImages++
      }
    }

    totalProducts++
    existingSkus.add(sku)
    console.log(`  ✅ ${sku} (${product.images.length} images)`)
  }
  return { totalProducts, totalImages }
}

async function main() {
  console.log("=== Full Product Importer ===")
  console.log("Uploading WebP images to Supabase Storage\n")

  const raw = await processRawFolders()
  const uploaded = await processUploadedFolder()

  console.log(`\n=== Summary ===`)
  console.log(`Raw folders: ${raw.totalProducts} products, ${raw.totalImages} images`)
  console.log(`Uploaded: ${uploaded.totalProducts} products, ${uploaded.totalImages} images`)
  console.log(`Total: ${raw.totalProducts + uploaded.totalProducts} products, ${raw.totalImages + uploaded.totalImages} images`)
}

main().catch(console.error)
