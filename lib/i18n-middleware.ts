import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { locales, defaultLocale } from "./i18n"

export function i18nMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next()
  }

  const pathSegments = pathname.split("/").filter(Boolean)
  const firstSegment = pathSegments[0] as (typeof locales)[number] | undefined

  if (locales.includes(firstSegment as (typeof locales)[number])) {
    return NextResponse.next()
  }

  const acceptLang = request.headers.get("accept-language") || ""
  const preferred = locales.find((l) => acceptLang.startsWith(l)) || defaultLocale

  const url = request.nextUrl.clone()
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}
