import { cn } from "@/lib/utils"
import type { StockBatchStatus, StockMovementType } from "@/modules/sales/sales-enums"
import type { ProductStatus } from "@/modules/products/products.schema"

const LOCATION_STATUS_LABELS: Record<ProductStatus, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
}

const LOCATION_STATUS_STYLES: Record<ProductStatus, string> = {
  ATIVO: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  INATIVO: "border-border bg-muted/50 text-muted-foreground",
}

export function StockLocationStatusBadge({
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
        "inline-flex h-5 items-center border px-2.5 text-xs font-medium",
        LOCATION_STATUS_STYLES[key] ??
        "border-border bg-muted/30 text-muted-foreground",
        className
      )}
    >
      {LOCATION_STATUS_LABELS[key] ?? status}
    </span>
  )
}

const BATCH_STATUS_LABELS: Record<StockBatchStatus, string> = {
  ATIVO: "Ativo",
  BLOQUEADO: "Bloqueado",
  ESGOTADO: "Esgotado",
}

const BATCH_STATUS_STYLES: Record<StockBatchStatus, string> = {
  ATIVO: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  BLOQUEADO: "border-destructive/40 bg-destructive/10 text-destructive",
  ESGOTADO: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100",
}

export function StockBatchStatusBadge({
  status,
  className,
}: {
  status: StockBatchStatus | string
  className?: string
}) {
  const key = status as StockBatchStatus
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center border px-2.5 text-xs font-medium",
        BATCH_STATUS_STYLES[key] ??
        "border-border bg-muted/30 text-muted-foreground",
        className
      )}
    >
      {BATCH_STATUS_LABELS[key] ?? status}
    </span>
  )
}

const MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
  TRANSFERENCIA: "Transferência",
  AJUSTE: "Ajuste",
  PERDA: "Perda",
  VENDA: "Venda",
  COMPRA: "Compra",
  DEVOLUCAO: "Devolução",
  CANCELAMENTO: "Cancelamento",
  OUTROS: "Outros",
}

const MOVEMENT_TYPE_STYLES: Record<StockMovementType, string> = {
  ENTRADA: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  SAIDA: "border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-200",
  TRANSFERENCIA: "border-blue-500/40 bg-blue-500/10 text-blue-800 dark:text-blue-200",
  AJUSTE: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  PERDA: "border-destructive/40 bg-destructive/10 text-destructive",
  VENDA: "border-purple-500/40 bg-purple-500/10 text-purple-800 dark:text-purple-200",
  COMPRA: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  DEVOLUCAO: "border-blue-500/40 bg-blue-500/10 text-blue-800 dark:text-blue-200",
  CANCELAMENTO: "border-border bg-muted/50 text-muted-foreground",
  OUTROS: "border-border bg-muted/30 text-muted-foreground",
}

export function StockMovementTypeBadge({
  type,
  className,
}: {
  type: StockMovementType | string
  className?: string
}) {
  const key = type as StockMovementType
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center border px-2.5 text-xs font-medium",
        MOVEMENT_TYPE_STYLES[key] ??
        "border-border bg-muted/30 text-muted-foreground",
        className
      )}
    >
      {MOVEMENT_TYPE_LABELS[key] ?? type}
    </span>
  )
}
