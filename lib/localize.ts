import { type Locale } from "./i18n"

export function localizeRow<T extends Record<string, unknown>>(
  row: T,
  locale: Locale
): T {
  if (locale === "en") return row
  const translations = row.translations as Record<string, Partial<T>> | undefined
  if (!translations?.[locale]) return row
  return { ...row, ...translations[locale] }
}
