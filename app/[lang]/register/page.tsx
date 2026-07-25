import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { RegisterForm } from "./register-form"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)
  return {
    title: t.common?.register ?? "Register",
    alternates: {
      canonical: `${siteUrl}/${lang}/register`,
      languages: { en: `${siteUrl}/en/register`, it: `${siteUrl}/it/register`, "x-default": `${siteUrl}/en/register` },
    },
  }
}

export default async function RegisterPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-section-gap">
      <div className="max-w-md mx-auto">
        <h1 className="font-headline-md text-headline-md mb-8 text-center">{t.common?.register ?? "Create Account"}</h1>
        <RegisterForm locale={locale} />
        <p className="text-center mt-6 font-body-md text-on-surface-variant">
          {t.common?.have_account ?? "Already have an account?"}{" "}
          <a href={`/${locale}/login`} className="text-secondary hover:underline">{t.common?.sign_in ?? "Sign in"}</a>
        </p>
      </div>
    </main>
  )
}
