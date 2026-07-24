import type { Metadata } from "next"
import Link from "next/link"
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
    title: t.blog.title,
    description: t.blog.subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}/blog`,
      languages: { en: `${siteUrl}/en/blog`, it: `${siteUrl}/it/blog`, "x-default": `${siteUrl}/en/blog` },
    },
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("blogs")
    .select("id, slug, title, excerpt, featured_image, published_at")
    .order("published_at", { ascending: false })
    .limit(10)

  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center scale-105" style={{ backgroundImage: "url('/images/homepage.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 z-10" />
        </div>
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4 drop-shadow-lg">{t.blog.title}</h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto drop-shadow">{t.blog.subtitle}</p>
        </div>
      </section>
      <Section background="none">
        <div className="max-w-4xl mx-auto space-y-16">
          {(posts ?? []).length === 0 && (
            <p className="text-center font-body-md text-on-surface-variant py-12">{t.blog.no_posts}</p>
          )}
          {(posts ?? []).map((post) => (
            <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="group grid md:grid-cols-5 gap-8 items-start border-b border-outline-variant pb-12 no-underline">
              <div className="md:col-span-2 aspect-[4/3] bg-cover bg-center overflow-hidden" style={post.featured_image ? { backgroundImage: `url(${getProductImageUrl(post.featured_image)})` } : undefined} />
              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm group-hover:text-secondary transition-colors">{post.title}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{post.excerpt}</p>
                <span className="font-label-md text-label-md text-secondary border-b border-secondary pb-0.5 inline-block cursor-pointer hover:opacity-70 transition-opacity">{t.blog.read_more}</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}
