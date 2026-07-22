import { cn } from "@/lib/utils"

function Label({
  className,
  htmlFor,
  children,
  ...props
}: React.HTMLAttributes<HTMLLabelElement> & { htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "font-label-sm text-label-sm text-on-surface-variant block mb-1",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  )
}

export { Label }
