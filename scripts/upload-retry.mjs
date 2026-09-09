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

const PREFIX_FOLDER = {
  SB: "Sultani Bakhtiari",
  SFZ: "Sultani Farhan Ziegler",
  SKG: "Sultani Kazak Gold",
  STD: "Sultani Tree Design",
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function main() {
  const { data: products } = await supabase.from("products").select("id, sku, name")
  const { data: existingImages } = await supabase.from("product_images").select("product_id")
  const imageProductIds = new Set((existingImages ?? []).map(i => i.product_id))
  const needsImages = products?.filter(p => !imageProductIds.has(p.id)) ?? []

  console.log(`Retrying ${needsImages.length} products with delays...\n`)

  let uploaded = 0
  let failed = 0

  for (const product of needsImages) {
    const prefix = product.sku.split("-")[0]
    const num = parseInt(product.sku.split("-")[1]).toString()
    const folder = PREFIX_FOLDER[prefix]

    if (!folder) continue

    const folderPath = join(PRODUCTS_DIR, folder)
    const pattern = new RegExp(`^${num}-\\d+x\\d+`, "i")
    const files = readdirSync(folderPath).filter(f => {
      const ext = extname(f).toLowerCase()
      return ext === ".webp" && pattern.test(basename(f, ext))
    })

    if (files.length === 0) continue

    files.sort((a, b) => {
      const va = basename(a, extname(a)).match(/\((\d+)\)/)?.[1] || "0"
      const vb = basename(b, extname(b)).match(/\((\d+)\)/)?.[1] || "0"
      return parseInt(va) - parseInt(vb)
    })

    console.log(`📦 ${product.sku}: ${files.length} images`)

    for (let i = 0; i < files.length; i++) {
      await sleep(500) // 500ms delay between uploads

      const file = files[i]
      const storageName = `${product.sku}-${String(i + 1).padStart(2, "0")}.webp`
      const filePath = join(folderPath, file)
      const content = readFileSync(filePath)

      let retries = 3
      while (retries > 0) {
        const { error } = await supabase.storage
          .from("product-images")
          .upload(storageName, content, { upsert: true, contentType: "image/webp" })

        if (!error) {
          await supabase.from("product_images").insert({
            product_id: product.id,
            image_url: storageName,
            alt_text: product.name,
            display_order: i,
            is_primary: i === 0,
          })
          console.log(`  ✅ ${storageName}`)
          uploaded++
          break
        }

        retries--
        if (retries > 0) {
          console.log(`  ⏳ retry ${storageName}...`)
          await sleep(2000)
        } else {
          console.log(`  ❌ ${storageName}: ${error.message}`)
          failed++
        }
      }
    }
  }

  console.log(`\nDone! Uploaded: ${uploaded}, Failed: ${failed}`)
}

main().catch(console.error)
