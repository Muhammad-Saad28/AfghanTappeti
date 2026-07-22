const BUCKET = "product-images"

export function getProductImageUrl(value: string | null | undefined): string {
  if (!value) return ""
  if (value.startsWith("http://") || value.startsWith("https://")) return value
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${base}/storage/v1/object/public/${BUCKET}/${value}`
}
