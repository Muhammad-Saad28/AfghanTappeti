import { cn } from "@/lib/utils"

function Section({
  className,
  children,
  background,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  background?: "default" | "muted" | "none"
}) {
  return (
    <div
      className={cn(
        "py-section-gap",
        background === "muted" && "bg-surface-container",
        background === "default" && "bg-surface-container-low",
        className,
      )}
      {...props}
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {children}
      </div>
    </div>
  )
}

export { Section }
