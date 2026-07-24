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
    title: t.privacy_page.title,
    description: t.privacy_page.subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}/privacy`,
      languages: { en: `${siteUrl}/en/privacy`, it: `${siteUrl}/it/privacy`, "x-default": `${siteUrl}/en/privacy` },
    },
  }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const sections = [
    { title: null, content: t.privacy_page.intro },
    { title: "Data Collected", content: t.privacy_page.data_collected },
    { title: "Data Usage", content: t.privacy_page.data_usage },
    { title: "Data Sharing", content: t.privacy_page.data_sharing },
    { title: "Cookies", content: t.privacy_page.cookies },
    { title: "Your Rights", content: t.privacy_page.rights },
    { title: "Changes", content: t.privacy_page.changes },
  ]

  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center scale-105" style={{ backgroundImage: "url('/images/homepage.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-10" />
        </div>
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4 drop-shadow-lg">{t.privacy_page.title}</h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto drop-shadow">{t.privacy_page.subtitle}</p>
        </div>
      </section>

        <div className="max-w-3xl mx-auto space-y-8">
          {sections.map((s, i) => (
            <div key={i}>
              {s.title && <h2 className="font-headline-xs text-headline-xs text-on-surface mb-3">{s.title}</h2>}
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
    </>
  )
}
