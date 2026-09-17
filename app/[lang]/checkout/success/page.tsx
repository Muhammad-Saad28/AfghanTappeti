import Link from "next/link"
import { getDictionary, type Locale } from "@/lib/i18n"

export default async function CheckoutSuccessPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const locale = lang as Locale
  const t = await getDictionary(locale)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center text-2xl mb-6">✓</div>
      <h1 className="font-headline-sm text-headline-sm text-on-surface mb-3">{t.checkout_success.title}</h1>
      <p className="text-on-surface-variant font-body-md max-w-md mb-2">{t.checkout_success.subtitle}</p>
      <p className="font-body-md text-on-surface-variant mb-8 max-w-md">{t.checkout_success.message}</p>

      <div className="flex gap-4">
        <Link href={`/${locale}/shop`} className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md no-underline hover:bg-primary-fixed-dim transition-colors">{t.checkout_success.continue}</Link>
        <Link href={`/${locale}`} className="border border-outline-variant text-on-surface px-6 py-3 rounded-lg text-label-md no-underline hover:bg-surface-variant transition-colors">{t.checkout_success.home}</Link>
      </div>
    </div>
  )
}
