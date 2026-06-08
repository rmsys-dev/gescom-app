import React from "react"
import { AppRoutesShell } from "@/app/(app_routes)/_components/app-routes-shell"
import { AuthGate } from "@/app/(app_routes)/_components/auth-gate"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGate>
      <TooltipProvider>
        <AppRoutesShell>{children}</AppRoutesShell>
      </TooltipProvider>
    </AuthGate>
  )
}
