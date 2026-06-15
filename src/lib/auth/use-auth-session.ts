"use client"

import { useAuth } from "@/components/providers/authentication/auth-store"

export function useAuthSession() {
  const {
    hydrated,
    isAuthenticated,
    signOut,
    refreshSession,
    activeEnterprise,
  } = useAuth()

  return {
    hydrated,
    isAuthenticated,
    signOut,
    refreshSession,
    activeEnterprise,
  }
}
