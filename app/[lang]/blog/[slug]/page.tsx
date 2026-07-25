import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { siteUrl, blogStructuredData } from "@/lib/seo"
import { getDictionary, type Locale } from "@/lib/i18n"
import { Section } from "@/components/layout/section"
import { localizeRow } from "@/lib/localize"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("blogs")
    .select("title, excerpt, translations")
    .eq("slug", slug)
    .single()

  if (!post) return {}
  const localized = localizeRow(post, lang as Locale)
  return {
    title: localized.title as string,
    description: (localized.excerpt as string) || undefined,
    alternates: {
      canonical: `${siteUrl}/${lang}/blog/${slug}`,
      languages: { en: `${siteUrl}/en/blog/${slug}`, it: `${siteUrl}/it/blog/${slug}`, "x-default": `${siteUrl}/en/blog/${slug}` },
    },
    openGraph: { title: post.title, description: post.excerpt || undefined },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const locale = lang as Locale
  const supabase = await createClient()
  const t = await getDictionary(locale)
  const { data: post } = await supabase
    .from("blogs")
    .select("*, translations")
    .eq("slug", slug)
    .single()

  const localized = post ? localizeRow(post, locale) : null
  const title = localized?.title ?? slug.replace(/-/g, " ")
  const date = localized?.published_at
  const jsonLd = localized ? blogStructuredData({
    title: localized.title,
    excerpt: localized.excerpt,
    published_at: localized.published_at,
    url: `${siteUrl}/${lang}/blog/${slug}`,
    image: localized.featured_image,
  }) : null

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <Section background="none">
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            {localized?.status && <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">{localized.status}</span>}
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mt-4 mb-4 capitalize">
              {title}
            </h1>
            <div className="flex items-center gap-3 text-on-surface-variant font-label-sm text-label-sm">
              {date && <span>{new Date(date).toLocaleDateString()}</span>}
            </div>
          </div>

          <div
            className="aspect-[16/9] bg-surface-container-low mb-12 bg-cover bg-center"
            style={localized?.featured_image ? { backgroundImage: `url(${localized.featured_image})` } : undefined}
          />

          <div className="prose max-w-none space-y-6">
            {localized?.content ? (
              post.content.split("\n").map((p: string, i: number) => (
                <p key={i} className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{p}</p>
              ))
            ) : (
              <>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{t.blog.fallback_p1}</p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{t.blog.fallback_p2}</p>
              </>
            )}
          </div>
          <div className="mt-12 text-center">
            <Link href={`/${locale}/blog`} className="font-label-md text-label-md text-secondary hover:text-secondary-fixed-dim transition-colors no-underline">{t.blog.back}</Link>
          </div>
        </article>
      </Section>
    </>
  )
}
