"use client"

import { InviteMemberForm } from "@/app/(app_routes)/members/_components/invite-member-form"
import { MembershipPageHeader } from "@/app/(app_routes)/members/_components/membership-page-header"
import { MembershipFormContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { RouteBreadcrumb } from "@/components/global/navigation/route-breadcrumb"
import { PermissionRouteGuard } from "@/components/global/guards/permission-route-guard"
import { Skeleton } from "@/components/ui/skeleton"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { PERMISSION_CODES } from "@/lib/permissions"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"

export function InviteMemberPageContent({
  config,
}: {
  config: MembershipRouteConfig
}) {
  const { ready, enterpriseId } = useRequireEnterprise()

  const loading = (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <Skeleton className="h-4 w-48" />
      <MembershipFormContentLoading config={config} />
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
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <RouteBreadcrumb />
        <div className="space-y-6">
          <MembershipPageHeader
            title={config.invite.title}
            description={config.invite.description}
            note={config.invite.note}
          />
          <InviteMemberForm enterpriseId={enterpriseId} config={config} />
        </div>
      </main>
    </PermissionRouteGuard>
  )
}
