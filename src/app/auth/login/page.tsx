"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { LoginForm } from "@/app/auth/login/_components/login-form"
import { LoginRouteLoading } from "@/app/auth/login/_components/login-route-loading"
import { useAuth } from "@/components/providers/authentication/auth-store"
import { isSafeInternalReturnUrl } from "@/lib/auth/return-url"
import { useMinLoadingDisplay } from "@/hooks/use-min-loading-display"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { hydrated, isAuthenticated, enterprises, activeEnterprise } = useAuth()

  const returnUrl = searchParams.get("returnUrl")
  const showLoading = useMinLoadingDisplay(!hydrated || isAuthenticated)

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return

    if (isSafeInternalReturnUrl(returnUrl)) {
      router.replace(returnUrl)
      return
    }

    if (enterprises.length > 1 && !activeEnterprise) {
      router.replace("/auth/select-enterprise")
      return
    }

    router.replace("/home")
  }, [
    hydrated,
    isAuthenticated,
    enterprises.length,
    activeEnterprise,
    returnUrl,
    router,
  ])

  if (showLoading) {
    return <LoginRouteLoading />
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<LoginRouteLoading />}>
      <LoginPageContent />
    </Suspense>
  )
}
