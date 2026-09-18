import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { siteUrl, productStructuredData } from "@/lib/seo"
import { getDictionary, type Locale } from "@/lib/i18n"
import { getProductImageUrl } from "@/lib/supabase/storage"
import Image from "next/image"
import Link from "next/link"
import { AddToCartButton } from "./add-to-cart"
import { ReviewForm } from "@/components/product/review-form"
import { ProductImageCarousel } from "@/components/product/product-image-carousel"
import { localizeRow } from "@/lib/localize"
import { roundPrice } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from("products")
    .select("name, short_description, description, translations")
    .eq("slug", slug)
    .single()

  if (!product) return {}

  const localized = localizeRow(product, lang as Locale)

  return {
    title: localized.name as string,
    description: (localized.short_description || localized.description)?.substring(0, 160) ?? "",
    alternates: {
      canonical: `${siteUrl}/${lang}/product/${slug}`,
      languages: { en: `${siteUrl}/en/product/${slug}`, it: `${siteUrl}/it/product/${slug}`, "x-default": `${siteUrl}/en/product/${slug}` },
    },
    openGraph: {
      title: localized.name as string,
      description: (localized.short_description as string) || undefined,
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = lang as Locale
  const supabase = await createClient()
  const t = await getDictionary(locale)

  const { data: product } = await supabase
    .from("products")
    .select("*, origins(name, translations), materials(name, translations), colors!primary_color_id(name, hex_code, translations), sizes(name, translations), translations")
    .eq("slug", slug)
    .single()

  if (!product) notFound()

  const localizedProduct = localizeRow(product, locale)
  const localizedOrigin = product.origins ? localizeRow(product.origins, locale) : null
  const localizedMaterial = product.materials ? localizeRow(product.materials, locale) : null
  const localizedColor = product.colors ? localizeRow(product.colors, locale) : null
  const localizedSize = product.sizes ? localizeRow(product.sizes, locale) : null

  const [{ data: images }, { data: reviews }, { data: relIds }] = await Promise.all([
    supabase.from("product_images").select("*").eq("product_id", product.id).order("display_order"),
    supabase.from("reviews").select("*").eq("product_id", product.id).eq("is_approved", true).order("created_at", { ascending: false }),
    supabase.from("product_categories").select("category_id").eq("product_id", product.id),
  ])

  let relatedProducts: Record<string, unknown>[] = []
  const catIds = (relIds ?? []).map((r) => r.category_id)
  if (catIds.length > 0) {
    const { data: siblingIds } = await supabase
      .from("product_categories")
      .select("product_id")
      .in("category_id", catIds)
      .neq("product_id", product.id)
      .limit(20)
    const sibIds = [...new Set((siblingIds ?? []).map((r) => r.product_id))].slice(0, 8)
    if (sibIds.length > 0) {
      const { data: rel } = await supabase
        .from("products")
        .select("id, name, slug, sku, price, sale_price, translations")
        .is("deleted_at", null)
        .eq("is_active", true)
        .in("id", sibIds)
        .limit(4)
      relatedProducts = (rel ?? []).map((p) => localizeRow(p, locale))
    }
  }

  let relatedImages: Record<string, string> = {}
  if (relatedProducts.length > 0) {
    const rpIds = relatedProducts.map((p) => p.id as string)
    const { data: ri } = await supabase
      .from("product_images")
      .select("product_id, image_url")
      .in("product_id", rpIds)
      .eq("display_order", 0)
    for (const img of ri ?? []) {
      if (!relatedImages[img.product_id]) relatedImages[img.product_id] = img.image_url
    }
  }

  const price = product.sale_price ?? product.price
  const primaryImageUrl = getProductImageUrl(images?.[0]?.image_url)

  const productUrl = `${siteUrl}/${lang}/product/${slug}`
  const jsonLd = productStructuredData({
    name: localizedProduct.name,
    description: localizedProduct.description || localizedProduct.short_description,
    sku: product.sku,
    price,
    image: primaryImageUrl,
    url: productUrl,
  })
    
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 md:pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 sticky top-32">
          <ProductImageCarousel images={images ?? []} productName={localizedProduct.name as string} />
        </div>

        <div className="lg:col-span-5 lg:pl-12 flex flex-col pt-8 lg:pt-0">
          <nav className="flex gap-2 items-center text-on-surface-variant font-label-sm text-label-sm mb-6">
            <span>{t.product.shop_link}</span>
            <span className="text-[10px]">›</span>
          </nav>

          <div className="mb-8">
            <h1 className="font-body-md text-headline-sm lg:text-headline-md mb-2 leading-tight">{localizedProduct.name}</h1>
            <div className="flex flex-col gap-1 text-on-surface-variant">
              {product.sizes && <span className="font-label-sm text-label-sm">{localizedSize?.name ?? ""}</span>}
              {product.origins && <span className="font-label-sm text-label-sm">{t.product.origin}: {localizedOrigin?.name?.toUpperCase() ?? ""}</span>}
            </div>
          </div>

          {product.rug_no && <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 tracking-wider uppercase">Rug N° {product.rug_no}</p>}

          <div className="mb-10 pb-10 border-b border-outline-variant">
            <span className="text-primary font-headline-sm text-headline-sm">€{roundPrice(price).toLocaleString()}</span>
            {product.sale_price && (
              <span className="ml-3 text-on-surface-variant font-body-md line-through">€{roundPrice(product.price).toLocaleString()}</span>
            )}
          </div>

          <div className="space-y-6 mb-10">
            <p className="font-body-md text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-line">{localizedProduct.description || localizedProduct.short_description}</p>
            <div className="grid grid-cols-2 gap-y-5 gap-x-8 border-y border-outline-variant py-8">
              {product.materials && <Spec label={t.product.material} value={localizedMaterial?.name ?? ""} />}
              {product.sizes && <Spec label={t.product.size} value={localizedSize?.name ?? ""} />}
              {product.colors && <Spec label={t.product.color} value={localizedColor?.name ?? ""} />}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <AddToCartButton
              id={product.id}
              name={localizedProduct.name}
              slug={product.slug}
              price={product.price}
              salePrice={product.sale_price}
              image={primaryImageUrl}
            />
            <button className="border border-outline-variant py-3 px-5 md:py-5 md:px-8 font-label-md text-label-md tracking-widest hover:bg-surface-container hover:border-primary transition-all duration-300 text-on-surface-variant">
              {t.product.request_concierge}
            </button>
          </div>

          <div className="mt-12 space-y-4">
            <details className="group border-b border-outline-variant pb-4" open>
              <summary className="flex justify-between items-center cursor-pointer list-none font-label-md text-label-md text-primary">
                {t.product.details_care}
                <span className="transition-transform group-open:rotate-180 text-lg">›</span>
              </summary>
              <div className="pt-4 font-body-md text-on-surface-variant text-sm leading-relaxed">
                {localizedProduct.short_description || t.product.details_care_text}
              </div>
            </details>
            <details className="group border-b border-outline-variant pb-4">
              <summary className="flex justify-between items-center cursor-pointer list-none font-label-md text-label-md text-primary">
                {t.product.shipping_returns}
                <span className="transition-transform group-open:rotate-180 text-lg">›</span>
              </summary>
              <div className="pt-4 font-body-md text-on-surface-variant text-sm leading-relaxed">
                {t.product.shipping_text}
              </div>
            </details>
          </div>
        </div>
      </div>

      <section className="mt-section-gap border-t border-outline-variant pt-section-gap">
        <h2 className="font-headline-md text-headline-md mb-8">{t.product.reviews}</h2>

        {(!reviews || reviews.length === 0) && (
          <p className="font-body-md text-on-surface-variant mb-8">{t.product.no_reviews}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {reviews?.map((r) => (
            <div key={r.id} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-on-surface">{r.customer_name}</span>
                <span className="font-label-sm text-label-sm text-secondary">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              {r.country && <span className="font-label-sm text-label-sm text-on-surface-variant block mb-2">{r.country}</span>}
              {r.title && <h4 className="font-label-md text-label-md text-on-surface mb-1">{r.title}</h4>}
              <p className="font-body-md text-on-surface-variant">{r.review}</p>
            </div>
          ))}
        </div>

        <div className="max-w-lg">
          <ReviewForm
            productId={product.id}
            t={{
              write_review: t.product.write_review,
              your_name: t.product.your_name,
              your_country: t.product.your_country,
              review_title: t.product.review_title,
              review_text: t.product.review_text,
              rating: t.product.rating,
              submit_review: t.product.submit_review,
              review_thanks: t.product.review_thanks,
            }}
          />
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-section-gap border-t border-outline-variant pt-section-gap">
          <h2 className="font-headline-md text-headline-md mb-8">{t.product.related_products ?? "You May Also Like"}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {relatedProducts.map((rp) => {
              const rpLocal = rp as Record<string, unknown>
              const rpImg = getProductImageUrl(relatedImages[rpLocal.id as string] ?? null)
              return (
                <Link key={rpLocal.id as string} href={`/${locale}/product/${rpLocal.slug as string}`} className="group no-underline">
                  <div className="aspect-[3/4] relative overflow-hidden bg-surface-container-low mb-4">
                    {rpImg && <Image src={rpImg} alt={rpLocal.name as string} fill unoptimized className="object-contain" sizes="(max-width: 768px) 50vw, 25vw" />}
                  </div>
                  <h3 className="font-body-md text-body-md font-semibold group-hover:text-secondary transition-colors mb-1">{rpLocal.name as string}</h3>
                  <p className="font-headline-sm text-headline-sm text-secondary mt-2">€{roundPrice((rpLocal.sale_price ?? rpLocal.price) as number).toLocaleString()}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5">{label}</span>
      <span className="font-body-md text-on-surface">{value}</span>
    </div>
  )
}
