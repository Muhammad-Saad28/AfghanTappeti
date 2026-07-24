import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getDictionary, type Locale } from "@/lib/i18n"

export async function Footer({ lang }: { lang?: Locale }) {
  const locale = lang ?? "en"
  const t = await getDictionary(locale)
  const f = t.footer

  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("display_order")

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-5 gap-gutter pt-section-gap pb-section-gap">
        <div className="col-span-2 md:col-span-1 space-y-6">
          <Link href={`/${locale}`} className="font-display-lg text-headline-sm text-primary no-underline">
            Afghan Tappeti
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
            Curating the world&apos;s most exquisite hand-knotted rugs for discerning homes since 1924.
          </p>
          <div className="flex gap-6">
            <Link href="https://instagram.com/afghantappeti" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm text-label-sm no-underline">
              {f.instagram}
            </Link>
            <Link href="https://facebook.com/afghantappeti" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm text-label-sm no-underline">
              {f.facebook}
            </Link>
            <Link href="https://pinterest.com/afghantappeti" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-secondary transition-colors font-label-sm text-label-sm no-underline">
              {f.pinterest}
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-primary">{f.shop}</h4>
          <ul className="space-y-4">
            <li><Link href={`/${locale}/shop`} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors no-underline">All Rugs</Link></li>
            <li><Link href={`/${locale}/collections`} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors no-underline">{f.collections}</Link></li>
            <li><Link href={`/${locale}/styles`} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors no-underline">Styles</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-primary">Categories</h4>
          <ul className="space-y-4">
            {(categories ?? []).slice(0, 4).map((cat) => (
              <li key={cat.id}><Link href={`/${locale}/category/${cat.slug}`} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors no-underline">{cat.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-primary">{f.about}</h4>
          <ul className="space-y-4">
            <li><Link href={`/${locale}/about`} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors no-underline">{f.about}</Link></li>
            <li><Link href={`/${locale}/contact`} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors no-underline">{f.contact}</Link></li>
            <li><Link href={`/${locale}/blog`} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors no-underline">{f.blog}</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-label-md text-label-md font-bold uppercase tracking-widest text-primary">{f.faq}</h4>
          <ul className="space-y-4">
            <li><Link href={`/${locale}/faq`} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors no-underline">{f.faq}</Link></li>
            <li><Link href={`/${locale}/shipping`} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors no-underline">{f.shipping_returns}</Link></li>
            <li><Link href={`/${locale}/care-guide`} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors no-underline">{f.care_guide}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-outline-variant py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant">{f.copyright}</p>
        <div className="flex gap-8">
          <Link href={`/${locale}/privacy`} className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary no-underline">{f.privacy}</Link>
          <Link href={`/${locale}/terms`} className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary no-underline">{f.terms}</Link>
        </div>
      </div>
    </footer>
  )
}