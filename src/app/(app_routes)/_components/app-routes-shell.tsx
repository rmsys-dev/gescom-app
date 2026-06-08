"use client"

import { AppSidebar } from "@/app/(app_routes)/_components/app-sidebar"
import { NavHeader } from "@/app/(app_routes)/_components/nav-header"
import { PageRefreshProvider } from "@/app/(app_routes)/_components/page-refresh"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function AppRoutesShell({ children }: { children: React.ReactNode }) {
  return (
    <PageRefreshProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background">
          <div className="flex min-h-svh flex-1 flex-col">
            <NavHeader />
            <div className="min-h-0 flex-1 overflow-auto">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PageRefreshProvider>
  )
}
