"use client"

import { LinkClientForm } from "@/app/(app_routes)/clients/_components/link-client-form"
import { MembershipLinkContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { RouteBreadcrumb } from "@/components/global/navigation/route-breadcrumb"
import { PermissionRouteGuard } from "@/components/global/guards/permission-route-guard"
import { Skeleton } from "@/components/ui/skeleton"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { PERMISSION_CODES } from "@/lib/permissions"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"

export function LinkClientPageContent({
  config,
}: {
  config: MembershipRouteConfig
}) {
  const { ready, enterpriseId } = useRequireEnterprise()

  const loading = (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <Skeleton className="h-4 w-48" />
      <MembershipLinkContentLoading config={config} />
    </main>
  )

  if (!ready) {
    return loading
  }

  if (!enterpriseId) return null

  return (
    <PermissionRouteGuard
      check={(perms) => perms.canIncludeMembers}
      permissionLabel={PERMISSION_CODES.incluirMembros}
      loading={loading}
    >
      <PermissionRouteGuard
        check={(perms) => perms.canConsultUsers}
        permissionLabel={PERMISSION_CODES.consultarUsuarios}
        loading={loading}
      >
        <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
          <RouteBreadcrumb />
          <LinkClientForm enterpriseId={enterpriseId} config={config} />
        </main>
      </PermissionRouteGuard>
    </PermissionRouteGuard>
  )
}
