/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" })
const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

async function check() {
  const tables = [
    "profiles", "products", "product_images", "categories",
    "product_categories", "collections", "product_collections",
    "origins", "materials", "colors", "sizes", "shapes",
    "customers", "orders", "order_items", "reviews", "blogs",
    "homepage_sections", "newsletter_subscribers", "seo_metadata",
    "site_settings",
  ]

  for (const t of tables) {
    const { error } = await supabase.from(t).select("id", { count: "exact", head: true })
    console.log(`  ${t}: ${error ? "MISSING - " + error.message : "OK"}`)
  }

  const { data: origins } = await supabase.from("origins").select("name")
  console.log("\nSeed data — origins:", origins?.map((o) => o.name).join(", "))

  const { data: mats } = await supabase.from("materials").select("name")
  console.log("Seed data — materials:", mats?.map((m) => m.name).join(", "))

  const { data: shapes } = await supabase.from("shapes").select("name")
  console.log("Seed data — shapes:", shapes?.map((s) => s.name).join(", "))
}

check().catch(console.error)
