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
    title: t.blog.title,
    description: t.blog.subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}/blog`,
      languages: { en: `${siteUrl}/en/blog`, it: `${siteUrl}/it/blog`, "x-default": `${siteUrl}/en/blog` },
    },
  }
}

const posts = [
  {
    title: "The Art of Persian Rug Making: A 2,500-Year Legacy",
    excerpt: "Dive into the rich history of Persian rug weaving, from its ancient origins in the Achaemenid Empire to the master artisans keeping the tradition alive today.",
    date: "March 15, 2026",
    category: "Craftsmanship",
  },
  {
    title: "How to Choose the Perfect Rug for Your Living Room",
    excerpt: "A comprehensive guide to selecting the right size, material, and pattern for your living space, with expert tips from interior designers.",
    date: "March 10, 2026",
    category: "Buying Guide",
  },
  {
    title: "Natural Dyes vs. Synthetic: Why Traditional Methods Matter",
    excerpt: "Understanding the difference between natural and synthetic dyes, and why the ancient art of vegetable dyeing produces superior, longer-lasting colors.",
    date: "March 5, 2026",
    category: "Craftsmanship",
  },
  {
    title: "Afghan Khal Mohammadi: The Crown Jewel of Hand-Knotted Rugs",
    excerpt: "Discover what makes Khal Mohammadi rugs among the most sought-after in the world, from their distinctive deep red hues to their exceptional wool quality.",
    date: "February 28, 2026",
    category: "Rug Stories",
  },
  {
    title: "Rug Care 101: Preserving Your Investment for Generations",
    excerpt: "Essential tips for cleaning, storing, and maintaining your hand-knotted rug to ensure it remains a treasured heirloom for decades to come.",
    date: "February 20, 2026",
    category: "Care Guide",
  },
]

export default async function BlogPage() {
  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-surface-container-high">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4">
            The Afghan Tappeti Journal
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto">
            Stories, guides, and insights from the world of hand-knotted rugs.
          </p>
        </div>
      </section>

      <Section background="none">
        <div className="max-w-4xl mx-auto space-y-16">
          {posts.map((post) => (
            <article key={post.title} className="group grid md:grid-cols-5 gap-8 items-start border-b border-outline-variant pb-12">
              <div className="md:col-span-2 aspect-[4/3] bg-surface-container-low overflow-hidden" />
              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{post.date}</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm group-hover:text-secondary transition-colors">
                  {post.title}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="font-label-md text-label-md text-secondary border-b border-secondary pb-0.5 inline-block cursor-pointer hover:opacity-70 transition-opacity">
                  Read More
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
