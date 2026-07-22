import type { Metadata } from "next"
import Link from "next/link"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { getProductImageUrl } from "@/lib/supabase/storage"
import { Section } from "@/components/layout/section"
import {
  CarouselArrow,
  ColorSwatch,
  SizeCard,
  SectionHeading,
} from "@/components/home/home-client"
import { NewsletterForm } from "@/components/home/newsletter-form"

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

  const { data: bestSellers } = await supabase
    .from("products")
    .select("id, name, slug, sku, price, sale_price, is_best_seller, is_featured")
    .is("deleted_at", null)
    .eq("is_active", true)
    .order("is_best_seller", { ascending: false })
    .limit(8)

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

  const { data: randomImages } = await supabase
    .from("product_images")
    .select("image_url")
    .order("display_order")
    .limit(30)

  const randomUrls = (randomImages ?? []).map((i) => getProductImageUrl(i.image_url)).filter(Boolean)
  function pick(idx: number) {
    return randomUrls[idx % randomUrls.length] || ""
  }

  return (
    <>
      <header className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto text-white">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight max-w-2xl">{t.home.hero_title_line1}</h1>
          <p className="font-body-lg text-body-lg mb-10 max-w-lg opacity-90">{t.home.hero_subtitle_line1}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/shop`} className="bg-primary-container text-white px-10 py-5 font-label-md text-label-md transition-all hover:bg-secondary no-underline inline-block text-center">{t.home.hero_cta}</Link>
            <Link href={`/${locale}/about`} className="border border-white text-white px-10 py-5 font-label-md text-label-md transition-all hover:bg-white hover:text-primary no-underline inline-block text-center">{t.home.our_story_cta}</Link>
          </div>
        </div>
      </header>

      <Section background="none">
        <form method="GET" action={`/${locale}/shop`} className="-mt-16 relative z-20 bg-surface-container-lowest shadow-xl p-8 md:p-10 flex flex-col md:flex-row gap-gutter items-center">
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
          <button type="submit" className="w-full md:w-auto bg-secondary text-white px-12 py-4 font-label-md text-label-md hover:bg-secondary-fixed-dim transition-colors">{t.home.search_cta}</button>
        </form>
      </Section>

      <Section background="none">
        <SectionHeading title={t.home.featured_collections} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {["persian", "oriental", "afghan", "vintage", "modern", "luxury"].map((key, i) => (
            <div key={key} className="relative group h-[500px] overflow-hidden">
              <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${pick(i)})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white font-headline-sm text-headline-sm">{t.home[`collection_${key}` as keyof typeof t.home]}</h3>
                <span className="text-white/80 font-label-sm text-label-sm uppercase tracking-widest mt-2 block hover:text-secondary-fixed transition-colors">{t.home.explore}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section background="muted">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">{t.home.shop_by_style}</h2>
            <p className="font-body-md text-on-surface-variant mt-2">{t.home.shop_by_style_desc}</p>
          </div>
          <span className="font-label-md text-label-md text-secondary border-b border-secondary">{t.home.view_all_styles}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-gutter">
          {["scandinavian", "classic", "minimal", "bohemian", "luxury", "modern"].map((s, i) => (
            <div key={s} className="group text-center">
              <div className="aspect-[3/4] mb-4 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${pick(6 + i)})` }} />
              <span className="font-label-md text-label-md group-hover:text-secondary transition-colors">{t.home[`style_${s}` as keyof typeof t.home]}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section background="none">
        <h2 className="font-headline-md text-headline-md text-center mb-16">{t.home.find_your_space}</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-[800px]">
          <div className="md:col-span-7 relative overflow-hidden group bg-cover bg-center" style={{ backgroundImage: `url(${pick(12)})` }}>
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
              <span className="font-headline-sm text-headline-sm text-white border-b border-white pb-2">{t.home.room_living}</span>
            </div>
          </div>
          <div className="md:col-span-5 grid grid-rows-2 gap-gutter">
            <div className="relative overflow-hidden group bg-cover bg-center" style={{ backgroundImage: `url(${pick(13)})` }}>
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                <span className="font-headline-sm text-headline-sm text-white border-b border-white pb-2">{t.home.room_bedroom}</span>
              </div>
            </div>
            <div className="relative overflow-hidden group bg-cover bg-center" style={{ backgroundImage: `url(${pick(14)})` }}>
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                <span className="font-headline-sm text-headline-sm text-white border-b border-white pb-2">{t.home.room_dining}</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section background="muted">
        <div className="grid md:grid-cols-2 gap-24">
          <div>
            <h3 className="font-headline-sm text-headline-sm mb-10">{t.home.shop_by_color}</h3>
            <div className="grid grid-cols-4 gap-y-8 gap-x-4">
              {[{ key: "ivory", hex: "#F5F5DC" }, { key: "red", hex: "#8B0000" }, { key: "blue", hex: "#000080" }, { key: "black", hex: "#1A1A1A" }, { key: "brown", hex: "#5C4033" }, { key: "green", hex: "#2F4F4F" }, { key: "gold", hex: "#B88A44" }, { key: "gray", hex: "#808080" }].map((c) => (
                <ColorSwatch key={c.key} name={t.home[`color_${c.key}` as keyof typeof t.home]} color={c.hex} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm mb-10">{t.home.shop_by_size}</h3>
            <div className="grid grid-cols-3 gap-4">
              <SizeCard label={t.home.size_runner} size="2'x8' - 3'x12'" />
              <SizeCard label={t.home.size_small} size="3'x5' - 4'x6'" />
              <SizeCard label={t.home.size_medium} size="5'x8' - 6'x9'" />
              <SizeCard label={t.home.size_large} size="8'x10' - 10'x14'" />
              <SizeCard label={t.home.size_round} size="4' - 10' Dia" />
              <SizeCard label={t.home.size_square} size="6'x6' - 10'x10'" />
            </div>
          </div>
        </div>
      </Section>

      <Section background="none">
        <div className="flex justify-between items-center mb-16">
          <h2 className="font-headline-md text-headline-md">{t.home.best_sellers}</h2>
          <div className="flex gap-4">
            <CarouselArrow direction="left" />
            <CarouselArrow direction="right" />
          </div>
        </div>
        <div className="flex gap-gutter overflow-x-auto pb-10">
          {(bestSellers ?? []).slice(0, 4).map((product) => {
            const imgUrl = getProductImageUrl(primaryMap.get(product.id))
            return (
              <Link key={product.id} href={`/${locale}/product/${product.slug}`} className="min-w-[320px] group no-underline">
                <div className="relative overflow-hidden aspect-[4/5] mb-6 bg-cover bg-center" style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : undefined}>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors z-10">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">{product.sku}</p>
                  <h4 className="font-body-lg text-body-lg font-semibold">{product.name}</h4>
                  <p className="font-headline-sm text-headline-sm text-secondary mt-2">€{(product.sale_price ?? product.price).toLocaleString()}</p>
                </div>
              </Link>
            )
          })}
        </div>
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
            <div className="w-full aspect-square bg-cover bg-center shadow-2xl" style={{ backgroundImage: `url(${pick(15)})` }} />
            <div className="absolute -bottom-10 -right-10 bg-secondary p-12 hidden lg:block">
              <p className="text-white font-display-lg text-4xl">{t.home.since}</p>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg leading-tight">{t.home.legacy_title}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{t.home.legacy_text1}</p>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{t.home.legacy_text2}</p>
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
        <div className="text-center mb-16">
          <h2 className="font-headline-md text-headline-md">{t.home.instagram_title}</h2>
          <p className="font-body-md text-on-surface-variant mt-2">{t.home.instagram_text}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="aspect-square bg-cover bg-center overflow-hidden group" style={{ backgroundImage: `url(${pick(16 + i)})` }} />))}
        </div>
      </Section>

      <Section background="none">
        <div className="bg-primary-container text-white text-center py-section-gap px-margin-mobile">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="font-headline-md text-headline-md">{t.home.newsletter_title}</h2>
            <p className="font-body-lg text-body-lg opacity-80">{t.home.newsletter_subtitle}</p>
            <NewsletterForm placeholder={t.home.newsletter_placeholder} cta={t.home.newsletter_cta} />
          </div>
        </div>
      </Section>
    </>
  )
}
