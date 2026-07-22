import { cn } from "@/lib/utils"

function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "w-full bg-transparent border-b border-outline-variant py-3 font-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
