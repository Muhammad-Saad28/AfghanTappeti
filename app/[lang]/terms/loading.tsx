import { Skeleton } from "@/components/ui/skeleton"

export default function TermsLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 md:pt-28">
      <Skeleton className="h-[400px] w-full -mt-24 md:-mt-28 mb-12" />

      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
