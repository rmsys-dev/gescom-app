"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/providers/authentication/auth-store"
import { useMinLoadingDisplay } from "@/hooks/use-min-loading-display"
import { AnimatedLoading } from "@/components/global/loading/animated-loading"

export default function Page() {
  const router = useRouter()
  const { hydrated, isAuthenticated } = useAuth()
  const showLoading = useMinLoadingDisplay(!hydrated)

  useEffect(() => {
    if (!hydrated) return
    if (isAuthenticated) {
      router.replace("/home")
      return
    }
    router.replace("/auth/login")
  }, [hydrated, isAuthenticated, router])

  if (showLoading) {
    return <AnimatedLoading />
  }

  return null
}
