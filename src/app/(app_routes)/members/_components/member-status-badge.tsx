import { cn } from "@/lib/utils"
import { getMemberStatusLabel } from "@/modules/memberships/member-status-label"

const STATUS_STYLES: Record<string, string> = {
  ATIVO: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  PENDENTE:
    "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  INATIVO: "border-border bg-muted/50 text-muted-foreground",
  BLOQUEADO: "border-destructive/40 bg-destructive/10 text-destructive",
  NAO_VENDER:
    "border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-200",
  ESPECIAL:
    "border-purple-500/40 bg-purple-500/10 text-purple-800 dark:text-purple-200",
  COBRANCA:
    "border-blue-500/40 bg-blue-500/10 text-blue-800 dark:text-blue-200",
}

export function MemberStatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center border px-2.5 text-xs font-medium",
        STATUS_STYLES[status] ??
        "border-border bg-muted/30 text-muted-foreground",
        className
      )}
    >
      {getMemberStatusLabel(status)}
    </span>
  )
}
