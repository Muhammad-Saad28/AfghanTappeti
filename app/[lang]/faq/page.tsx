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
    title: t.faq_page.title,
    description: t.faq_page.subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}/faq`,
      languages: { en: `${siteUrl}/en/faq`, it: `${siteUrl}/it/faq`, "x-default": `${siteUrl}/en/faq` },
    },
  }
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const faqs = [
    { q: t.faq_page.q1, a: t.faq_page.a1 },
    { q: t.faq_page.q2, a: t.faq_page.a2 },
    { q: t.faq_page.q3, a: t.faq_page.a3 },
    { q: t.faq_page.q4, a: t.faq_page.a4 },
    { q: t.faq_page.q5, a: t.faq_page.a5 },
    { q: t.faq_page.q6, a: t.faq_page.a6 },
    { q: t.faq_page.q7, a: t.faq_page.a7 },
    { q: t.faq_page.q8, a: t.faq_page.a8 },
  ]

  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center scale-105" style={{ backgroundImage: "url('/images/homepage.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-10" />
        </div>
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4 drop-shadow-lg">{t.faq_page.title}</h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto drop-shadow">{t.faq_page.subtitle}</p>
        </div>
      </section>

      <Section background="none">
        <div className="max-w-3xl mx-auto space-y-8">
          {faqs.map((faq, i) => (
            <details key={i} className="group border-b border-outline-variant pb-6">
              <summary className="flex items-center justify-between cursor-pointer list-none py-2">
                <span className="font-body-md text-body-md text-on-surface font-semibold pr-4">{faq.q}</span>
                <span className="text-on-surface-variant shrink-0 transition-transform group-open:rotate-180">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 7.5l5 5 5-5" /></svg>
                </span>
              </summary>
              <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  )
}
