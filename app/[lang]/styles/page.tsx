import type { Metadata } from "next"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { getProductImageUrl } from "@/lib/supabase/storage"
import { Section } from "@/components/layout/section"
import Link from "next/link"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)
  return {
    title: t.styles.title,
    description: t.styles.subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}/styles`,
      languages: { en: `${siteUrl}/en/styles`, it: `${siteUrl}/it/styles`, "x-default": `${siteUrl}/en/styles` },
    },
  }
}

export default async function StylesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const supabase = await createClient()
  const { data: styleImgs } = await supabase
    .from("product_images")
    .select("image_url")
    .order("display_order")
    .limit(20)
  const styleUrls = (styleImgs ?? []).map((i) => getProductImageUrl(i.image_url)).filter(Boolean)
  function pick(i: number) { return styleUrls[i % styleUrls.length] || "" }

  const styles = ["scandinavian", "classic", "minimal", "bohemian", "luxury", "modern"] as const

  return (
    <>
      <Section background="none">
        <div className="text-center py-section-gap">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
            {t.styles.title}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            {t.styles.subtitle}
          </p>
        </div>
      </Section>
      <Section background="muted">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {styles.map((key, i) => {
            const style = t.styles[key]
            return (
              <Link key={key} href={`/${locale}/shop`} className="group block bg-surface overflow-hidden no-underline">
                <div className="aspect-[4/3] overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${pick(i)})` }} />
                </div>
                <div className="p-8 space-y-3">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">{style.name}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{style.desc}</p>
                  <span className="inline-block font-label-md text-label-md text-secondary border-b border-secondary pb-0.5 mt-2">{t.styles.explore_cta.replace("{name}", style.name)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </Section>
    </>
  )
}
