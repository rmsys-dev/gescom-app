import { cn } from "@/lib/utils"

type StatusBadgeProps = {
    status: string
}

const STATUS_LABELS: Record<string, string> = {
    ATIVO: "Ativo",
    INATIVO: "Inativo",
}

const STATUS_STYLES: Record<string, string> = {
    ATIVO: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
    INATIVO: "border-border bg-muted/50 text-muted-foreground",
}

export function StatusBadge({
    status,
}: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center border px-2.5 py-0.5 text-xs font-medium",
                STATUS_STYLES[status] ??
                "border-border bg-muted/30 text-muted-foreground",
            )}
        >
            {STATUS_LABELS[status] ?? status}
        </span>
    )
}
