import { config } from "dotenv"
import { createClient } from "@supabase/supabase-js"

config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials in .env.local")
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const email = "admin@afghantappeti.com"
const password = "afghantappeti"

const { data: existingUser } = await admin.auth.admin.listUsers()
const exists = existingUser?.users?.find((u) => u.email === email)

if (exists) {
  console.log(`✓ Admin user already exists: ${email}`)
} else {
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Admin" },
  })
  if (error) {
    console.error("Failed to create admin user:", error.message)
    process.exit(1)
  }
  console.log(`✓ Admin user created: ${email}`)
}

const { data: profile } = await admin
  .from("profiles")
  .select("id")
  .eq("email", email)
  .single()

if (!profile) {
  const { data: user } = await admin.auth.admin.listUsers()
  const found = user?.users?.find((u) => u.email === email)
  if (found) {
    await admin.from("profiles").upsert({
      id: found.id,
      email,
      full_name: "Admin",
      role: "admin",
      is_active: true,
    })
    console.log("✓ Profile created for admin user")
  }
} else {
  console.log("✓ Profile already exists")
}

console.log("\nDone! You can now log in at /login")
console.log(`  Email:    ${email}`)
console.log(`  Password: ${password}`)
