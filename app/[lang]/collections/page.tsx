import type { Metadata } from "next"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { getProductImageUrl } from "@/lib/supabase/storage"
import { Section } from "@/components/layout/section"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)
  return {
    title: t.collections.title,
    description: t.collections.subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}/collections`,
      languages: { en: `${siteUrl}/en/collections`, it: `${siteUrl}/it/collections`, "x-default": `${siteUrl}/en/collections` },
    },
  }
}

const slugs = ["persian", "afghan", "oriental", "vintage", "modern", "luxury"] as const

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const supabase = await createClient()
  const { data: collImages } = await supabase
    .from("product_images")
    .select("image_url")
    .order("display_order")
    .limit(30)
  const collUrls = (collImages ?? []).map((i) => getProductImageUrl(i.image_url)).filter(Boolean)
  function pick(i: number) { return collUrls[i % collUrls.length] || "" }

  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden" style={{ backgroundImage: `url(${pick(0)})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4">
            {t.collections.title}
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto">
            {t.collections.subtitle}
          </p>
        </div>
      </section>

      <Section background="none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {slugs.map((slug, i) => {
            const collection = t.collections[slug]
            return (
              <div
                key={slug}
                className="relative group h-[500px] overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${pick(i + 1)})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-white font-headline-sm text-headline-sm">
                    {(collection as { name: string }).name}
                  </h3>
                  <p className="text-white/70 font-body-md text-body-md mt-2 max-w-xs">
                    {(collection as { desc: string }).desc}
                  </p>
                  <span className="text-white/80 font-label-sm text-label-sm uppercase tracking-widest mt-4 block hover:text-secondary-fixed transition-colors">
                    {t.collections.explore}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Section>
    </>
  )
}
