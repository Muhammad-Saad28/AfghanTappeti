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
    title: t.care_guide_page.title,
    description: t.care_guide_page.subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}/care-guide`,
      languages: { en: `${siteUrl}/en/care-guide`, it: `${siteUrl}/it/care-guide`, "x-default": `${siteUrl}/en/care-guide` },
    },
  }
}

export default async function CareGuidePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const tips = [
    { title: t.care_guide_page.vacuuming_title, text: t.care_guide_page.vacuuming_text },
    { title: t.care_guide_page.rotation_title, text: t.care_guide_page.rotation_text },
    { title: t.care_guide_page.cleaning_title, text: t.care_guide_page.cleaning_text },
    { title: t.care_guide_page.spills_title, text: t.care_guide_page.spills_text },
    { title: t.care_guide_page.storage_title, text: t.care_guide_page.storage_text },
    { title: t.care_guide_page.sunlight_title, text: t.care_guide_page.sunlight_text },
  ]

  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center scale-105" style={{ backgroundImage: "url('/images/homepage.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-10" />
        </div>
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4 drop-shadow-lg">{t.care_guide_page.title}</h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto drop-shadow">{t.care_guide_page.subtitle}</p>
        </div>
      </section>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {tips.map((tip, i) => (
            <div key={i} className="bg-surface rounded-xl border border-outline-variant p-6">
              <h2 className="font-headline-xs text-headline-xs text-on-surface mb-3">{tip.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
    </>
  )
}
