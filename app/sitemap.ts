import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { siteUrl } from "@/lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_active", true)
    .is("deleted_at", null)

  const { data: posts } = await supabase
    .from("blogs")
    .select("slug, published_at")
    .eq("status", "published")

  const staticRoutes = [
    "", "shop", "collections", "styles", "rooms",
    "about", "contact", "blog", "cart", "checkout", "wishlist",
  ]

  const entries: MetadataRoute.Sitemap = []

  const langs = ["en", "it"] as const

  for (const lang of langs) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${siteUrl}/${lang}/${route}`.replace(/\/$/, ""),
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${siteUrl}/en/${route}`.replace(/\/$/, ""),
            it: `${siteUrl}/it/${route}`.replace(/\/$/, ""),
          },
        },
      })
    }

    for (const product of products ?? []) {
      entries.push({
        url: `${siteUrl}/${lang}/product/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: {
          languages: {
            en: `${siteUrl}/en/product/${product.slug}`,
            it: `${siteUrl}/it/product/${product.slug}`,
          },
        },
      })
    }

    for (const post of posts ?? []) {
      entries.push({
        url: `${siteUrl}/${lang}/blog/${post.slug}`,
        lastModified: post.published_at ? new Date(post.published_at) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            en: `${siteUrl}/en/blog/${post.slug}`,
            it: `${siteUrl}/it/blog/${post.slug}`,
          },
        },
      })
    }
  }

  return entries
}
