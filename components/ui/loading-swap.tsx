import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"
import type { ReactNode } from "react"

export function LoadingSwap({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div aria-busy={isLoading} className="grid grid-cols-1 items-center justify-items-center">
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2 w-full",
          isLoading ? "invisible" : "visible",
          className,
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2",
          isLoading ? "visible" : "invisible",
          className,
        )}
      >
        <Loader2Icon aria-hidden="true" className="animate-spin" />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  )
}