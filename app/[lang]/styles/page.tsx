import type { Metadata } from "next"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
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

const styleImages: Record<string, string> = {
  scandinavian: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
  classic: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80",
  minimal: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  bohemian: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
  luxury: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80",
  modern: "https://images.unsplash.com/photo-1602872030218-6c8a1f9c6a8a?w=800&q=80",
}

export default async function StylesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

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
          {styles.map((key) => {
            const style = t.styles[key]
            return (
              <Link
                key={key}
                href={`/${locale}/shop`}
                className="group block bg-surface overflow-hidden no-underline"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${styleImages[key]})` }}
                  />
                </div>
                <div className="p-8 space-y-3">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    {style.name}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {style.desc}
                  </p>
                  <span className="inline-block font-label-md text-label-md text-secondary border-b border-secondary pb-0.5 mt-2">
                    Explore {style.name} Rugs
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </Section>
    </>
  )
}
