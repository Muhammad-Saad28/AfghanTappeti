import type { Metadata } from "next"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"


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

const products = [
  { name: "The Royal Isfahan", category: "Persian", size: "8' x 10' • Hand-Spun Wool", price: "€12,400" },
  { name: "Medallion Silk Tabriz", category: "Persian", size: "9' x 12' • Pure Silk", price: "€18,900" },
  { name: "Nomadic Shadow Kashan", category: "Persian", size: "6' x 9' • Organic Wool", price: "€7,800" },
  { name: "The Heritage Herati", category: "Persian", size: "8' x 10' • Hand-Spun Wool", price: "€14,200" },
  { name: "Tribal Gabbeh Abstract", category: "Persian", size: "5' x 7' • Hand-Tufted Wool", price: "€4,500" },
  { name: "Qum Silk Tree of Life", category: "Persian", size: "4' x 6' • Rare Pure Silk", price: "€21,000" },
]

export default async function ShopPage() {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex py-8 gap-2 items-center text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">
        <span className="text-primary font-bold">All Rugs</span>
      </nav>

      {/* Editorial Header */}
      <header className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap max-w-4xl">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight">
          Our Collection
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
          Discover hand-knotted masterpieces from the weaving capitals of Persia,
          Afghanistan, and Turkey. Each rug carries a story waiting to grace your home.
        </p>
      </header>

      {/* Layout Wrapper */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row gap-gutter">
        {/* Filter Sidebar */}
        <aside className="md:w-1/4 md:sticky md:top-32 h-fit pb-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant">
            <h3 className="font-headline-sm text-headline-sm">Filters</h3>
            <button className="text-label-sm font-label-sm text-secondary uppercase">Clear All</button>
          </div>
          <div className="space-y-10">
            <div>
              <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">Origin</h4>
              <div className="space-y-3">
                {["Persia", "Afghanistan", "Turkey", "India"].map((o) => (
                  <label key={o} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-secondary w-4 h-4" />
                    <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">{o}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">Material</h4>
              <div className="space-y-3">
                {["Silk & Wool Blend", "100% Organic Wool", "Pure Silk", "Viscose"].map((m) => (
                  <label key={m} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-secondary w-4 h-4" />
                    <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">{m}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">Color</h4>
              <div className="flex flex-wrap gap-3">
                {["#2C241D", "#B88A44", "#D1CDC7", "#722F37", "#1A2E35"].map((c) => (
                  <button key={c} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-secondary transition-all" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">Size</h4>
              <div className="grid grid-cols-2 gap-2">
                {["6' x 9'", "8' x 10'", "9' x 12'", "Runner"].map((s) => (
                  <button key={s} className="border border-outline-variant px-3 py-2 text-label-sm font-label-sm hover:border-secondary transition-colors text-center">{s}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-label-md text-label-md uppercase tracking-wider mb-4">Price Range</h4>
              <input type="range" min="1000" max="25000" step="500" className="w-full h-1 bg-outline-variant appearance-none cursor-pointer accent-secondary" />
              <div className="flex justify-between mt-2 text-label-sm font-label-sm text-on-surface-variant">
                <span>€1,000</span>
                <span>€25,000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="md:w-3/4">
          <div className="flex justify-between items-center mb-8">
            <p className="font-body-md text-on-surface-variant italic">Showing 48 exquisite pieces</p>
            <div className="flex items-center gap-4">
              <span className="text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant">Sort By</span>
              <select className="bg-transparent border-none font-label-md text-label-md focus:ring-0 cursor-pointer">
                <option>New Arrivals</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
            {products.map((product) => (
              <article key={product.name} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-6 bg-surface-container-low aspect-[3/4]">
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-primary hover:text-secondary transition-colors z-10">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                </div>
                <header>
                  <h3 className="font-headline-sm text-[20px] mb-1 group-hover:text-secondary transition-colors">{product.name}</h3>
                  <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-3">{product.size}</p>
                  <div className="flex justify-between items-end">
                    <p className="font-headline-sm text-headline-sm text-primary">{product.price}</p>
                    <span className="text-label-sm font-label-sm text-secondary underline decoration-1 underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity uppercase">View Details</span>
                  </div>
                </header>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <nav className="flex justify-center items-center mt-section-gap gap-4">
            <button className="w-12 h-12 flex items-center justify-center border border-outline-variant hover:border-primary transition-colors">←</button>
            {[1, 2, 3].map((p) => (
              <button key={p} className={`w-12 h-12 flex items-center justify-center border font-label-md ${p === 1 ? 'border-primary bg-primary text-white' : 'border-outline-variant hover:border-primary transition-colors'}`}>{p}</button>
            ))}
            <span className="px-2">...</span>
            <button className="w-12 h-12 flex items-center justify-center border border-outline-variant hover:border-primary transition-colors font-label-md">8</button>
            <button className="w-12 h-12 flex items-center justify-center border border-outline-variant hover:border-primary transition-colors">→</button>
          </nav>
        </section>
      </div>
    </>
  )
}
