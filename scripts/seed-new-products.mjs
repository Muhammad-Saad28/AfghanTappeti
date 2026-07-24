import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync, renameSync, mkdirSync, existsSync } from "fs"
import { join, extname } from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const IMAGES_DIR = join(__dirname, "..", "public", "images")

const products = [
  {
    sku: "SB-001",
    name: "Sultani Bakhtiari Heritage Rug",
    slug: "sultani-bakhtiari-heritage-rug",
    folder: "Sultani Bakhtiari Folder",
    count: 6,
    collection_id: "65ba64e4-afdc-4539-8cf9-0ca772fd09e4",
    price: 1200,
    short_description: "Hand-knotted Bakhtiari rug from the Sultani tradition",
    description: "A masterfully hand-knotted Sultani Bakhtiari rug featuring intricate geometric patterns and rich natural dyes. Each piece reflects the nomadic heritage of the Bakhtiari tribes of western Iran, woven with generations of expertise.",
  },
  {
    sku: "SFZ-001",
    name: "Sultani Farhan Ziegler Rug",
    slug: "sultani-farhan-ziegler-rug",
    folder: "Sultani Farhan Ziegler",
    count: 9,
    collection_id: "af17c80e-d553-4c6e-9300-b7a466d57df0",
    price: 1800,
    short_description: "Hand-knotted Farhan Ziegler rug with elegant floral motifs",
    description: "A stunning Sultani Farhan Ziegler rug, hand-knotted with precision. The Ziegler style originated in the 19th century as a fusion of Persian craftsmanship and Western design sensibilities, resulting in elegant floral patterns that complement both traditional and contemporary interiors.",
  },
  {
    sku: "SG-001",
    name: "Sultani Gabbah Rug",
    slug: "sultani-gabbah-rug",
    count: 30,
    folder: "Sultani Gabbah",
    collection_id: "17249f1b-e0ab-482d-a561-7d166843fc89",
    price: 900,
    short_description: "Hand-knotted Gabbah rug with bold tribal designs",
    description: "A striking Sultani Gabbah rug, hand-knotted using thick wool for a plush, durable texture. Gabbah rugs are known for their bold, abstract tribal motifs and symbolize the artistic freedom of nomadic weavers who create from memory and imagination rather than predefined patterns.",
  },
]

const CATEGORY_ID = "3060d39f-80ef-46ee-b9b7-8535cc8f4a04" // Afghan Rugs
const MATERIAL_ID = "f054b667-62d3-42a5-9177-6870e63dfc79" // Wool
const ORIGIN_ID = "16e1e628-da8a-4d1a-ab1c-c2427120b9e0" // Afghanistan
const SHAPE_ID = "821c3b6b-10a1-4f6d-a39a-b2b120aefc2d" // Rectangle

async function uploadImage(filePath, fileName) {
  const content = readFileSync(filePath)
  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, content, {
      upsert: true,
      contentType: extname(fileName) === ".webp" ? "image/webp" : "image/jpeg",
    })
  if (error) {
    console.error(`  Upload failed for ${fileName}:`, error.message)
    return false
  }
  console.log(`  Uploaded ${fileName}`)
  return true
}

async function main() {
  // Step 1: Rename files in each folder
  for (const p of products) {
    const folderPath = join(IMAGES_DIR, p.folder)
    const files = readdirSync(folderPath).filter(f => f !== "." && f !== "..")
    files.sort()
    console.log(`\nRenaming ${files.length} files in ${p.folder}...`)
    for (let i = 0; i < files.length && i < p.count; i++) {
      const ext = extname(files[i])
      const newName = `${p.sku}-${String(i + 1).padStart(2, "0")}${ext}`
      const oldPath = join(folderPath, files[i])
      const newPath = join(folderPath, newName)
      renameSync(oldPath, newPath)
      console.log(`  ${files[i]} → ${newName}`)
    }
  }

  // Step 2: Create products and upload images
  for (const p of products) {
    console.log(`\nProcessing ${p.sku} - ${p.name}...`)

    const productId = crypto.randomUUID()

    // Insert product
    const { error: prodErr } = await supabase.from("products").insert({
      id: productId,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      short_description: p.short_description,
      description: p.description,
      stock_quantity: 1,
      origin_id: ORIGIN_ID,
      material_id: MATERIAL_ID,
      shape_id: SHAPE_ID,
      is_active: true,
      is_featured: true,
    })
    if (prodErr) {
      console.error(`  Failed to insert product ${p.sku}:`, prodErr.message)
      continue
    }
    console.log(`  Created product ${productId}`)

    // Insert category mapping
    await supabase.from("product_categories").insert({
      product_id: productId,
      category_id: CATEGORY_ID,
    })

    // Insert collection mapping
    await supabase.from("product_collections").insert({
      product_id: productId,
      collection_id: p.collection_id,
    })

    // Upload images and insert records
    const folderPath = join(IMAGES_DIR, p.folder)
    const renamedFiles = readdirSync(folderPath)
      .filter(f => f.startsWith(p.sku))
      .sort()

    for (let i = 0; i < renamedFiles.length; i++) {
      const fileName = renamedFiles[i]
      const filePath = join(folderPath, fileName)

      const uploaded = await uploadImage(filePath, fileName)
      if (!uploaded) continue

      await supabase.from("product_images").insert({
        product_id: productId,
        image_url: fileName,
        alt_text: p.name,
        display_order: i,
        is_primary: i === 0,
      })
      console.log(`  Image record: ${fileName}`)
    }
  }

  console.log("\nDone! All products, images, and mappings created.")
}

main().catch(console.error)
