import type { Metadata } from "next"
import Link from "next/link"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { getProductImageUrl } from "@/lib/supabase/storage"
import { ShopSort } from "@/components/shop/shop-sort"

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
    supabase.from("origins").select("id, name").order("name"),
    supabase.from("materials").select("id, name").order("name"),
    supabase.from("sizes").select("id, name").order("display_order"),
    supabase.from("colors").select("id, name, hex_code").order("name"),
  ])

  let query = supabase
    .from("products")
    .select("id, name, slug, sku, price, sale_price, short_description, origin_id, material_id, primary_color_id, size_id")
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

  const { data: products } = await query

  const ids = (products ?? []).map((p) => p.id)
  const { data: productImages } = await supabase
    .from("product_images")
    .select("product_id, image_url")
    .in("product_id", ids.length > 0 ? ids : ["00000000-0000-0000-0000-000000000000"])
    .eq("display_order", 0)

  const imageMap = new Map<string, string>()
  for (const img of productImages ?? []) {
    imageMap.set(img.product_id, img.image_url)
  }

  const selOrigin = (sp.origin as string)?.split(",").filter(Boolean) ?? []
  const selMaterial = (sp.material as string)?.split(",").filter(Boolean) ?? []
  const selColor = (sp.color as string)?.split(",").filter(Boolean) ?? []
  const selSize = (sp.size as string)?.split(",").filter(Boolean) ?? []

  return (
    <>
      <nav className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex py-8 gap-2 items-center text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">
        <span className="text-primary font-bold">{t.shop.title}</span>
      </nav>

      <header className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap max-w-4xl">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight">{t.shop.hero_title}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">{t.shop.hero_subtitle}</p>
      </header>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row gap-gutter">
        <aside className="md:w-1/4 md:sticky md:top-32 h-fit pb-10">
          <form method="GET" className="space-y-10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm">{t.shop.filters}</h3>
              <Link href={`/${locale}/shop`} className="text-label-sm font-label-sm text-secondary uppercase no-underline">{t.shop.clear_all}</Link>
            </div>

            <div>
              <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">{t.shop.filter_origin}</h4>
              <div className="space-y-3">
                {origins.data?.map((o) => (
                  <label key={o.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="origin" value={o.id} defaultChecked={selOrigin.includes(o.id)} className="rounded border-outline-variant text-primary focus:ring-secondary w-4 h-4" />
                    <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">{o.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">{t.shop.filter_material}</h4>
              <div className="space-y-3">
                {materials.data?.map((m) => (
                  <label key={m.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="material" value={m.id} defaultChecked={selMaterial.includes(m.id)} className="rounded border-outline-variant text-primary focus:ring-secondary w-4 h-4" />
                    <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">{m.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">{t.shop.filter_color}</h4>
              <div className="flex flex-wrap gap-3">
                {colors.data?.map((c) => (
                  <label key={c.id} className="cursor-pointer">
                    <input type="checkbox" name="color" value={c.id} defaultChecked={selColor.includes(c.id)} className="sr-only peer" />
                    <span
                      className="w-8 h-8 rounded-full border-2 block peer-checked:border-secondary transition-all"
                      style={{ backgroundColor: c.hex_code || "#ccc" }}
                      title={c.name}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">{t.shop.filter_size}</h4>
              <div className="grid grid-cols-2 gap-2">
                {sizes.data?.map((s) => (
                  <label key={s.id} className={`border text-center cursor-pointer text-label-sm font-label-sm hover:border-secondary transition-colors ${selSize.includes(s.id) ? "border-secondary bg-secondary-container text-on-secondary-container" : "border-outline-variant"}`}>
                    <input type="checkbox" name="size" value={s.id} defaultChecked={selSize.includes(s.id)} className="sr-only" />
                    <span className="block px-3 py-2">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="flex-1 bg-primary text-on-primary px-4 py-3 rounded-lg text-label-sm hover:bg-primary-fixed-dim transition-colors">"Apply"</button>
            </div>
          </form>
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
            <p className="font-body-md text-on-surface-variant italic">{t.shop.showing}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
            {(!products || products.length === 0) && (
              <p className="col-span-full text-center font-body-md text-on-surface-variant py-12">{t.shop.no_results}</p>
            )}
            {products?.map((product) => {
              const imgUrl = getProductImageUrl(imageMap.get(product.id))
              return (
                <Link key={product.id} href={`/${locale}/product/${product.slug}`} className="group no-underline">
                  <div className="relative overflow-hidden mb-6 aspect-[3/4] bg-cover bg-center" style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : undefined}>
                    <button onClick={(e) => e.preventDefault()} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-primary hover:text-secondary transition-colors z-10">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </button>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                  </div>
                  <header>
                    <h3 className="font-headline-sm text-[20px] mb-1 group-hover:text-secondary transition-colors">{product.name}</h3>
                    <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-3">{product.sku}</p>
                    <div className="flex justify-between items-end">
                      <p className="font-headline-sm text-headline-sm text-primary">€{(product.sale_price ?? product.price).toLocaleString()}</p>
                      <span className="text-label-sm font-label-sm text-secondary underline decoration-1 underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{t.shop.view_details}</span>
                    </div>
                  </header>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}
