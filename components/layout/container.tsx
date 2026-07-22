import { cn } from "@/lib/utils"

function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Container }
