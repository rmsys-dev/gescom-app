import { cn } from "@/lib/utils"
import type { ProductStatus } from "@/modules/products/products.schema"

const STATUS_LABELS: Record<ProductStatus, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
}

const STATUS_STYLES: Record<ProductStatus, string> = {
  ATIVO: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  INATIVO: "border-border bg-muted/50 text-muted-foreground",
}

export function ProductStatusBadge({
  status,
  className,
}: {
  status: ProductStatus | string
  className?: string
}) {
  const key = status as ProductStatus
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[key] ??
        "border-border bg-muted/30 text-muted-foreground",
        className
      )}
    >
      {STATUS_LABELS[key] ?? status}
    </span>
  )
}
