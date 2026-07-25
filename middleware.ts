import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { i18nMiddleware } from "@/lib/i18n-middleware"

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const pathname = request.nextUrl.pathname

  const isAdminRoute = pathname.startsWith("/admin")
  const isAdminLoginRoute = pathname === "/login"
  const isCustomerRoute = pathname.match(/^\/(en|it)\/account(\/.*)?$/)
  const isCustomerAuthRoute = pathname.match(/^\/(en|it)\/(login|register)$/)

  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAdminLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  if (isCustomerRoute && !user) {
    const lang = pathname.split("/")[1]
    return NextResponse.redirect(new URL(`/${lang}/login`, request.url))
  }

  if (isCustomerAuthRoute && user) {
    const lang = pathname.split("/")[1]
    return NextResponse.redirect(new URL(`/${lang}/account`, request.url))
  }

  const i18nResp = i18nMiddleware(request)
  if (i18nResp.status === 307 || i18nResp.status === 308) {
    return i18nResp
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
