import type { Metadata } from "next"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { createClient } from "@/lib/supabase/server"
import { getProductImageUrl } from "@/lib/supabase/storage"
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const supabase = await createClient()
  const { data: aboutImgs } = await supabase
    .from("product_images")
    .select("image_url")
    .order("display_order")
    .limit(20)
  const aboutUrls = (aboutImgs ?? []).map((i) => getProductImageUrl(i.image_url)).filter(Boolean)
  function pick(i: number) { return aboutUrls[i % aboutUrls.length] || "" }

  return (
    <>
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
            {t.about.hero_established}
          </span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-8 max-w-4xl mx-auto">
            {t.about.hero_title_line1}
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mx-auto">
            {t.about.hero_subtitle}
          </p>
        </div>
      </section>

      <Section background="none">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-5 md:pr-12">
            <span className="text-secondary font-label-sm text-label-sm uppercase tracking-widest block mb-4">
              {t.about.chapter_one}
            </span>
            <h2 className="font-headline-md text-headline-md text-primary mb-8">
              {t.about.heritage_headline}
            </h2>
            <p className="text-on-surface-variant font-body-md text-body-md mb-6 leading-relaxed">
              {t.about.heritage_p1}
            </p>
            <p className="text-on-surface-variant font-body-md text-body-md mb-8 leading-relaxed">
              {t.about.heritage_p2}
            </p>
            <div className="h-px w-24 bg-outline-variant mb-8" />
          </div>
          <div className="md:col-span-7 relative">
            <div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-sm shadow-xl bg-cover bg-center" style={{ backgroundImage: `url(${pick(0)})` }} />
            <div className="absolute -bottom-10 -left-10 hidden md:block w-64 h-80 overflow-hidden rounded-sm shadow-2xl border-4 border-surface bg-cover bg-center" style={{ backgroundImage: `url(${pick(1)})` }} />
          </div>
        </div>
      </Section>

      <section className="bg-primary-container py-section-gap overflow-hidden">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center mb-20">
          <h2 className="font-headline-md text-headline-md text-white mb-6">
            {t.about.knotting_headline}
          </h2>
          <div className="w-16 h-px bg-secondary mx-auto mb-10" />
          <p className="text-on-primary-container font-body-lg text-body-lg max-w-3xl mx-auto">
            {t.about.knotting_intro}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          {[
            { key: "1" as const },
            { key: "2" as const },
            { key: "3" as const },
          ].map((item, i) => (
            <div key={item.key} className={`flex-1 space-y-6 group ${i === 1 ? "mt-12 md:mt-0" : ""} ${i === 2 ? "mt-12 md:mt-24" : ""}`}>
              <div className="aspect-square overflow-hidden rounded-sm bg-cover bg-center" style={{ backgroundImage: `url(${pick(2 + i)})` }} />
              <h3 className="font-headline-sm text-headline-sm text-white">
                {t.about[`knotting_${item.key}_title` as keyof typeof t.about]}
              </h3>
              <p className="text-on-primary-container font-body-md text-body-md">
                {t.about[`knotting_${item.key}_text` as keyof typeof t.about]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Section background="none">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="md:w-1/3">
              <h2 className="font-headline-md text-headline-md text-primary sticky top-32">
                {t.about.ethical_headline}
              </h2>
            </div>
            <div className="md:w-2/3 space-y-12">
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-4">
                  {t.about.ethical_1_title}
                </h4>
                <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed">
                  {t.about.ethical_1_text}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-outline-variant">
                <div className="text-center">
                  <span className="block font-display-lg text-headline-md text-primary">
                    {t.about.ethical_stat_1_val}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {t.about.ethical_stat_1_label}
                  </span>
                </div>
                <div className="text-center">
                  <span className="block font-display-lg text-headline-md text-primary">
                    {t.about.ethical_stat_2_val}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {t.about.ethical_stat_2_label}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-4">
                  {t.about.ethical_2_title}
                </h4>
                <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed">
                  {t.about.ethical_2_text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-3xl mx-auto text-center italic px-margin-mobile">
          <blockquote className="font-headline-md text-headline-md text-on-surface mb-8">
            &ldquo;{t.about.quote_text}&rdquo;
          </blockquote>
          <cite className="font-label-md text-label-md not-italic text-secondary tracking-[0.2em]">
            &mdash; {t.about.quote_author}
          </cite>
        </div>
      </section>
    </>
  )
}
