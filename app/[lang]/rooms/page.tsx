import type { Metadata } from "next"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { Section } from "@/components/layout/section"
import Link from "next/link"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)
  return {
    title: t.rooms.title,
    description: t.rooms.subtitle,
    alternates: {
      canonical: `${siteUrl}/${lang}/rooms`,
      languages: { en: `${siteUrl}/en/rooms`, it: `${siteUrl}/it/rooms`, "x-default": `${siteUrl}/en/rooms` },
    },
  }
}

const roomImages: Record<string, string> = {
  living_room: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
  bedroom: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=80",
  dining_room: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80",
  office: "https://images.unsplash.com/photo-1602872030218-6c8a1f9c6a8a?w=1200&q=80",
  hallway: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=80",
  nursery: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1200&q=80",
}

const roomLayouts: Record<string, string> = {
  living_room: "col-span-1 md:col-span-2 row-span-1 md:row-span-2",
  bedroom: "col-span-1 row-span-1",
  dining_room: "col-span-1 row-span-1",
  office: "col-span-1 row-span-1",
  hallway: "col-span-1 row-span-1",
  nursery: "col-span-1 row-span-1",
}

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  const rooms = ["living_room", "bedroom", "dining_room", "office", "hallway", "nursery"] as const

  return (
    <>
      <Section background="none">
        <div className="text-center py-section-gap">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
            {t.rooms.title}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            {t.rooms.subtitle}
          </p>
        </div>
      </Section>

      <Section background="muted">
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-gutter">
          {rooms.map((key) => {
            const room = t.rooms[key]
            return (
              <Link
                key={key}
                href={`/${locale}/shop`}
                className={`group relative overflow-hidden no-underline ${roomLayouts[key]}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${roomImages[key]})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h2 className="font-headline-sm text-headline-sm text-white mb-2">
                    {room.name}
                  </h2>
                  <p className="font-body-md text-body-md text-white/80 leading-relaxed max-w-md">
                    {room.desc}
                  </p>
                  <span className="inline-block mt-4 font-label-md text-label-md text-secondary border-b border-secondary pb-0.5">
                    Shop {room.name} Rugs
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </Section>
    </>
  )
}
