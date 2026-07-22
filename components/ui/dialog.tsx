"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const handler = () => onClose()
    el.addEventListener("close", handler)
    return () => el.removeEventListener("close", handler)
  }, [onClose])

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "backdrop:bg-black/40 max-w-lg w-full rounded-xl bg-surface p-0 shadow-lg border border-outline-variant open:flex flex-col",
        className,
      )}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="font-headline-sm text-on-surface">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </dialog>
  )
}

export { Dialog }
