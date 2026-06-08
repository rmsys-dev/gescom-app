"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Pin } from "lucide-react"

import {
  getActiveRouteUrl,
  getNavGroupByKey,
  type NavGroupKey,
} from "@/app/(app_routes)/_components/nav-groups"
import { cn } from "@/lib/utils"

type SecondaryNavPanelProps = {
  activePanel: NavGroupKey
  onClose: () => void
}

export function SecondaryNavPanel({
  activePanel,
  onClose,
}: SecondaryNavPanelProps) {
  const pathname = usePathname()
  const group = getNavGroupByKey(activePanel)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  if (!group?.routes?.length) {
    return null
  }

  const activeRouteUrl = getActiveRouteUrl(pathname, group.routes)

  return (
    <aside
      className="flex h-svh w-52 shrink-0 flex-col border-r border-border bg-sidebar"
      aria-label={`Menu ${group.label}`}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
        <Pin className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <span className="truncate text-xs font-medium text-muted-foreground">
          {group.label}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {group.routes.map((route) => {
          const isActive = activeRouteUrl === route.url

          return (
            <Link
              key={route.url}
              href={route.url}
              onClick={onClose}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              )}
            >
              <route.icon className="size-4 shrink-0" />
              <span className="truncate">{route.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
