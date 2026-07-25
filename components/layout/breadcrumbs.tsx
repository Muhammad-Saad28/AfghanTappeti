import Link from "next/link"

interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ items, lang }: { items: Crumb[]; lang: string }) {
  return (
    <nav aria-label="Breadcrumb" className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-6">
      <ol className="flex flex-wrap items-center gap-2 text-label-sm font-label-sm text-on-surface-variant">
        <li>
          <Link href={`/${lang}`} className="hover:text-secondary transition-colors no-underline">Home</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span>/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-secondary transition-colors no-underline">{item.label}</Link>
            ) : (
              <span className="text-on-surface">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
