import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { getProductImageUrl } from "@/lib/supabase/storage"
import { Section } from "@/components/layout/section"
import {
  BestSellersCarousel,
  ColorSwatch,
  SizeCard,
  SectionHeading,
} from "@/components/home/home-client"
import { NewsletterForm } from "@/components/home/newsletter-form"
import { roundPrice } from "@/lib/utils"
import { WishlistButton } from "@/components/home/wishlist-button"
import { localizeRow } from "@/lib/localize"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)
  return {
    title: "Afghan Tappeti | From Colorful to Timeless",
    description: t.home.hero_subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        en: `${siteUrl}/en`,
        it: `${siteUrl}/it`,
        "x-default": `${siteUrl}/en`,
      },
    },
    openGraph: {
      title: "Afghan Tappeti | From Colorful to Timeless",
      description: t.home.hero_subtitle,
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const supabase = await createClient()

  const { data: sultaniGabahCategory } = await supabase
    .from("categories")
    .select("id")
    .eq("name", "Sultani Gabah")
    .single()

  let bestSellers
  if (sultaniGabahCategory) {
    const { data: productIds } = await supabase
      .from("product_categories")
      .select("product_id")
      .eq("category_id", sultaniGabahCategory.id)

    const sgIds = (productIds ?? []).map((r) => r.product_id)

    if (sgIds.length > 0) {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, sku, price, sale_price, translations, sizes(name, width_cm, length_cm, translations)")
        .is("deleted_at", null)
        .eq("is_active", true)
        .in("id", sgIds)
        .limit(8)
      bestSellers = data
    }
  }

  if (!bestSellers || bestSellers.length === 0) {
    const { data } = await supabase
      .from("products")
      .select("id, name, slug, sku, price, sale_price, translations, sizes(name, width_cm, length_cm, translations)")
      .is("deleted_at", null)
      .eq("is_active", true)
      .eq("is_best_seller", true)
      .limit(8)
    bestSellers = data
  }

  const productIds = bestSellers?.map((p) => p.id) ?? []

  const { data: allImages } = await supabase
    .from("product_images")
    .select("product_id, image_url, display_order")
    .in("product_id", productIds.length > 0 ? productIds : ["00000000-0000-0000-0000-000000000000"])
    .order("display_order")

  const primaryMap = new Map<string, string>()
  for (const img of allImages ?? []) {
    if (!primaryMap.has(img.product_id)) {
      primaryMap.set(img.product_id, img.image_url)
    }
  }

  const categoryImageMap: Record<string, string> = {
    "afghan-rugs": "/AfghanRugs.jpeg",
    "persian-rugs": "/afghankilims.jpeg",
    "afghan-kilim": "/modernluxurykilims.jpeg",
    "vintage-rugs": "/persianvintage.jpeg",
    "modern-rugs": "/modernluxurykilims.jpeg",
  }

  const styleImages = [
    "/images/home/style_scandinavian.jpg",
    "/images/home/style_classic.jpg",
    "/images/home/style_minimal.jpg",
    "/images/home/style_bohemian.jpg",
    "/images/home/style_luxury.jpg",
    "/images/home/style_modern.jpg",
  ]

  const roomImages = [
    "/images/home/style_modern.jpg",
    "/images/home/room_living.jpg",
    "/images/home/collection_6.jpg",
  ]

  const storyImage = "/legacyofknots.jpeg"

  const { data: colors } = await supabase.from("colors").select("id, name, hex_code, translations").order("display_order")
  const { data: sizes } = await supabase.from("sizes").select("id, name, translations").order("display_order")
  const { data: allCategories } = await supabase.from("categories").select("id, name, slug, image, translations, product_categories(id)").order("display_order").limit(20)

  const categoriesWithProducts = (allCategories ?? []).filter((c) => c.product_categories && c.product_categories.length > 0).slice(0, 6)

  const localizedCategories = (categoriesWithProducts ?? []).map((c) => localizeRow(c, locale))
  const localizedColors = (colors ?? []).map((c) => localizeRow(c, locale))
  const localizedSizes = (sizes ?? []).map((s) => localizeRow(s, locale))
  const localizedBestSellers = (bestSellers ?? []).map((p) => localizeRow(p, locale))

  return (
    <>
      <header className="relative h-[80vh] min-h-[600px] md:h-screen flex items-end md:items-center overflow-hidden pt-20 md:pt-0">
        <div className="absolute inset-0 z-0">
          <Image src="/images/home/hero.jpg" alt="Afghan Tappeti" fill priority className="object-contain" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </div>
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto text-white pb-16 md:pb-0">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4 leading-tight max-w-2xl drop-shadow-lg">{t.home.hero_title_line1}</h1>
          <p className="font-body-lg text-body-lg mb-8 max-w-lg opacity-95 drop-shadow">{t.home.hero_subtitle_line1}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/shop`} className="bg-secondary text-white px-6 py-3 md:px-10 md:py-5 font-label-md text-label-md transition-all hover:bg-secondary-fixed-dim no-underline inline-block text-center shadow-lg">{t.home.hero_cta}</Link>
            <Link href={`/${locale}/about`} className="border-2 border-white/80 text-white px-6 py-3 md:px-10 md:py-5 font-label-md text-label-md transition-all hover:bg-white hover:text-primary hover:border-white no-underline inline-block text-center backdrop-blur-sm">{t.home.our_story_cta}</Link>
          </div>
        </div>
      </header>

      <Section background="none">
        <form method="GET" action={`/${locale}/shop`} className="-mt-16 relative z-20 bg-surface-container-lowest shadow-xl p-4 md:p-8 lg:p-10 flex flex-col md:flex-row gap-gutter items-center">
          <div className="flex-1 w-full relative">
            <input name="q" className="w-full bg-transparent border-b border-outline-variant py-3 pl-0 focus:outline-none focus:border-secondary transition-colors font-body-md placeholder:text-on-surface-variant/60" placeholder={t.home.search_placeholder} type="text" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto flex-[2]">
            <select name="size" className="bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary font-label-md text-on-surface-variant">
              <option value="">{t.home.search_size}</option>
              <option value="small">{t.home.search_small}</option>
              <option value="medium">{t.home.search_medium}</option>
              <option value="large">{t.home.search_large}</option>
            </select>
            <select name="color" className="bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary font-label-md text-on-surface-variant">
              <option value="">{t.home.search_color}</option>
              <option value="warm">{t.home.search_warm}</option>
              <option value="cool">{t.home.search_cool}</option>
              <option value="neutral">{t.home.search_neutral}</option>
            </select>
            <select name="style" className="bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary font-label-md text-on-surface-variant">
              <option value="">{t.home.search_style}</option>
              <option value="tribal">{t.home.search_tribal}</option>
              <option value="floral">{t.home.search_floral}</option>
              <option value="geometric">{t.home.search_geometric}</option>
            </select>
            <select name="origin" className="bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary font-label-md text-on-surface-variant">
              <option value="">{t.home.search_origin}</option>
              <option value="afghanistan">{t.home.search_afghanistan}</option>
              <option value="persia">{t.home.search_persia}</option>
              <option value="turkey">{t.home.search_turkey}</option>
            </select>
          </div>
          <button type="submit" className="w-full md:w-auto bg-secondary text-white px-6 py-3 md:px-12 md:py-4 font-label-md text-label-md hover:bg-secondary-fixed-dim transition-colors">{t.home.search_cta}</button>
        </form>
      </Section>

      <Section background="none">
        <SectionHeading title={t.home.featured_collections} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {(localizedCategories).map((cat, index) => {
            const fallbackImages = [
              "/AfghanRugs.jpeg",
              "/afghankilims.jpeg",
              "/persianvintage.jpeg",
              "/modernluxurykilims.jpeg",
            ]
            const bgImage = cat.image || categoryImageMap[cat.slug] || fallbackImages[index % fallbackImages.length]
            
            return (
              <Link key={cat.id} href={`/${locale}/category/${cat.slug}`} className="relative group h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden no-underline block">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-white font-headline-sm text-headline-sm">{cat.name}</h3>
                  <span className="text-white/80 font-label-sm text-label-sm uppercase tracking-widest mt-2 block hover:text-secondary-fixed transition-colors">{t.home.explore}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </Section>
      
      <Section background="muted">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">{t.home.shop_by_style}</h2>
            <p className="font-body-md text-on-surface-variant mt-2">{t.home.shop_by_style_desc}</p>
          </div>
          <Link href={`/${locale}/styles`} className="font-label-md text-label-md text-secondary border-b border-secondary no-underline">{t.home.view_all_styles}</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-gutter">
          {["scandinavian", "classic", "minimal", "bohemian", "luxury", "modern"].map((s, i) => (
            <div key={s} className="group text-center">
              <div className="aspect-[3/4] mb-4 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${styleImages[i]})` }} />
              <span className="font-label-md text-label-md group-hover:text-secondary transition-colors">{t.home[`style_${s}` as keyof typeof t.home]}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section background="none">
        <h2 className="font-headline-md text-headline-md text-center mb-16">{t.home.find_your_space}</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-auto md:h-[600px] lg:h-[800px]">
          <div className="md:col-span-7 relative overflow-hidden group bg-cover bg-center" style={{ backgroundImage: `url(${roomImages[0]})` }}>
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
              <span className="font-headline-sm text-headline-sm text-white border-b border-white pb-2">{t.home.room_living}</span>
            </div>
          </div>
          <div className="md:col-span-5 grid grid-rows-2 gap-gutter">
            <div className="relative overflow-hidden group bg-cover bg-center" style={{ backgroundImage: `url(${roomImages[1]})` }}>
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                <span className="font-headline-sm text-headline-sm text-white border-b border-white pb-2">{t.home.room_bedroom}</span>
              </div>
            </div>
            <div className="relative overflow-hidden group bg-cover bg-center" style={{ backgroundImage: `url(${roomImages[2]})` }}>
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                <span className="font-headline-sm text-headline-sm text-white border-b border-white pb-2">{t.home.room_dining}</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section background="muted">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24">
          <div>
            <h3 className="font-headline-sm text-headline-sm mb-10">{t.home.shop_by_color}</h3>
            <div className="grid grid-cols-4 gap-y-8 gap-x-4">
              {(localizedColors).map((c) => (
                <ColorSwatch key={c.id} name={c.name} color={c.hex_code || "#ccc"} href={`/${locale}/shop?color=${c.id}`} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm mb-10">{t.home.shop_by_size}</h3>
            <div className="grid grid-cols-3 gap-4">
              {(localizedSizes).slice(0, 12).map((s) => (
                <SizeCard key={s.id} label={s.name} size="" href={`/${locale}/shop?size=${s.id}`} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section background="none">
        <h2 className="font-headline-md text-headline-md mb-6">{t.home.best_sellers}</h2>
        <BestSellersCarousel>
          {(localizedBestSellers).slice(0, 4).map((product) => {
            const imgUrl = getProductImageUrl(primaryMap.get(product.id))
            return (
              <Link key={product.id} href={`/${locale}/product/${product.slug}`} className="min-w-[320px] group no-underline">
                <div className="relative overflow-hidden aspect-[4/5] mb-6 bg-surface-container-low">
                  {imgUrl && <Image src={imgUrl} alt={product.name} fill unoptimized className="object-contain" sizes="320px" />}
                  <WishlistButton slug={product.slug} />
                </div>
                <div className="space-y-1">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">{product.sku}</p>
                  <h4 className="font-body-lg text-body-lg font-semibold">{product.name}</h4>
                  {product.sizes && <p className="font-label-sm text-label-sm text-on-surface-variant">{(product.sizes as any)?.name ?? (Array.isArray(product.sizes) ? product.sizes[0]?.name : null)}</p>}
                  <p className="font-headline-sm text-headline-sm text-secondary mt-2">€{roundPrice(product.sale_price ?? product.price).toLocaleString()}</p>
                </div>
              </Link>
            )
          })}
        </BestSellersCarousel>
      </Section>

      <Section background="none">
        <div className="border-y border-outline-variant py-section-gap grid md:grid-cols-3 gap-gutter">
          <div className="text-center space-y-4 px-8">
            <div className="text-secondary text-5xl font-headline-sm">✦</div>
            <h3 className="font-headline-sm text-headline-sm">{t.home.authentic_handmade}</h3>
            <p className="font-body-md text-on-surface-variant">{t.home.authentic_handmade_desc}</p>
          </div>
          <div className="text-center space-y-4 px-8">
            <div className="text-secondary text-5xl font-headline-sm">◈</div>
            <h3 className="font-headline-sm text-headline-sm">{t.home.curated_collection}</h3>
            <p className="font-body-md text-on-surface-variant">{t.home.curated_collection_desc}</p>
          </div>
          <div className="text-center space-y-4 px-8">
            <div className="text-secondary text-5xl font-headline-sm">🌐</div>
            <h3 className="font-headline-sm text-headline-sm">{t.home.worldwide_shipping}</h3>
            <p className="font-body-md text-on-surface-variant">{t.home.worldwide_shipping_desc}</p>
          </div>
        </div>
      </Section>

      <Section background="none">
        <div className="grid md:grid-cols-2 items-center gap-24">
          <div className="relative">
            <div className="w-full aspect-square bg-contain bg-no-repeat bg-center shadow-2xl" style={{ backgroundImage: `url(${storyImage})` }} />
            <div className="absolute -bottom-10 -right-10 bg-secondary p-12 hidden lg:block">
              <p className="text-white font-display-lg text-4xl">{t.home.since}</p>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg leading-tight">{t.home.legacy_title}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-justify">{t.home.legacy_text1}</p>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-justify">{t.home.legacy_text2}</p>
            <Link href={`/${locale}/about`} className="font-label-md text-label-md text-primary border-b-2 border-secondary pb-1 mt-4 hover:opacity-70 transition-opacity no-underline inline-block">{t.home.our_story_cta}</Link>
          </div>
        </div>
      </Section>

      <Section background="muted">
        <h2 className="font-headline-md text-headline-md text-center mb-16">{t.home.trusted_by}</h2>
        <div className="grid md:grid-cols-3 gap-gutter">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-lowest p-10 shadow-sm space-y-6">
              <div className="flex text-secondary gap-0.5">{Array.from({ length: 5 }).map((_, j) => (<span key={j}>★</span>))}</div>
              <p className="font-body-md text-body-md italic leading-relaxed">&ldquo;{t.home[`review_${i}_text` as keyof typeof t.home]}&rdquo;</p>
              <div>
                <p className="font-label-md text-label-md font-bold">{t.home[`review_${i}_name` as keyof typeof t.home]}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{t.home[`review_${i}_title` as keyof typeof t.home]}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section background="none">
        <div className="bg-primary-container text-white text-center py-section-gap px-margin-mobile">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="font-headline-md text-headline-md text-white">{t.home.newsletter_title}</h2>
            <p className="font-body-lg text-body-lg text-white/80">{t.home.newsletter_subtitle}</p>
            <NewsletterForm placeholder={t.home.newsletter_placeholder} cta={t.home.newsletter_cta} />
          </div>
        </div>
      </Section>
    </>
  )
}
