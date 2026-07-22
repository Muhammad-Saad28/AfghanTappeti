import type { Metadata } from "next"
import { locales, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/i18n"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { siteUrl } from "@/lib/seo"

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)

  return {
    title: {
      default: "Afghan Tappeti | Hand-Knotted Rugs",
      template: `%s | Afghan Tappeti`,
    },
    description: t.home.hero_subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        en: `${siteUrl}/en`,
        it: `${siteUrl}/it`,
        "x-default": `${siteUrl}/en`,
      },
    },
    openGraph: {
      siteName: "Afghan Tappeti",
      locale: lang === "it" ? "it_IT" : "en_GB",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <>
      <Navbar lang={lang as Locale} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang as Locale} />
    </>
  )
}
