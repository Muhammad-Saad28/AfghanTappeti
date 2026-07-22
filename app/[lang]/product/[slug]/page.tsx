import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { siteUrl, productStructuredData } from "@/lib/seo"
import { getDictionary, type Locale } from "@/lib/i18n"
import { getProductImageUrl } from "@/lib/supabase/storage"
import Image from "next/image"
import { AddToCartButton } from "./add-to-cart"
import { ReviewForm } from "@/components/product/review-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from("products")
    .select("name, short_description, description")
    .eq("slug", slug)
    .single()

  if (!product) return {}

  return {
    title: product.name,
    description: product.short_description || product.description?.substring(0, 160) || "",
    alternates: {
      canonical: `${siteUrl}/${lang}/product/${slug}`,
      languages: { en: `${siteUrl}/en/product/${slug}`, it: `${siteUrl}/it/product/${slug}`, "x-default": `${siteUrl}/en/product/${slug}` },
    },
    openGraph: {
      title: product.name,
      description: product.short_description || undefined,
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
    .select("*, origins(name), materials(name), colors!primary_color_id(name, hex_code), sizes(name)")
    .eq("slug", slug)
    .single()

  if (!product) notFound()

  const [{ data: images }, { data: reviews }] = await Promise.all([
    supabase.from("product_images").select("*").eq("product_id", product.id).order("display_order"),
    supabase.from("reviews").select("*").eq("product_id", product.id).eq("is_approved", true).order("created_at", { ascending: false }),
  ])

  const price = product.sale_price ?? product.price
  const primaryImageUrl = getProductImageUrl(images?.[0]?.image_url)

  const productUrl = `${siteUrl}/${lang}/product/${slug}`
  const jsonLd = productStructuredData({
    name: product.name,
    description: product.description || product.short_description,
    sku: product.sku,
    price,
    image: primaryImageUrl,
    url: productUrl,
  })

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 md:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4 sticky top-32">
          <div className="hidden md:flex flex-col gap-4 order-1 max-h-[700px] overflow-y-auto pr-2">
            {images?.map((img, i) => (
              <div
                key={img.id}
                className={`aspect-[3/4] relative cursor-pointer ring-1 ${i === 0 ? "ring-secondary" : "ring-primary/10 opacity-50 hover:opacity-100"} hover:ring-secondary transition-all bg-surface-container-low overflow-hidden`}
              >
                {img.image_url && <Image src={getProductImageUrl(img.image_url)} alt={product.name} fill className="object-cover" sizes="100px" />}
              </div>
            ))}
          </div>
          <div className="order-2 relative group overflow-hidden bg-surface-container-low">
            <div
              className="aspect-[4/5] bg-surface-container-high bg-cover bg-center"
              style={primaryImageUrl ? { backgroundImage: `url(${primaryImageUrl})` } : undefined}
            />
            <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="font-label-sm text-label-sm">{t.product.roll_to_zoom}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pl-12 flex flex-col pt-8 lg:pt-0">
          <nav className="flex gap-2 items-center text-on-surface-variant font-label-sm text-label-sm mb-6">
            <span>{t.product.shop_link}</span>
            <span className="text-[10px]">›</span>
          </nav>

          <div className="mb-8">
            <h1 className="font-display-lg text-headline-md lg:text-display-lg mb-2 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 text-on-surface-variant">
              {product.origins && <span className="font-label-md text-label-md">{t.product.origin}: {product.origins.name.toUpperCase()}</span>}
            </div>
          </div>

          <div className="mb-10">
            <span className="text-primary font-display-lg text-headline-md">€{price.toLocaleString()}</span>
            {product.sale_price && (
              <span className="ml-3 text-on-surface-variant font-body-md line-through">€{product.price.toLocaleString()}</span>
            )}
          </div>

          <div className="space-y-6 mb-10">
            <p className="font-body-md text-body-lg text-on-surface-variant leading-relaxed">{product.description || product.short_description}</p>
            <div className="grid grid-cols-2 gap-y-4 border-y border-outline-variant py-8">
              {product.sku && <Spec label={t.product.sku} value={product.sku} />}
              {product.materials && <Spec label={t.product.material} value={product.materials.name} />}
              {product.sizes && <Spec label={t.product.size} value={product.sizes.name} />}
              {product.colors && <Spec label={t.product.color} value={product.colors.name} />}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <AddToCartButton
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              salePrice={product.sale_price}
              image={primaryImageUrl}
            />
            <button className="border border-outline py-5 px-8 font-label-md text-label-md tracking-widest hover:bg-surface-container hover:border-primary transition-all duration-300">
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
                {product.short_description || t.product.details_care_text}
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
    </main>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{label}</span>
      <span className="font-body-md text-primary">{value}</span>
    </div>
  )
}
