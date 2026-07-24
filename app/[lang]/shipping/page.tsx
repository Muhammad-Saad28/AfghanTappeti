import type { Metadata } from "next"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { Section } from "@/components/layout/section"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)
  return {
    title: t.shipping_page.title,
    description: t.shipping_page.subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}/shipping`,
      languages: { en: `${siteUrl}/en/shipping`, it: `${siteUrl}/it/shipping`, "x-default": `${siteUrl}/en/shipping` },
    },
  }
}

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center scale-105" style={{ backgroundImage: "url('/images/homepage.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-10" />
        </div>
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4 drop-shadow-lg">{t.shipping_page.title}</h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto drop-shadow">{t.shipping_page.subtitle}</p>
        </div>
      </section>

        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="font-headline-xs text-headline-xs text-on-surface mb-4">{t.shipping_page.shipping_title}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">{t.shipping_page.shipping_text}</p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{t.shipping_page.delivery_times}</p>
          </div>

          <div>
            <h2 className="font-headline-xs text-headline-xs text-on-surface mb-4">{t.shipping_page.returns_title}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">{t.shipping_page.returns_text}</p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">{t.shipping_page.refunds}</p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{t.shipping_page.exclusions}</p>
          </div>
        </div>
    </>
  )
}
