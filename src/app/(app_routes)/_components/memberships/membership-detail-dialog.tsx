"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"

import { MemberDetailView } from "@/app/(app_routes)/members/_components/member-detail-view"
import { AnimatedLoading } from "@/components/global/loading/animated-loading"
import { EntityDetailSheet } from "@/components/global/sheets/entity-detail-sheet"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import type { MembershipRouteConfig } from "@/modules/memberships/memberships-route-config"
import { useMemberQuery } from "@/modules/memberships/use-members"

type MembershipDetailDialogProps = {
  membershipId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  config: MembershipRouteConfig
}

export function MembershipDetailDialog({
  membershipId,
  open,
  onOpenChange,
  config,
}: MembershipDetailDialogProps) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const { labels } = config

  const { data, error, isPending } = useMemberQuery({
    enterpriseId,
    memberId: membershipId,
    enabled: open && ready && perms.canConsultMembers && Boolean(membershipId),
  })

  const isWrongClass =
    data &&
    config.detail.validateClass &&
    !config.detail.validateClass(data.class)

  const notFound = isWrongClass ? (
    <Card>
      <CardHeader>
        <CardTitle>{labels.notFoundTitle}</CardTitle>
        <CardDescription>{labels.notFoundWrongClass}</CardDescription>
      </CardHeader>
    </Card>
  ) : null

  return (
    <EntityDetailSheet
      open={open}
      onOpenChange={onOpenChange}
      title={labels.detailTitle}
      description={labels.detailDescription}
      isPending={isPending}
      error={error}
      errorTitle={labels.loadDetailErrorTitle}
      fallbackErrorMessage={labels.loadDetailError}
      loading={<AnimatedLoading />}
      contentClassName="w-full h-full p-2"
      sheetClassName="w-auto"
      footer={
        data && !isPending && !isWrongClass ? (
          <div className="p-2">
            <Button variant="default" size="sm" asChild>
              <Link href={`${config.basePath}/${membershipId}`}>
                <Pencil className="size-4" aria-hidden />
                Editar
              </Link>
            </Button>
          </div>
        ) : undefined
      }
      notFound={notFound}
    >
      {data && enterpriseId && !isWrongClass ? (
        <MemberDetailView member={data} enterpriseId={enterpriseId} />
      ) : null}
    </EntityDetailSheet>
  )
}
