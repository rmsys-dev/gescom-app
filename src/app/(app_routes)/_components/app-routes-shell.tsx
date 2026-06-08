"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { IconSidebar } from "@/app/(app_routes)/_components/icon-sidebar"
import {
  getNavGroupForPathname,
  type NavGroupKey,
} from "@/app/(app_routes)/_components/nav-groups"
import { NavHeader } from "@/app/(app_routes)/_components/nav-header"
import { PageRefreshProvider } from "@/app/(app_routes)/_components/page-refresh"
import { SecondaryNavPanel } from "@/app/(app_routes)/_components/secondary-nav-panel"

export function AppRoutesShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [activePanel, setActivePanel] = useState<NavGroupKey | null>(null)

  useEffect(() => {
    const routeGroup = getNavGroupForPathname(pathname)

    if (routeGroup === "home" || routeGroup === null) {
      setTimeout(() => {
        setActivePanel(null)
      }, 100)
      return
    }

    setTimeout(() => {
      setActivePanel(routeGroup)
    }, 100)
  }, [pathname])

  return (
    <PageRefreshProvider>
      <div className="flex h-svh w-full overflow-hidden">
        <IconSidebar
          activePanel={activePanel}
          onPanelChange={setActivePanel}
        />
        {activePanel && activePanel !== "home" ? (
          <SecondaryNavPanel
            activePanel={activePanel}
            onClose={() => setActivePanel(null)}
          />
        ) : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
          <NavHeader />
          <div className="min-h-0 flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </PageRefreshProvider>
  )
}
