"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"

import { MemberDetailView } from "@/app/(app_routes)/members/_components/member-detail-view"
import { MemberDetailLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
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
  SheetFooter,
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
import { Button } from "@/components/ui/button"

type MemberDetailDialogProps = {
  memberId: string
  config: MembershipRouteConfig
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberDetailDialog({
  memberId,
  config,
  open,
  onOpenChange,
}: MemberDetailDialogProps) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const { data, error, isPending } = useMemberQuery({
    enterpriseId,
    memberId,
    enabled: open && ready && perms.canConsultMembers && Boolean(memberId),
  })

  const userId = data?.user.id

  const {
    data: detailsData,
    isPending: detailsPending,
  } = useUserDetailsQuery({
    enterpriseId,
    userId,
    enabled: open && ready && perms.canConsultUsers && Boolean(userId),
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

  const displayName =
    data?.user.userName.trim() || config.labels.defaultDisplayName

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-screen flex-col gap-0 p-0 sm:w-[70vw]! sm:max-w-[70vw]!"
      >
        <SheetHeader className="shrink-0 border-b px-6 py-4 text-left">
          <div className="flex flex-col items-start justify-between gap-4 pr-8">
            <div className="min-w-0">
              <SheetTitle className="text-lg">{displayName}</SheetTitle>
              <SheetDescription>
                Visualização detalhada do {config.labels.singular}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isPending && <MemberDetailLoading compact />}

          {error && !isPending && (
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="text-destructive text-base">
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
            <MemberDetailView
              member={data}
              config={config}
              enterpriseId={enterpriseId}
              onboardingDetails={onboardingDetails}
              canConsultUsers={perms.canConsultUsers}
              isOnboardingLoading={detailsPending}
            />
          )}
        </div>

        {data && !isPending && matchesRequiredClass && (
          <SheetFooter className="shrink-0 border-t px-6 py-4">
            <Button variant="default" size="sm" asChild>
              <Link href={`${config.basePath}/${memberId}`}>
                <Pencil className="size-4" aria-hidden />
                Editar
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
