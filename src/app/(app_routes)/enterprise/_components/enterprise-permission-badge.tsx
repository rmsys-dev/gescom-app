"use client"

import { Loader2 } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { formatPermissionLabel } from "@/lib/permission-label"
import { cn } from "@/lib/utils"

type EnterprisePermissionBadgeProps = {
  permission: string
  active: boolean
  disabled?: boolean
  pending?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function EnterprisePermissionBadge({
  permission,
  active,
  disabled = false,
  pending = false,
  onCheckedChange,
  className,
}: EnterprisePermissionBadgeProps) {
  const label = formatPermissionLabel(permission)
  const readOnly = !onCheckedChange

  return (
    <div
      className={cn(
        "flex min-h-11 items-center justify-between gap-3 border px-3 py-2 transition-[background-color,border-color,opacity,box-shadow]",
        active
          ? "border-emerald-500/45 bg-emerald-500/10 shadow-xs dark:border-emerald-400/40 dark:bg-emerald-500/15"
          : "border-red-500/35 bg-red-500/8 dark:border-red-400/35 dark:bg-red-500/12",
        pending && "opacity-70",
        readOnly && "cursor-default",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <p
          className={cn(
            "truncate text-xs font-medium",
            active
              ? "text-emerald-950 dark:text-emerald-50"
              : "text-red-950/85 dark:text-red-100/90"
          )}
        >
          {label}
        </p>
        {/* <p
              className={cn(
                "text-xs font-light uppercase",
                active
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-700 dark:text-red-300"
              )}
            >
              {active ? "Ativa" : "Inativa"}
            </p> */}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {pending && (
          <Loader2
            className={cn(
              "size-3.5 animate-spin",
              active ? "text-emerald-600" : "text-red-600"
            )}
            aria-hidden
          />
        )}
        <Switch
          checked={active}
          disabled={disabled || pending || readOnly}
          onCheckedChange={onCheckedChange}
          size="sm"
          aria-label={`${active ? "Desativar" : "Ativar"} ${label}`}
          className={cn(
            active
              ? "data-checked:bg-emerald-600 dark:data-checked:bg-emerald-500"
              : "data-unchecked:bg-red-400/80 dark:data-unchecked:bg-red-500/70"
          )}
        />
      </div>
    </div>
  )
}
