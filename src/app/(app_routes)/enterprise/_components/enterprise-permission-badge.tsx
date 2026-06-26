"use client"

import { Switch } from "@/components/ui/switch"
import { formatPermissionLabel } from "@/lib/permission-label"
import { cn } from "@/lib/utils"

type EnterprisePermissionBadgeProps = {
  permission: string
  active: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
  isDialog?: boolean
}

export function EnterprisePermissionBadge({
  permission,
  active,
  disabled = false,
  onCheckedChange,
  className,
  isDialog,
}: EnterprisePermissionBadgeProps) {
  const label = formatPermissionLabel(permission)
  const readOnly = !onCheckedChange

  return (
    <div
      className={cn(
        "flex min-h-11 items-center justify-between gap-3 border px-3 py-2 transition-[background-color,border-color,box-shadow,color] duration-200 ease-in-out",
        active
          ? "border-emerald-500/45 bg-emerald-500/10 shadow-xs dark:border-emerald-400/40 dark:bg-emerald-500/15"
          : "border-red-500/35 bg-red-500/8 dark:border-red-400/35 dark:bg-red-500/12",
        readOnly && "cursor-default",
        className,
        isDialog && "justify-center"
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <p
          className={cn(
            "truncate text-xs font-medium transition-colors duration-200 ease-in-out",
            active
              ? "text-emerald-950 dark:text-emerald-50"
              : "text-red-950/85 dark:text-red-100/90"
          )}
        >
          {label}
        </p>
      </div>

      {!isDialog && (
        <div className="flex shrink-0 items-center gap-2">
          <Switch
            checked={active}
            disabled={disabled || readOnly}
            onCheckedChange={onCheckedChange}
            size="sm"
            aria-label={`${active ? "Desativar" : "Ativar"} ${label}`}
            className={cn(
              "transition-colors duration-200 ease-in-out",
              active
                ? "data-checked:bg-emerald-600 dark:data-checked:bg-emerald-500"
                : "data-unchecked:bg-red-400/80 dark:data-unchecked:bg-red-500/70"
            )}
          />
        </div>
      )}
    </div>
  )
}
