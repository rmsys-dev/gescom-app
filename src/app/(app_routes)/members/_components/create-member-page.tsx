"use client"

import { CreateMemberForm } from "@/app/(app_routes)/members/_components/create-member-form"
import { MembershipPageHeader } from "@/app/(app_routes)/members/_components/membership-page-header"
import { MembershipFormContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import { PermissionRouteGuard } from "@/components/guards/permission-route-guard"
import { Skeleton } from "@/components/ui/skeleton"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"

export function CreateMemberPageContent({
  config,
}: {
  config: MembershipRouteConfig
}) {
  const { ready, enterpriseId } = useRequireEnterprise()

  if (!ready) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <Skeleton className="h-4 w-48" />
        <MembershipFormContentLoading config={config} />
      </main>
    )
  }

  if (!enterpriseId) return null

  return (
    <PermissionRouteGuard
      check={(perms) => perms.canCreateMemberWithUser}
      permissionLabel="incluir_usuarios e incluir_membros"
      loading={
        <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
          <Skeleton className="h-4 w-48" />
          <MembershipFormContentLoading config={config} />
        </main>
      }
    >
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <RouteBreadcrumb />
        <div className="space-y-6">
          <MembershipPageHeader
            title={config.create.title}
            description={config.create.description}
            note={config.create.note}
          />
          <CreateMemberForm enterpriseId={enterpriseId} config={config} />
        </div>
      </main>
    </PermissionRouteGuard>
  )
}
