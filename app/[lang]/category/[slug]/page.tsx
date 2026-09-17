import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { getProductImageUrl } from "@/lib/supabase/storage"
import { WishlistButton } from "@/components/home/wishlist-button"
import { localizeRow } from "@/lib/localize"
import { roundPrice } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)
  const supabase = await createClient()
  const { data: category } = await supabase.from("categories").select("name, description, translations").eq("slug", slug).single()

  if (!category) return { title: t.shop.title }

  const localized = localizeRow(category, locale)

  return {
    title: `${localized.name} — Afghan Tappeti`,
    description: `${localized.description}` || `Browse our ${localized.name} collection of hand-knotted rugs.`,
    alternates: {
      canonical: `${siteUrl}/${lang}/category/${slug}`,
      languages: {
        en: `${siteUrl}/en/category/${slug}`,
        it: `${siteUrl}/it/category/${slug}`,
        "x-default": `${siteUrl}/en/category/${slug}`,
      },
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, description, image, translations")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!category) notFound()

  const localizedCategory = localizeRow(category, locale)

  const { data: productIds } = await supabase
    .from("product_categories")
    .select("product_id")
    .eq("category_id", category.id)

  const ids = (productIds ?? []).map((pc) => pc.product_id)

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, sku, price, sale_price, short_description, translations, sizes(name, width_cm, length_cm, translations)")
    .is("deleted_at", null)
    .eq("is_active", true)
    .in("id", ids.length > 0 ? ids : ["00000000-0000-0000-0000-000000000000"])
    .order("created_at", { ascending: false })

  const localizedProducts = (products ?? []).map((p) => localizeRow(p, locale))

  const { data: productImages } = await supabase
    .from("product_images")
    .select("product_id, image_url")
    .in("product_id", ids.length > 0 ? ids : ["00000000-0000-0000-0000-000000000000"])
    .eq("display_order", 0)

  const imageMap = new Map<string, string>()
  for (const img of productImages ?? []) {
    imageMap.set(img.product_id, img.image_url)
  }

  return (
    <>
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${category.image || "/images/homepage.png"})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-10" />
        </div>
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4 drop-shadow-lg">{localizedCategory.name}</h1>
          {localizedCategory.description && (
            <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto drop-shadow">{localizedCategory.description}</p>
          )}
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 md:gap-y-16 md:gap-x-8">
          {localizedProducts.length === 0 && (
            <p className="col-span-full text-center font-body-md text-on-surface-variant py-12">{t.shop.no_results}</p>
          )}
          {localizedProducts?.map((product) => {
            const imgUrl = getProductImageUrl(imageMap.get(product.id))
            return (
              <Link key={product.id} href={`/${locale}/product/${product.slug}`} className="group no-underline">
                <div className="relative overflow-hidden mb-6 aspect-[3/4] bg-surface-container-low">
                  {imgUrl && <Image src={imgUrl} alt={product.name} fill unoptimized className="object-contain" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />}
                  <WishlistButton slug={product.slug} />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                </div>
                <header>
                  <h3 className="font-body-md text-[20px] mb-1 group-hover:text-secondary transition-colors">{product.name}</h3>
                  {product.sizes && <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">{(product.sizes as any)?.name ?? (Array.isArray(product.sizes) ? product.sizes[0]?.name : null)}</p>}
                  <p className="font-headline-sm text-headline-sm text-primary">€{roundPrice(product.sale_price ?? product.price).toLocaleString()}</p>
                </header>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
