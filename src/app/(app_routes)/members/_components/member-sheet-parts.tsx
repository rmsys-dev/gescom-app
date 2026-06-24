import { cn } from "@/lib/utils"
import { EMPTY_DISPLAY, formatEmpty } from "@/lib/formatters"

export function MemberSheetItem({
  label,
  value,
  className,
  children,
}: {
  label: string
  value?: string | null
  className?: string
  children?: React.ReactNode
}) {
  const display = formatEmpty(value)
  const empty = display === EMPTY_DISPLAY && !children

  return (
    <div className={cn("min-w-0 space-y-1", className)}>
      <dt className="flex items-center gap-1 text-sm font-medium text-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "text-sm font-normal text-muted-foreground",
          empty && "text-muted-foreground"
        )}
      >
        {children ?? display}
      </dd>
    </div>
  )
}

export function MemberSheetSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
