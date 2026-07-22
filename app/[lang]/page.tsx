import type { Metadata } from "next"
import Link from "next/link"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { Section } from "@/components/layout/section"
import {
  CarouselArrow,
  ColorSwatch,
  SizeCard,
  SectionHeading,
} from "@/components/home/home-client"

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
  return (
    <>
      {/* Hero */}
      <header className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto text-white">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight max-w-2xl">
            From Colorful to Timeless
          </h1>
          <p className="font-body-lg text-body-lg mb-10 max-w-lg opacity-90">
            Over 95,000 Hand-Knotted Rugs with Character, curated for the modern
            connoisseur of ancient artistry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/${locale}/shop`}
              className="bg-primary-container text-white px-10 py-5 font-label-md text-label-md transition-all hover:bg-secondary no-underline inline-block text-center"
            >
              {t.home.hero_cta}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="border border-white text-white px-10 py-5 font-label-md text-label-md transition-all hover:bg-white hover:text-primary no-underline inline-block text-center"
            >
              {t.home.our_story_cta}
            </Link>
          </div>
        </div>
      </header>

      {/* Premium Search Bar */}
      <Section background="none">
        <div className="-mt-16 relative z-20 bg-surface-container-lowest shadow-xl p-8 md:p-10 flex flex-col md:flex-row gap-gutter items-center">
          <div className="flex-1 w-full relative">
            <input
              className="w-full bg-transparent border-b border-outline-variant py-3 pl-0 focus:outline-none focus:border-secondary transition-colors font-body-md placeholder:text-on-surface-variant/60"
              placeholder="Search rugs..."
              type="text"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto flex-[2]">
            <select className="bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary font-label-md text-on-surface-variant">
              <option>Size</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
            <select className="bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary font-label-md text-on-surface-variant">
              <option>Color</option>
              <option>Warm</option>
              <option>Cool</option>
              <option>Neutral</option>
            </select>
            <select className="bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary font-label-md text-on-surface-variant">
              <option>Style</option>
              <option>Tribal</option>
              <option>Floral</option>
              <option>Geometric</option>
            </select>
            <select className="bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary font-label-md text-on-surface-variant">
              <option>Origin</option>
              <option>Afghanistan</option>
              <option>Persia</option>
              <option>Turkey</option>
            </select>
          </div>
          <button className="w-full md:w-auto bg-secondary text-white px-12 py-4 font-label-md text-label-md hover:bg-secondary-fixed-dim transition-colors">
            Search
          </button>
        </div>
      </Section>

      {/* Featured Collections */}
      <Section background="none">
        <SectionHeading title="Featured Collections" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {[
            { name: "Persian Rugs", img: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80" },
            { name: "Oriental Rugs", img: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80" },
            { name: "Afghan Rugs", img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80" },
            { name: "Vintage Rugs", img: "https://images.unsplash.com/photo-1595878715977-2e8f8f18e22b?w=800&q=80" },
            { name: "Modern Rugs", img: "https://images.unsplash.com/photo-1602872030218-6c8a1f9c6a8a?w=800&q=80" },
            { name: "Luxury Rugs", img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80" },
          ].map((collection) => (
            <div
              key={collection.name}
              className="relative group h-[500px] overflow-hidden"
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${collection.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white font-headline-sm text-headline-sm">
                  {collection.name}
                </h3>
                <span className="text-white/80 font-label-sm text-label-sm uppercase tracking-widest mt-2 block hover:text-secondary-fixed transition-colors">
                  Explore
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Shop by Interior Style */}
      <Section background="muted">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">
              Shop by Interior Style
            </h2>
            <p className="font-body-md text-on-surface-variant mt-2">
              Curated selections to match your home&apos;s unique personality.
            </p>
          </div>
          <span className="font-label-md text-label-md text-secondary border-b border-secondary">
            View All Styles
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-gutter">
          {["Scandinavian", "Classic", "Minimal", "Bohemian", "Luxury", "Modern"].map(
            (style) => (
              <div key={style} className="group text-center">
                <div className="aspect-[3/4] mb-4 overflow-hidden bg-surface-container-high" />
                <span className="font-label-md text-label-md group-hover:text-secondary transition-colors">
                  {style}
                </span>
              </div>
            ),
          )}
        </div>
      </Section>

      {/* Shop by Room */}
      <Section background="none">
        <h2 className="font-headline-md text-headline-md text-center mb-16">
          Find Your Perfect Space
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter h-[800px]">
          <div className="md:col-span-7 relative overflow-hidden group bg-surface-container-high">
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
              <span className="font-headline-sm text-headline-sm text-white border-b border-white pb-2">
                Living Room
              </span>
            </div>
          </div>
          <div className="md:col-span-5 grid grid-rows-2 gap-gutter">
            <div className="relative overflow-hidden group bg-surface-container-high">
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                <span className="font-headline-sm text-headline-sm text-white border-b border-white pb-2">
                  Bedroom
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden group bg-surface-container-high">
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                <span className="font-headline-sm text-headline-sm text-white border-b border-white pb-2">
                  Dining Room
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Shop by Color & Size */}
      <Section background="muted">
        <div className="grid md:grid-cols-2 gap-24">
          <div>
            <h3 className="font-headline-sm text-headline-sm mb-10">
              Shop by Color
            </h3>
            <div className="grid grid-cols-4 gap-y-8 gap-x-4">
              {[
                { name: "Ivory", color: "#F5F5DC" },
                { name: "Red", color: "#8B0000" },
                { name: "Blue", color: "#000080" },
                { name: "Black", color: "#1A1A1A" },
                { name: "Brown", color: "#5C4033" },
                { name: "Green", color: "#2F4F4F" },
                { name: "Gold", color: "#B88A44" },
                { name: "Gray", color: "#808080" },
              ].map((c) => (
                <ColorSwatch key={c.name} name={c.name} color={c.color} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm mb-10">
              Shop by Size
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <SizeCard label="Runner" size="2&apos;x8&apos; - 3&apos;x12&apos;" />
              <SizeCard label="Small" size="3&apos;x5&apos; - 4&apos;x6&apos;" />
              <SizeCard label="Medium" size="5&apos;x8&apos; - 6&apos;x9&apos;" />
              <SizeCard label="Large" size="8&apos;x10&apos; - 10&apos;x14&apos;" />
              <SizeCard label="Round" size="4&apos; - 10&apos; Dia" />
              <SizeCard label="Square" size="6&apos;x6&apos; - 10&apos;x10&apos;" />
            </div>
          </div>
        </div>
      </Section>

      {/* Best Sellers */}
      <Section background="none">
        <div className="flex justify-between items-center mb-16">
          <h2 className="font-headline-md text-headline-md">Best Sellers</h2>
          <div className="flex gap-4">
            <CarouselArrow direction="left" />
            <CarouselArrow direction="right" />
          </div>
        </div>
        <div className="flex gap-gutter overflow-x-auto pb-10">
          {[
            { category: "Khal Mohammadi", name: "Mahogany Crimson Medallion", size: '8\' 2" x 10\' 5"', material: "100% Hand-spun Wool", price: "€2,450" },
            { category: "Vintage Oushak", name: "Peach Blossom Heritage", size: '9\' 0" x 12\' 0"', material: "Natural Dyes", price: "€3,800" },
            { category: "Tribal Kazak", name: "Indigo Star Geometric", size: '6\' 4" x 9\' 2"', material: "Hand-Knotted", price: "€1,650" },
            { category: "Persian Nain", name: "Ivory Sapphire Silk Blend", size: '10\' x 14\'', material: "6-La Fine Silk", price: "€7,200" },
          ].map((product) => (
            <div key={product.name} className="min-w-[320px] group">
              <div className="relative overflow-hidden aspect-[4/5] mb-6 bg-surface-container-high">
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors z-10">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="space-y-1">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                  {product.category}
                </p>
                <h4 className="font-body-lg text-body-lg font-semibold">
                  {product.name}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {product.size} &bull; {product.material}
                </p>
                <p className="font-headline-sm text-headline-sm text-secondary mt-2">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Why Afghan Tappeti */}
      <Section background="none">
        <div className="border-y border-outline-variant py-section-gap grid md:grid-cols-3 gap-gutter">
          <div className="text-center space-y-4 px-8">
            <div className="text-secondary text-5xl font-headline-sm">✦</div>
            <h3 className="font-headline-sm text-headline-sm">Authentic Handmade</h3>
            <p className="font-body-md text-on-surface-variant">
              Every rug in our collection is a unique masterpiece, hand-knotted by artisans using techniques passed down through generations.
            </p>
          </div>
          <div className="text-center space-y-4 px-8">
            <div className="text-secondary text-5xl font-headline-sm">◈</div>
            <h3 className="font-headline-sm text-headline-sm">Curated Collection</h3>
            <p className="font-body-md text-on-surface-variant">
              With over 95,000 pieces, we offer the world&apos;s most extensive curated selection of high-end rugs.
            </p>
          </div>
          <div className="text-center space-y-4 px-8">
            <div className="text-secondary text-5xl font-headline-sm">🌐</div>
            <h3 className="font-headline-sm text-headline-sm">Worldwide Shipping</h3>
            <p className="font-body-md text-on-surface-variant">
              We bring the bazaar to your doorstep with white-glove, insured shipping to over 150 countries.
            </p>
          </div>
        </div>
      </Section>

      {/* Our Story */}
      <Section background="none">
        <div className="grid md:grid-cols-2 items-center gap-24">
          <div className="relative">
            <div className="w-full aspect-square bg-surface-container-high shadow-2xl" />
            <div className="absolute -bottom-10 -right-10 bg-secondary p-12 hidden lg:block">
              <p className="text-white font-display-lg text-4xl">Since 1924</p>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg leading-tight">
              A Legacy of Knots
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Afghan Tappeti was born from a passion for the loom and a commitment
              to preserving the nomadic heritage of Central Asia.
            </p>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Today, we bridge the gap between ancient craftsmanship and contemporary
              luxury, sourcing directly from weaving families.
            </p>
            <Link
              href={`/${locale}/about`}
              className="font-label-md text-label-md text-primary border-b-2 border-secondary pb-1 mt-4 hover:opacity-70 transition-opacity no-underline inline-block"
            >
              {t.home.our_story_cta}
            </Link>
          </div>
        </div>
      </Section>

      {/* Customer Reviews */}
      <Section background="muted">
        <h2 className="font-headline-md text-headline-md text-center mb-16">
          Trusted by Interior Designers
        </h2>
        <div className="grid md:grid-cols-3 gap-gutter">
          {[
            {
              name: "Eleanor Vance",
              title: "Interior Architect, London",
              text: "The Khal Mohammadi rug I received is even more stunning in person. The depth of color is unlike anything found in mass-produced pieces. It has completely transformed our living space.",
            },
            {
              name: "Julian Rossi",
              title: "Senior Designer, Milan",
              text: "Incredible curation. Finding authentic vintage Oushaks in this condition is a rarity. Afghan Tappeti is now my go-to for all my high-end residential projects.",
            },
            {
              name: "Sarah Jenkins",
              title: "Art Collector, NYC",
              text: "The white-glove delivery to New York was seamless. The rug was packaged with extreme care. It's truly a piece of history on our floor.",
            },
          ].map((review) => (
            <div
              key={review.name}
              className="bg-surface-container-lowest p-10 shadow-sm space-y-6"
            >
              <div className="flex text-secondary gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="font-body-md text-body-md italic leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <div>
                <p className="font-label-md text-label-md font-bold">
                  {review.name}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {review.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Instagram Gallery */}
      <Section background="none">
        <div className="text-center mb-16">
          <h2 className="font-headline-md text-headline-md">
            At Home with #AfghanTappeti
          </h2>
          <p className="font-body-md text-on-surface-variant mt-2">
            Tag us to be featured in our lifestyle gallery.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-surface-container-high overflow-hidden group" />
          ))}
        </div>
      </Section>

      {/* Newsletter */}
      <Section background="none">
        <div className="bg-primary-container text-white text-center py-section-gap px-margin-mobile">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="font-headline-md text-headline-md">
              Become Part of the Afghan Tappeti Family
            </h2>
            <p className="font-body-lg text-body-lg opacity-80">
              Subscribe to receive exclusive collection previews, artisan stories,
              and interior design inspiration.
            </p>
            <div className="relative max-w-md mx-auto">
              <input
                className="w-full bg-transparent border-b border-white/30 py-4 focus:outline-none focus:border-secondary transition-colors font-body-md text-center placeholder:text-white/40"
                placeholder="Email address"
                type="email"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-secondary hover:text-white transition-colors text-3xl">
                →
              </button>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
