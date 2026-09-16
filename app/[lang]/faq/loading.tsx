import { Skeleton } from "@/components/ui/skeleton"

export default function FaqLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 md:pt-28">
      <Skeleton className="h-[400px] w-full -mt-24 md:-mt-28 mb-12" />

      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32 mx-auto mb-8" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-b border-outline-variant pb-4">
            <Skeleton className="h-6 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
