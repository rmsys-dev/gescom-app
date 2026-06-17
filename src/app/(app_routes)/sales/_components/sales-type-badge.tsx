import { cn } from "@/lib/utils"
import type { SaleType } from "@/modules/sales/sales-enums"
import { SALE_TYPE_LABELS } from "@/modules/sales/sales-labels"

const TYPE_STYLES: Record<SaleType, string> = {
  VENDA: "border-primary/40 bg-primary/10 text-primary",
  ORCAMENTO: "border-sky-500/40 bg-sky-500/10 text-sky-800 dark:text-sky-200",
}

export function SalesTypeBadge({
  type,
  className,
}: {
  type: SaleType | string
  className?: string
}) {
  const key = type as SaleType
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-0.5 text-xs font-medium",
        TYPE_STYLES[key] ??
        "border-border bg-muted/30 text-muted-foreground",
        className
      )}
    >
      {SALE_TYPE_LABELS[key] ?? type}
    </span>
  )
}
