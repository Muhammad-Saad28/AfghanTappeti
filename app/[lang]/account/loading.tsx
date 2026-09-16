import { Skeleton } from "@/components/ui/skeleton"

export default function AccountLoading() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 md:pt-28">
      <Skeleton className="h-8 w-32 mb-8" />

      <div className="max-w-md mx-auto space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  )
}
