"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  isNavGroupActive,
  NAV_GROUPS,
  type NavGroupKey,
} from "@/app/(app_routes)/_components/nav-groups"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type IconSidebarProps = {
  activePanel: NavGroupKey | null
  onPanelChange: (panel: NavGroupKey | null) => void
}

export function IconSidebar({ activePanel, onPanelChange }: IconSidebarProps) {
  const pathname = usePathname()

  function handleGroupClick(key: NavGroupKey, hasPanel: boolean) {
    if (!hasPanel) {
      onPanelChange(null)
      return
    }

    onPanelChange(activePanel === key ? null : key)
  }

  return (
    <aside className="flex h-svh w-[60px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 shrink-0 items-center justify-center border-b border-border">
        <Image
          src="/enterprise-icon.png"
          alt="Gescom"
          width={32}
          height={32}
          priority
          className="size-8 shrink-0 object-contain"
        />
      </div>

      <nav
        className="flex flex-1 flex-col items-center gap-1 px-2 py-3"
        aria-label="Navegação principal"
      >
        {NAV_GROUPS.map((group) => {
          const hasPanel = Boolean(group.routes?.length)
          const isActive = isNavGroupActive(pathname, group)
          const isPanelOpen = activePanel === group.key
          const isHighlighted = isActive || isPanelOpen

          const buttonClassName = cn(
            "size-10 rounded-lg transition-colors",
            isHighlighted
              ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )

          if (group.href) {
            return (
              <Tooltip key={group.key}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className={buttonClassName}
                    onClick={() => onPanelChange(null)}
                  >
                    <Link href={group.href} aria-label={group.label}>
                      <group.icon className="size-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{group.label}</TooltipContent>
              </Tooltip>
            )
          }

          return (
            <Tooltip key={group.key}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={group.label}
                  aria-expanded={isPanelOpen}
                  className={buttonClassName}
                  onClick={() => handleGroupClick(group.key, hasPanel)}
                >
                  <group.icon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{group.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>
    </aside>
  )
}
