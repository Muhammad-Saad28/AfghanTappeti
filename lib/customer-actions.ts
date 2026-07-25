"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function registerCustomer(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("first_name") as string
  const lastName = formData.get("last_name") as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: "customer" } },
  })

  if (authError) throw new Error(authError.message)
  if (!authData.user) throw new Error("Registration failed")

  const { error: profileError } = await supabase.from("customers").insert({
    user_id: authData.user.id,
    first_name: firstName,
    last_name: lastName,
    email,
  })

  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id)
    throw new Error(profileError.message)
  }

  revalidatePath("/" + formData.get("lang") as string)
  redirect("/" + (formData.get("lang") as string) + "/account")
}

export async function loginCustomer(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  const lang = formData.get("lang") as string
  revalidatePath("/" + lang)
  redirect("/" + lang + "/account")
}

export async function logoutCustomer() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
