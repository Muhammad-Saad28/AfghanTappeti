import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync } from "fs"
import { join, extname } from "path"
import { config } from "dotenv"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const DIR = "E:\\Own\\Clients\\AfghanTappeti\\products\\4-Sultani Khurgeen"

function basename(fp, ext) {
  const name = fp.split(/[\\/]/).pop()
  if (ext && name.toLowerCase().endsWith(ext.toLowerCase())) return name.slice(0, -ext.length)
  return name
}

function calculateSize(w, h) {
  return Math.round(Math.round((w * h) / 1000 * 10) / 10 * 310)
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  const files = readdirSync(DIR).filter(f => extname(f).toLowerCase() === ".webp")
  console.log(`${files.length} webp files\n`)

  // Get or create category
  let { data: cat } = await supabase.from("categories").select("id").eq("name", "Sultani Khurgeen").single()
  if (!cat) {
    const id = crypto.randomUUID()
    await supabase.from("categories").insert({ id, name: "Sultani Khurgeen", slug: "sultani-khurgeen", display_order: 999, is_active: true })
    cat = { id }
    console.log("Created category: Sultani Khurgeen")
  }

  // Get or create collection
  let { data: col } = await supabase.from("collections").select("id").eq("name", "Sultani Collection").single()
  if (!col) {
    const id = crypto.randomUUID()
    await supabase.from("collections").insert({ id, name: "Sultani Collection", slug: "sultani-collection", is_active: true })
    col = { id }
  }

  // Group by product number
  const productMap = new Map()
  for (const file of files) {
    const name = basename(file, extname(file))
    const match = name.match(/^(\d+)-(\d+)x(\d+)(?:\s*\((\d+)\))?$/)
    if (!match) continue
    const key = match[1]
    if (!productMap.has(key)) productMap.set(key, { num: key, w: parseInt(match[2]), h: parseInt(match[3]), images: [] })
    productMap.get(key).images.push({ file, variant: match[4] ? parseInt(match[4]) : 0 })
  }

  for (const p of productMap.values()) p.images.sort((a, b) => a.variant - b.variant)

  // Get existing SKUs
  const { data: existing } = await supabase.from("products").select("sku")
  const existingSkus = new Set((existing ?? []).map(p => p.sku))

  let created = 0, imgsUploaded = 0

  for (const [num, product] of productMap) {
    const sku = `SKH-${num.padStart(3, "0")}`
    if (existingSkus.has(sku)) { console.log(`⏭️ ${sku} exists`); continue }

    const size = calculateSize(product.w, product.h)
    const productId = crypto.randomUUID()

    await supabase.from("products").insert({
      id: productId,
      name: `Sultani Khurgeen Rug ${num}`,
      slug: `sultani-khurgeen-${num}`,
      sku,
      price: size,
      description: `Hand-knotted Sultani Khurgeen rug. Size: ${product.w}×${product.h} cm (${size}).`,
      stock_quantity: 1,
      is_active: true,
    })

    await supabase.from("product_categories").insert({ product_id: productId, category_id: cat.id })
    await supabase.from("product_collections").insert({ product_id: productId, collection_id: col.id })

    for (let i = 0; i < product.images.length; i++) {
      await sleep(500)
      const img = product.images[i]
      const storageName = `${sku}-${String(i + 1).padStart(2, "0")}.webp`
      const content = readFileSync(join(DIR, img.file))

      let retries = 3
      while (retries > 0) {
        const { error } = await supabase.storage.from("product-images").upload(storageName, content, { upsert: true, contentType: "image/webp" })
        if (!error) {
          await supabase.from("product_images").insert({ product_id: productId, image_url: storageName, alt_text: `Sultani Khurgeen Rug ${num}`, display_order: i, is_primary: i === 0 })
          imgsUploaded++
          break
        }
        retries--
        if (retries > 0) await sleep(2000)
        else console.log(`  ❌ ${storageName}: ${error.message}`)
      }
    }

    created++
    existingSkus.add(sku)
    console.log(`✅ ${sku}: ${product.w}×${product.h} → ${size} (${product.images.length} images)`)
  }

  console.log(`\nDone! Created ${created} products, uploaded ${imgsUploaded} images.`)
}

main().catch(console.error)
