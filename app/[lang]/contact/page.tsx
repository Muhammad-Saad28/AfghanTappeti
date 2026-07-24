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
    title: t.contact.title,
    alternates: {
      canonical: `${siteUrl}/${lang}/contact`,
      languages: { en: `${siteUrl}/en/contact`, it: `${siteUrl}/it/contact`, "x-default": `${siteUrl}/en/contact` },
    },
  }
}

export default async function ContactPage({
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
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4 drop-shadow-lg">
            {t.contact.title}
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto drop-shadow">
            {t.contact.hero_subtitle}
          </p>
        </div>
      </section>

      <Section background="none">
        <div className="grid md:grid-cols-2 gap-24">
          <div>
            <h2 className="font-headline-sm text-headline-sm mb-8">
              {t.contact.form_heading}
            </h2>
            <form className="space-y-8">
              <div>
                <label htmlFor="name" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                  {t.contact.form_name}
                </label>
                <input id="name" type="text" className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label htmlFor="email" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                  {t.contact.form_email}
                </label>
                <input id="email" type="email" className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label htmlFor="subject" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                  {t.contact.form_subject}
                </label>
                <input id="subject" type="text" className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md" />
              </div>
              <div>
                <label htmlFor="message" className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                  {t.contact.form_message}
                </label>
                <textarea id="message" rows={4} className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none" />
              </div>
              <button type="submit" className="bg-primary text-white px-12 py-4 font-label-md text-label-md hover:bg-secondary transition-colors">
                {t.contact.form_submit}
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-headline-sm text-headline-sm mb-8">
              {t.contact.contact_info}
            </h2>
            <div className="space-y-8">
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">
                  {t.contact.address_label}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {t.contact.address}
                </p>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">
                  {t.contact.phone_label}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {t.contact.phone}
                </p>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">
                  {t.contact.email_label}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {t.contact.email}
                </p>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">
                  {t.contact.hours_label}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {t.contact.hours_week}<br />
                  {t.contact.hours_sat}<br />
                  {t.contact.hours_sun}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
