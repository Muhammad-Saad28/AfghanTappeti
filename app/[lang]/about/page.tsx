import type { Metadata } from "next"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { Section } from "@/components/layout/section"

export async function generateMetadata({
  params: _params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await _params
  const t = await getDictionary(lang as Locale)
  return {
    title: t.about.hero_title,
    description: t.about.heritage_text.substring(0, 160),
    alternates: {
      canonical: `${siteUrl}/${lang}/about`,
      languages: { en: `${siteUrl}/en/about`, it: `${siteUrl}/it/about`, "x-default": `${siteUrl}/en/about` },
    },
  }
}

export default async function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[600px] md:h-[921px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <div className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80')",
            }}
          />
        </div>
        <div className="relative z-20 text-center px-margin-mobile">
          <span className="block font-label-sm text-label-sm text-white uppercase tracking-[0.2em] mb-6">
            Established 1924
          </span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-8 max-w-4xl mx-auto">
            The Heritage of the Silk Road
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto">
            Weaving the past into the modern home with timeless craftsmanship
            from the heart of Afghanistan.
          </p>
        </div>
      </section>

      {/* Our Heritage */}
      <Section background="none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-5 md:pr-12">
            <span className="text-secondary font-label-sm text-label-sm uppercase tracking-widest block mb-4">
              Chapter One
            </span>
            <h2 className="font-headline-md text-headline-md text-primary mb-8">
              Our Heritage
            </h2>
            <p className="text-on-surface-variant font-body-md text-body-md mb-6 leading-relaxed">
              For three generations, the Afghan Tappeti family has curated the
              finest hand-knotted rugs from the nomadic tribes and urban
              master-weavers of Herat and Persia.
            </p>
            <p className="text-on-surface-variant font-body-md text-body-md mb-8 leading-relaxed">
              Each rug is more than a floor covering; it is a repository of
              history, featuring motifs passed down through centuries.
            </p>
            <div className="h-px w-24 bg-outline-variant mb-8" />
          </div>
          <div className="md:col-span-7 relative">
            <div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-sm shadow-xl bg-surface-container-high" />
            <div className="absolute -bottom-10 -left-10 hidden md:block w-64 h-80 overflow-hidden rounded-sm shadow-2xl border-4 border-surface bg-surface-container" />
          </div>
        </div>
      </Section>

      {/* The Art of Hand-Knotting */}
      <section className="bg-primary-container py-section-gap overflow-hidden">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center mb-20">
          <h2 className="font-headline-md text-headline-md text-white mb-6">
            The Art of Hand-Knotting
          </h2>
          <div className="w-16 h-px bg-secondary mx-auto mb-10" />
          <p className="text-on-primary-container font-body-lg text-body-lg max-w-3xl mx-auto">
            A single Afghan Tappeti can take up to 14 months to complete. Our
            artisans use the traditional asymmetrical knotting technique, ensuring
            a level of detail and durability that machine-made replicas can never
            achieve.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {[
            {
              title: "Natural Pigments",
              text: "We use only organic dyes derived from madder root, pomegranate rinds, and indigo—colors that age gracefully over decades.",
            },
            {
              title: "The Loom",
              text: "Every rug begins on a vertical loom, where the weaver translates mental maps into intricate physical patterns knot by knot.",
            },
            {
              title: "Final Shearing",
              text: "After weaving, the rug is sheared and washed in mountain spring water to bring out the natural luster of the wool.",
            },
          ].map((item, i) => (
            <div key={item.title} className={`flex-1 space-y-6 group ${i === 1 ? "mt-12 md:mt-0" : ""} ${i === 2 ? "mt-12 md:mt-24" : ""}`}>
              <div className="aspect-square overflow-hidden rounded-sm bg-black/20" />
              <h3 className="font-headline-sm text-headline-sm text-white">
                {item.title}
              </h3>
              <p className="text-on-primary-container font-body-md text-body-md">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ethical Sourcing */}
      <Section background="none">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="md:w-1/3">
              <h2 className="font-headline-md text-headline-md text-primary sticky top-32">
                Ethical Sourcing
              </h2>
            </div>
            <div className="md:w-2/3 space-y-12">
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-4">
                  Empowering Artisans
                </h4>
                <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed">
                  We believe in a transparent supply chain. Our weavers are
                  partners, not just producers. We ensure fair living wages that
                  are 40% above the local industry average.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-outline-variant">
                <div className="text-center">
                  <span className="block font-display-lg text-headline-md text-primary">
                    100%
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Hand-Spun Wool
                  </span>
                </div>
                <div className="text-center">
                  <span className="block font-display-lg text-headline-md text-primary">
                    Zero
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Child Labor
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-4">
                  Environmental Stewardship
                </h4>
                <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed">
                  Traditional methods are inherently sustainable. By using locally
                  sourced Ghazni wool and plant-based dyes, we minimize our
                  ecological footprint.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Quote */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center italic px-margin-mobile">
          <blockquote className="font-headline-md text-headline-md text-on-surface mb-8">
            &ldquo;A rug is the soul of the room. It anchors the space and
            carries the echoes of ancient winds.&rdquo;
          </blockquote>
          <cite className="font-label-md text-label-md not-italic text-secondary tracking-[0.2em]">
            &mdash; Javad Tappeti, Founder
          </cite>
        </div>
      </section>
    </>
  )
}
