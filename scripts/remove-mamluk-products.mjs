import { createClient } from "@supabase/supabase-js"
import { join } from "path"
import { config } from "dotenv"

config({ path: join(import.meta.dirname, "..", ".env.local") })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const SKUS_TO_REMOVE = ["MLK-2401", "MLK-2368"]

async function main() {
  // 1. Find Mamluk category
  const { data: cat, error: catErr } = await supabase
    .from("categories")
    .select("id, name")
    .eq("name", "Mamluk")
    .single()

  if (catErr || !cat) {
    console.error("Mamluk category not found:", catErr?.message)
    process.exit(1)
  }
  console.log(`Found Mamluk category: ${cat.id}`)

  // 2. Find products by SKU
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, name, sku")
    .in("sku", SKUS_TO_REMOVE)

  if (prodErr) {
    console.error("Error fetching products:", prodErr.message)
    process.exit(1)
  }

  if (!products || products.length === 0) {
    console.log("No products found with SKUs:", SKUS_TO_REMOVE)
    process.exit(0)
  }

  console.log(`Found ${products.length} products:`)
  products.forEach(p => console.log(`  - ${p.name} (SKU: ${p.sku}, ID: ${p.id})`))

  // 3. Delete product_categories rows linking these products to Mamluk
  const productIds = products.map(p => p.id)

  const { data: deleted, error: delErr } = await supabase
    .from("product_categories")
    .delete()
    .eq("category_id", cat.id)
    .in("product_id", productIds)
    .select()

  if (delErr) {
    console.error("Error deleting product_categories:", delErr.message)
    process.exit(1)
  }

  console.log(`\nRemoved ${deleted?.length ?? 0} product-category links from Mamluk:`)
  deleted?.forEach(row => {
    const product = products.find(p => p.id === row.product_id)
    console.log(`  - ${product?.name ?? row.product_id}`)
  })

  console.log("\nDone. Products still exist in the database and in other categories.")
}

main()
