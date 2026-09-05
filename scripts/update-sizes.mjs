import { createClient } from "@supabase/supabase-js"
import "dotenv/config"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  const { error: delErr } = await supabase.from("sizes").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  if (delErr) { console.error("Delete error:", delErr); process.exit(1) }
  console.log("Cleared existing sizes")

  const sizes = [
    { name: "60 x 200 cm", width_cm: 60, length_cm: 200, display_order: 1 },
    { name: "100 x 150 cm", width_cm: 100, length_cm: 150, display_order: 2 },
    { name: "120 x 200 cm", width_cm: 120, length_cm: 200, display_order: 3 },
    { name: "150 x 200 cm", width_cm: 150, length_cm: 200, display_order: 4 },
    { name: "150 x 230 cm", width_cm: 150, length_cm: 230, display_order: 5 },
    { name: "170 x 230 cm", width_cm: 170, length_cm: 230, display_order: 6 },
    { name: "250 x 300 cm", width_cm: 250, length_cm: 300, display_order: 7 },
    { name: "200 x 300 cm", width_cm: 200, length_cm: 300, display_order: 8 },
    { name: "250 x 350 cm", width_cm: 250, length_cm: 350, display_order: 9 },
    { name: "300 x 400 cm", width_cm: 300, length_cm: 400, display_order: 10 },
    { name: "Runner 80 x 300 cm", width_cm: 80, length_cm: 300, display_order: 11 },
    { name: "Other Sizes", width_cm: null, length_cm: null, display_order: 12 },
  ]

  const { data, error: insErr } = await supabase.from("sizes").insert(sizes).select()
  if (insErr) { console.error("Insert error:", insErr); process.exit(1) }
  console.log(`Inserted ${data.length} sizes:`)
  data.forEach((s) => console.log(`  ${s.display_order}. ${s.name}`))
}

run()
