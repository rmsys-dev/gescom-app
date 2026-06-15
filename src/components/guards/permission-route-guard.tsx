"use client"

import type { ReactNode } from "react"

import {
  PermissionDeniedCard,
  PermissionsErrorCard,
} from "@/components/guards/permission-cards"
import { useOperatorPermissions } from "@/lib/permissions"

export type OperatorPermissions = ReturnType<typeof useOperatorPermissions>

type PermissionRouteGuardProps = {
  check: (perms: OperatorPermissions) => boolean
  permissionLabel: string
  loading?: ReactNode
  children: ReactNode
}

export function PermissionRouteGuard({
  check,
  permissionLabel,
  loading = null,
  children,
}: PermissionRouteGuardProps) {
  const perms = useOperatorPermissions()

  if (!perms.isReady || perms.isLoading) {
    return loading
  }

  if (perms.isError) {
    return <PermissionsErrorCard />
  }

  if (!check(perms)) {
    return <PermissionDeniedCard permissionLabel={permissionLabel} />
  }

  return children
}
