import { cache } from "react"

export const defaultLocale = "en"
export const locales = ["en", "it"] as const
export type Locale = (typeof locales)[number]

const dictionaries: Record<Locale, () => Promise<any>> = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  it: () => import("@/messages/it.json").then((m) => m.default),
}

export const getDictionary = cache(async (locale: Locale) => {
  return dictionaries[locale]()
})

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
