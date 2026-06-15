"use client"

import { useAuth } from "@/components/providers/authentication/auth-store"

export function useActiveEnterpriseId(): string | undefined {
  return useAuth().activeEnterprise?.id
}
