"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"

import {
  MemberDetailHeader,
  MemberLinkCard,
  MemberUserInfoCard,
} from "@/app/(app_routes)/members/_components/member-field"
import { MembershipDetailContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { UserOnboardingPanel } from "@/app/(app_routes)/profile/_components/onboarding/user-onboarding-panel"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { HttpError } from "@/lib/api/http-error"
import { useOperatorPermissions } from "@/lib/permissions"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
import { useMemberQuery } from "@/modules/memberships/use-members"
import { buildEmptyUserDetails } from "@/modules/users-onboarding/users-onboarding-empty"
import { useUserDetailsQuery } from "@/modules/users-onboarding/use-users-onboarding"

type MemberDetailDialogProps = {
  memberId: string
  basePath: string
  config: MembershipRouteConfig
  open: boolean
  onOpenChange: (open: boolean) => void
  canEdit?: boolean
}

export function MemberDetailDialog({
  memberId,
  basePath,
  config,
  open,
  onOpenChange,
  canEdit = false,
}: MemberDetailDialogProps) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const detailHref = `${basePath}/${memberId}`

  const { data, error, isPending } = useMemberQuery({
    enterpriseId,
    memberId,
    enabled: open && ready && perms.canConsultMembers && Boolean(memberId),
  })

  const userId = data?.user.id

  const {
    data: detailsData,
    error: detailsError,
    isPending: detailsPending,
  } = useUserDetailsQuery({
    enterpriseId,
    userId,
    enabled:
      open && ready && perms.canConsultUsers && Boolean(userId),
  })

  const matchesRequiredClass =
    !config.requiredClass || data?.class === config.requiredClass

  const onboardingDetails =
    detailsData ?? (data ? buildEmptyUserDetails(data.user) : undefined)

  const errMessage =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : config.labels.loadDetailError

  const detailsErrMessage =
    detailsError instanceof HttpError
      ? detailsError.message
      : detailsError instanceof Error
        ? detailsError.message
        : "Não foi possível carregar o onboarding."

  const displayName =
    data?.user.userName.trim() || config.labels.defaultDisplayName

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-screen flex-col gap-0 p-0 sm:w-[50vw]! sm:max-w-[50vw]!"
      >
        <SheetHeader className="shrink-0 space-y-3 border-b px-6 py-4 pr-14">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <SheetTitle className="truncate">{displayName}</SheetTitle>
              <SheetDescription>
                Visualização rápida dos dados do {config.labels.singular.toLowerCase()}
              </SheetDescription>
            </div>
            {canEdit && (
              <Button asChild size="sm" variant="outline" className="shrink-0">
                <Link href={detailHref}>
                  <Pencil className="size-4" aria-hidden />
                  Editar
                </Link>
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {isPending && (
            <MembershipDetailContentLoading config={config} />
          )}

          {error && !data && !isPending && (
            <Card className="border-destructive/40 ring-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">
                  {config.labels.loadDetailErrorTitle}
                </CardTitle>
                <CardDescription>{errMessage}</CardDescription>
              </CardHeader>
            </Card>
          )}

          {data && !isPending && !matchesRequiredClass && (
            <Card>
              <CardHeader>
                <CardTitle>{config.labels.notFoundByClass}</CardTitle>
                <CardDescription>
                  {config.labels.notFoundByClassDescription}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {data && !isPending && matchesRequiredClass && enterpriseId && (
            <div className="space-y-6">
              <MemberDetailHeader member={data} config={config} />

              <MemberUserInfoCard
                user={data.user}
                enterpriseId={enterpriseId}
                memberId={data.id}
                canEdit={false}
              />

              <MemberLinkCard
                member={data}
                enterpriseId={enterpriseId}
                config={config}
                canEdit={false}
              />

              {perms.canConsultUsers ? (
                <>
                  {detailsError && !detailsData && !detailsPending && (
                    <Card className="border-destructive/40 ring-destructive/20">
                      <CardHeader>
                        <CardTitle className="text-destructive">
                          Erro ao carregar onboarding
                        </CardTitle>
                        <CardDescription>{detailsErrMessage}</CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                  <UserOnboardingPanel
                    details={onboardingDetails}
                    enterpriseId={enterpriseId}
                    userId={data.user.id}
                    memberId={data.id}
                    canAlter={false}
                    isLoading={detailsPending}
                    title={config.labels.onboardingPanelTitle}
                    description={config.labels.onboardingPanelDescription}
                  />
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{config.labels.onboardingDeniedTitle}</CardTitle>
                    <CardDescription>
                      Necessita da permissão consultar_usuarios para ver os
                      dados de onboarding.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
