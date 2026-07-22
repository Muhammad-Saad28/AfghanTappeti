import { cache } from "react"

export const defaultLocale = "en"
export const locales = ["en", "it"] as const
export type Locale = (typeof locales)[number]

const dictionaries = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  it: () => import("@/messages/it.json").then((m) => m.default),
} as const

export const getDictionary = cache(async (locale: Locale) => {
  return dictionaries[locale]()
})

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
