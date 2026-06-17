import { cn } from "@/lib/utils"
import { getMemberClassLabel } from "@/modules/memberships/member-class-label"

export function MemberClassBadge({
  memberClass,
  className,
}: {
  memberClass: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary",
        className
      )}
    >
      {getMemberClassLabel(memberClass)}
    </span>
  )
}
