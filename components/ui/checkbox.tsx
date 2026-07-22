import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "rounded border-outline-variant text-secondary focus:ring-secondary/30 w-4 h-4 cursor-pointer",
        className,
      )}
      {...props}
    />
  )
}

export { Checkbox }
