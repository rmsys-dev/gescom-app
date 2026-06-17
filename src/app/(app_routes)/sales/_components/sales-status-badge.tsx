import { cn } from "@/lib/utils"
import type { SaleStatus } from "@/modules/sales/sales-enums"
import { SALE_STATUS_LABELS } from "@/modules/sales/sales-labels"

const STATUS_STYLES: Record<SaleStatus, string> = {
  ABERTA: "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  FINALIZADA:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  CANCELADA: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
}

export function SalesStatusBadge({
  status,
  className,
}: {
  status: SaleStatus | string
  className?: string
}) {
  const key = status as SaleStatus
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center border px-2.5 text-xs font-medium",
        STATUS_STYLES[key] ??
        "border-border bg-muted/30 text-muted-foreground",
        className
      )}
    >
      {SALE_STATUS_LABELS[key] ?? status}
    </span>
  )
}
