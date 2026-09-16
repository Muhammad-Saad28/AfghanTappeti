import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import { join } from "path"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const BUCKET = "product-images"

async function main() {
  console.log("=== VERIFICATION REPORT ===\n")

  // 1. Get all products with images
  const { data: products } = await supabase
    .from("products")
    .select(`
      id, name, sku, is_active, deleted_at,
      product_images (id, image_url, display_order, is_primary),
      product_categories (categories (name))
    `)
    .is("deleted_at", null)
    .order("sku")

  console.log(`Total active products: ${products.length}\n`)

  // 2. Check each product
  let totalImages = 0
  let productsWithImages = 0
  let productsWithoutImages = 0
  let primaryIssues = 0
  let orderIssues = 0
  const storageChecks = []

  for (const p of products) {
    const imgs = p.product_images || []
    const cats = p.product_categories?.map(pc => pc.categories?.name).join(", ") || "none"

    if (imgs.length === 0) {
      productsWithoutImages++
      console.log(`⚠️  ${p.sku} (${p.name}) - NO IMAGES`)
      continue
    }

    productsWithImages++
    totalImages += imgs.length

    // Check primary image
    const primaryCount = imgs.filter(i => i.is_primary).length
    if (primaryCount !== 1) {
      primaryIssues++
      console.log(`⚠️  ${p.sku} - ${primaryCount} primary images (expected 1)`)
    }

    // Check display ordering
    const orders = imgs.map(i => i.display_order).sort((a, b) => a - b)
    const expectedOrders = Array.from({ length: imgs.length }, (_, i) => i)
    if (JSON.stringify(orders) !== JSON.stringify(expectedOrders)) {
      orderIssues++
      console.log(`⚠️  ${p.sku} - display_order mismatch: ${orders.join(",")}`)
    }

    // Check storage exists for first 3 images
    for (const img of imgs) {
      storageChecks.push({ sku: p.sku, image_url: img.image_url })
    }
  }

  // 3. Verify storage objects exist (sample check)
  console.log(`\n--- Checking storage objects (first 20) ---`)
  let storageFound = 0
  let storageMissing = 0

  for (const check of storageChecks.slice(0, 20)) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { search: check.image_url })

    if (data && data.some(f => f.name === check.image_url)) {
      storageFound++
    } else {
      storageMissing++
      console.log(`❌ Missing in storage: ${check.image_url} (${check.sku})`)
    }
  }

  // 4. Verify public URLs resolve
  console.log(`\n--- Checking public URL accessibility (first 5) ---`)
  let urlOk = 0
  let urlFail = 0

  for (const check of storageChecks.slice(0, 5)) {
    const url = `https://wywzczlhauqbkjzuqnqa.supabase.co/storage/v1/object/public/${BUCKET}/${check.image_url}`
    try {
      const res = await fetch(url, { method: "HEAD" })
      if (res.ok) {
        urlOk++
      } else {
        urlFail++
        console.log(`❌ URL returned ${res.status}: ${check.image_url}`)
      }
    } catch (err) {
      urlFail++
      console.log(`❌ URL fetch failed: ${check.image_url} - ${err.message}`)
    }
  }

  // 5. Summary by category
  console.log(`\n--- Products by Category ---`)
  const byCat = {}
  for (const p of products) {
    const cat = p.product_categories?.map(pc => pc.categories?.name).join(", ") || "uncategorized"
    if (!byCat[cat]) byCat[cat] = { count: 0, images: 0 }
    byCat[cat].count++
    byCat[cat].images += (p.product_images || []).length
  }
  for (const [cat, stats] of Object.entries(byCat)) {
    console.log(`  ${cat}: ${stats.count} products, ${stats.images} images`)
  }

  // Final summary
  console.log(`\n\n=== VERIFICATION SUMMARY ===`)
  console.log(`Total products: ${products.length}`)
  console.log(`Products with images: ${productsWithImages}`)
  console.log(`Products without images: ${productsWithoutImages}`)
  console.log(`Total images: ${totalImages}`)
  console.log(`Primary image issues: ${primaryIssues}`)
  console.log(`Display order issues: ${orderIssues}`)
  console.log(`Storage objects found (sample): ${storageFound}/20`)
  console.log(`Storage objects missing (sample): ${storageMissing}/20`)
  console.log(`Public URLs accessible (sample): ${urlOk}/5`)
  console.log(`Public URLs failed (sample): ${urlFail}/5`)

  if (productsWithoutImages === 0 && primaryIssues === 0 && storageMissing === 0 && urlFail === 0) {
    console.log(`\n✅ ALL CHECKS PASSED`)
  } else {
    console.log(`\n⚠️  SOME ISSUES FOUND - see above`)
  }
}

main().catch(console.error)
