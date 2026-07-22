export const siteUrl = "https://afghantappeti.com"

const routes = [
  "", "shop", "collections", "styles", "rooms",
  "about", "contact", "blog", "cart", "checkout", "wishlist",
] as const

export function getAlternates(lang: string, path: string = "") {
  const cleanPath = path.replace(/^\//, "")
  return {
    languages: {
      en: `${siteUrl}/en/${cleanPath}`,
      it: `${siteUrl}/it/${cleanPath}`,
      "x-default": `${siteUrl}/en/${cleanPath}`,
    },
    canonical: `${siteUrl}/${lang}/${cleanPath}`.replace(/\/$/, ""),
  }
}

export function generateSitemapEntries() {
  const entries: { url: string; lastModified: Date; alternates: { en: string; it: string } }[] = []

  const langs = ["en", "it"] as const

  for (const lang of langs) {
    for (const route of routes) {
      const url = `${siteUrl}/${lang}/${route}`.replace(/\/$/, "")
      entries.push({
        url,
        lastModified: new Date(),
        alternates: {
          en: `${siteUrl}/en/${route}`.replace(/\/$/, ""),
          it: `${siteUrl}/it/${route}`.replace(/\/$/, ""),
        },
      })
    }
  }

  return entries
}

export function productStructuredData(product: {
  name: string
  description?: string | null
  sku?: string | null
  price: number
  sale_price?: number | null
  image?: string | null
  url: string
  currency?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    sku: product.sku || undefined,
    image: product.image || undefined,
    url: product.url,
    offers: {
      "@type": "Offer",
      price: product.sale_price ?? product.price,
      priceCurrency: product.currency ?? "EUR",
      availability: "https://schema.org/InStock",
    },
  }
}

export function organizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Afghan Tappeti",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+39 02 1234 5678",
      contactType: "customer service",
      areaServed: "IT",
      availableLanguage: ["English", "Italian"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IT",
      addressLocality: "Milan",
    },
  }
}

export function breadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function blogStructuredData(post: {
  title: string
  excerpt?: string | null
  published_at?: string | null
  url: string
  image?: string | null
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.published_at || undefined,
    image: post.image || undefined,
    url: post.url,
  }
}
