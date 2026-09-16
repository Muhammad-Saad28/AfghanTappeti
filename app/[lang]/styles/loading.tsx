import { Skeleton } from "@/components/ui/skeleton"

export default function StylesLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 md:pt-28">
      <Skeleton className="h-[400px] w-full -mt-24 md:-mt-28 mb-12" />

      <Skeleton className="h-8 w-48 mx-auto mb-16" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}
