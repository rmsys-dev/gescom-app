import { cn } from "@/lib/utils"
import type { BudgetClosureSituation } from "@/modules/sales/sales-enums"
import { BUDGET_CLOSURE_LABELS } from "@/modules/sales/sales-labels"

const CLOSURE_STYLES: Record<BudgetClosureSituation, string> = {
  ABERTO: "border-sky-500/40 bg-sky-500/10 text-sky-800 dark:text-sky-200",
  PARCIAL:
    "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  FECHADO:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
}

export function BudgetClosureBadge({
  situation,
  className,
}: {
  situation: BudgetClosureSituation | string
  className?: string
}) {
  const key = situation as BudgetClosureSituation
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center border px-2.5 text-xs font-medium",
        CLOSURE_STYLES[key] ??
        "border-border bg-muted/30 text-muted-foreground",
        className
      )}
    >
      {BUDGET_CLOSURE_LABELS[key] ?? situation}
    </span>
  )
}
