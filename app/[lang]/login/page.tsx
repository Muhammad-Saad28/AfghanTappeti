import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { LoginForm } from "./login-form"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)
  return {
    title: t.common?.sign_in ?? "Sign In",
    alternates: {
      canonical: `${siteUrl}/${lang}/login`,
      languages: { en: `${siteUrl}/en/login`, it: `${siteUrl}/it/login`, "x-default": `${siteUrl}/en/login` },
    },
  }
}

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-section-gap">
      <div className="max-w-md mx-auto">
        <h1 className="font-headline-md text-headline-md mb-8 text-center">{t.common?.sign_in ?? "Sign In"}</h1>
        <LoginForm locale={locale} />
        <p className="text-center mt-6 font-body-md text-on-surface-variant">
          {t.common?.no_account ?? "Don't have an account?"}{" "}
          <a href={`/${locale}/register`} className="text-secondary hover:underline">{t.common?.register ?? "Register"}</a>
        </p>
      </div>
    </main>
  )
}
