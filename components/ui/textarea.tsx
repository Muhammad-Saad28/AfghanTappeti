import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full bg-transparent border-b border-outline-variant py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-secondary transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
