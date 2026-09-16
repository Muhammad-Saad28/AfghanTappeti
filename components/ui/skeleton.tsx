import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-outline-variant/30 rounded", className)}
      {...props}
    />
  )
}

export { Skeleton }
