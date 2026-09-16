import en from "@/messages/en.json"
import it from "@/messages/it.json"

export const defaultLocale = "en"
export const locales = ["en", "it"] as const
export type Locale = (typeof locales)[number]

const dictionaries: Record<Locale, typeof en> = { en, it }

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
