"use client"

import type { ReactNode } from "react"

import {
  PermissionRouteGuard,
  type OperatorPermissions,
} from "@/components/global/guards/permission-route-guard"
import { AnimatedLoading } from "@/components/global/loading/animated-loading"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"

function EnterprisePermissionLoading() {
  return (
    <AnimatedLoading />
  )
}

export function useEnterprisePermissionAccess() {
  const { ready, hydrated, enterpriseId, activeEnterprise } =
    useRequireEnterprise()
  const perms = useOperatorPermissions()

  return {
    ready,
    hydrated,
    enterpriseId,
    activeEnterprise,
    perms,
  }
}

type EnterprisePermissionGuardProps = {
  check: (perms: OperatorPermissions) => boolean
  permissionLabel: string
  children: ReactNode
}

export function EnterprisePermissionGuard({
  check,
  permissionLabel,
  children,
}: EnterprisePermissionGuardProps) {
  const { ready } = useRequireEnterprise()

  if (!ready) {
    return <EnterprisePermissionLoading />
  }

  return (
    <PermissionRouteGuard
      check={check}
      permissionLabel={permissionLabel}
      loading={<EnterprisePermissionLoading />}
    >
      {children}
    </PermissionRouteGuard>
  )
}
