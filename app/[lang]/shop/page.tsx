import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { getProductImageUrl } from "@/lib/supabase/storage"
import { ShopSort } from "@/components/shop/shop-sort"
import { ShopFilters } from "@/components/shop/shop-filters"
import { WishlistButton } from "@/components/home/wishlist-button"
import { localizeRow } from "@/lib/localize"
import { roundPrice } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)
  return {
    title: t.shop.title,
    description: `Browse our curated collection of hand-knotted rugs. ${t.shop.filter_origin} — authentic pieces from Afghanistan, Persia, and beyond.`,
    alternates: {
      canonical: `${siteUrl}/${lang}/shop`,
      languages: { en: `${siteUrl}/en/shop`, it: `${siteUrl}/it/shop`, "x-default": `${siteUrl}/en/shop` },
    },
  }
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { lang } = await params
  const sp = await searchParams
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const supabase = await createClient()

  const [origins, materials, sizes, colors] = await Promise.all([
    supabase.from("origins").select("id, name, translations").order("name"),
    supabase.from("materials").select("id, name, translations").order("name"),
    supabase.from("sizes").select("id, name, translations").order("display_order"),
    supabase.from("colors").select("id, name, hex_code, translations").order("name"),
  ])

  const localizedOrigins = (origins.data ?? []).map((o) => localizeRow(o, locale))
  const localizedMaterials = (materials.data ?? []).map((m) => localizeRow(m, locale))
  const localizedSizes = (sizes.data ?? []).map((s) => localizeRow(s, locale))
  const localizedColors = (colors.data ?? []).map((c) => localizeRow(c, locale))

  let query = supabase
    .from("products")
    .select("id, name, slug, sku, price, sale_price, short_description, origin_id, material_id, primary_color_id, size_id, translations, sizes(name, width_cm, length_cm, translations)", { count: "exact" })
    .is("deleted_at", null)
    .eq("is_active", true)

  const originFilter = sp.origin as string | undefined
  if (originFilter) {
    const originIds = originFilter.split(",").filter(Boolean)
    if (originIds.length > 0) query = query.in("origin_id", originIds)
  }
  const materialFilter = sp.material as string | undefined
  if (materialFilter) {
    const materialIds = materialFilter.split(",").filter(Boolean)
    if (materialIds.length > 0) query = query.in("material_id", materialIds)
  }
  const colorFilter = sp.color as string | undefined
  if (colorFilter) {
    const colorIds = colorFilter.split(",").filter(Boolean)
    if (colorIds.length > 0) query = query.in("primary_color_id", colorIds)
  }
  const sizeFilter = sp.size as string | undefined
  if (sizeFilter) {
    const sizeIds = sizeFilter.split(",").filter(Boolean)
    if (sizeIds.length > 0) query = query.in("size_id", sizeIds)
  }

  const searchQuery = sp.q as string | undefined
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`)
  }

  const sort = sp.sort as string | undefined
  if (sort === "price_asc") query = query.order("price", { ascending: true })
  else if (sort === "price_desc") query = query.order("price", { ascending: false })
  else if (sort === "name") query = query.order("name", { ascending: true })
  else query = query.order("created_at", { ascending: false })

  const page = Math.max(1, parseInt(sp.page as string) || 1)
  const limit = 12
  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)

  const { data: products, count: totalCount } = await query
  const localizedProducts = (products ?? []).map((p) => localizeRow(p, locale))
  const totalPages = Math.ceil((totalCount ?? 0) / limit)

  const ids = localizedProducts.map((p) => p.id)
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
      <section className="relative h-[250px] md:h-[350px] lg:h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/homepage.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-10" />
        </div>
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4 drop-shadow-lg">{t.shop.hero_title}</h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto drop-shadow">{t.shop.hero_subtitle}</p>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row gap-gutter mt-16 mb-section-gap">
        <aside className="md:w-1/4 md:sticky md:top-32 h-fit pb-10">
          <details open className="md:contents group">
            <summary className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant cursor-pointer md:cursor-default list-none md:hidden">
              <h3 className="font-headline-sm text-headline-sm">{t.shop.filters}</h3>
              <span className="text-label-sm font-label-sm text-secondary">Show / Hide</span>
            </summary>
            <ShopFilters
              locale={locale}
              origins={localizedOrigins}
              materials={localizedMaterials}
              colors={localizedColors}
              sizes={localizedSizes}
              labels={{
                filters: t.shop.filters,
                clear_all: t.shop.clear_all,
                filter_origin: t.shop.filter_origin,
                filter_material: t.shop.filter_material,
                filter_color: t.shop.filter_color,
                filter_size: t.shop.filter_size,
              }}
            />
          </details>
        </aside>

        <section className="md:w-3/4">
          <form method="GET" className="mb-6">
            {sp.origin && <input type="hidden" name="origin" value={sp.origin} />}
            {sp.material && <input type="hidden" name="material" value={sp.material} />}
            {sp.color && <input type="hidden" name="color" value={sp.color} />}
            {sp.size && <input type="hidden" name="size" value={sp.size} />}
            {sp.sort && <input type="hidden" name="sort" value={sp.sort} />}
            <div className="relative">
              <input name="q" defaultValue={searchQuery ?? ""} placeholder="Search rugs..." className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-4 pr-12 py-3 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary placeholder:text-on-surface-variant/60" />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </form>
          <div className="flex justify-between items-center mb-8">
            <p className="font-body-md text-on-surface-variant italic">{t.shop.showing} {totalCount ? `${offset + 1}–${Math.min(offset + limit, totalCount)} of ${totalCount}` : "0"}</p>
            <div className="flex items-center gap-4">
              <span className="text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant">{t.shop.sort_by}</span>
              <ShopSort
                label={t.shop.sort_by}
                options={[
                  { value: "newest", label: t.shop.sort_newest },
                  { value: "price_desc", label: t.shop.sort_price_desc },
                  { value: "price_asc", label: t.shop.sort_price_asc },
                  { value: "name", label: t.shop.sort_name },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 md:gap-y-16 md:gap-x-8">
            {localizedProducts.length === 0 && (
              <p className="col-span-full text-center font-body-md text-on-surface-variant py-12">{t.shop.no_results}</p>
            )}
            {localizedProducts.map((product) => {
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
                    <div className="flex justify-between items-end">
                      <p className="font-headline-sm text-headline-sm text-primary">€{roundPrice(product.sale_price ?? product.price).toLocaleString()}</p>
                      <span className="text-label-sm font-label-sm text-secondary underline decoration-1 underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{t.shop.view_details}</span>
                    </div>
                  </header>
                </Link>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-16">
              {page > 1 && (
                <Link href={`/${locale}/shop?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([_, v]) => v)), page: String(page - 1) }).toString()}`} className="border border-outline-variant px-5 py-2 text-label-sm font-label-sm hover:border-secondary transition-colors no-underline">
                  Previous
                </Link>
              )}
              <span className="text-label-sm font-label-sm text-on-surface-variant">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <Link href={`/${locale}/shop?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([_, v]) => v)), page: String(page + 1) }).toString()}`} className="border border-outline-variant px-5 py-2 text-label-sm font-label-sm hover:border-secondary transition-colors no-underline">
                  Next
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
