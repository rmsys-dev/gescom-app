"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { HomeRouteLoading } from "./_components/dashboard-route-loading";
import { useAuth } from "@/components/providers/authentication/auth-store"
import { useMinLoadingDisplay } from "@/hooks/use-min-loading-display"

export default function HomePage() {
  const router = useRouter()
  const { hydrated, enterprises, activeEnterprise } = useAuth()

  const needsEnterpriseSelection =
    enterprises.length > 1 && !activeEnterprise

  const showLoading = useMinLoadingDisplay(
    !hydrated || needsEnterpriseSelection,
  )

  useEffect(() => {
    if (!hydrated) return
    if (needsEnterpriseSelection) {
      router.replace("/auth/select-enterprise")
    }
  }, [hydrated, needsEnterpriseSelection, router])

  if (showLoading) {
    return <HomeRouteLoading />
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Home
        </h1>
      </div>
    </main>
  )
}
