"use client"

import { useParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { z } from "zod"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { UserOnboardingPanel } from "@/app/(app_routes)/profile/_components/onboarding/user-onboarding-panel"
import { MemberDepartmentsSection } from "@/app/(app_routes)/members/_components/member-departments-section"
import {
  MemberDetailHeader,
  MemberLinkCard,
  MemberUserInfoCard,
} from "@/app/(app_routes)/members/_components/member-field"
import { MemberDetailContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { MemberPermissionsSection } from "@/app/(app_routes)/members/_components/member-permissions-section"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { HttpError } from "@/lib/api/http-error"
import { useOperatorPermissions } from "@/lib/permissions"
import { useMemberQuery } from "@/modules/memberships/use-members"
import { useUserDetailsQuery } from "@/modules/users-onboarding/use-users-onboarding"

const memberIdSchema = z.uuid()

export default function MemberDetailPage() {
  const params = useParams()
  const rawMemberId = typeof params.memberId === "string" ? params.memberId : ""
  const memberIdResult = memberIdSchema.safeParse(rawMemberId)
  const memberId = memberIdResult.success ? memberIdResult.data : null

  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const { data, error, isPending, isFetching, refetch } = useMemberQuery({
    enterpriseId,
    memberId: memberId ?? undefined,
    enabled: ready && perms.canConsultMembers && Boolean(memberId),
  })

  const userId = data?.user.id

  const {
    data: detailsData,
    error: detailsError,
    isPending: detailsPending,
    isFetching: detailsFetching,
    refetch: refetchDetails,
  } = useUserDetailsQuery({
    enterpriseId,
    userId,
    enabled: ready && perms.canConsultUsers && Boolean(userId),
  })

  const departmentNameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const d of data?.departments ?? []) {
      if (!map.has(d.departmentId)) {
        map.set(d.departmentId, d.departmentId)
      }
    }
    return map
  }, [data?.departments])

  const errMessage =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Não foi possível carregar o membro."

  const detailsErrMessage =
    detailsError instanceof HttpError
      ? detailsError.message
      : detailsError instanceof Error
        ? detailsError.message
        : "Não foi possível carregar o onboarding."

  const errMeta =
    error instanceof HttpError
      ? { code: error.code, status: error.status, requestId: error.requestId }
      : null

  const isRefreshing = isFetching || detailsFetching

  const handleRefresh = useCallback(() => {
    void refetch()
    if (perms.canConsultUsers && userId) {
      void refetchDetails()
    }
  }, [perms.canConsultUsers, refetch, refetchDetails, userId])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching: isRefreshing,
    disabled: isRefreshing,
    enabled:
      ready &&
      perms.isReady &&
      !perms.isError &&
      perms.canConsultMembers &&
      Boolean(memberId),
  })

  if (!ready || !perms.isReady) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <MemberDetailContentLoading />
      </main>
    )
  }

  if (perms.isError) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Não foi possível carregar permissões</CardTitle>
            <CardDescription>
              Não foi possível obter as permissões da sessão. Tente atualizar a
              página ou iniciar sessão novamente.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  if (!memberId) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Membro inválido</CardTitle>
            <CardDescription>Identificador UUID inválido.</CardDescription>
          </CardHeader>
        </Card>
        <RouteBreadcrumb />
      </main>
    )
  }

  if (!perms.canConsultMembers) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Sem permissão</CardTitle>
            <CardDescription>
              Necessita da permissão consultar_membros.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  const memberDisplayName = data?.user.userName.trim() || undefined

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <RouteBreadcrumb currentLabel={memberDisplayName} />
      {isPending && <MemberDetailContentLoading />}

      {error && data && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
        >
          <p className="font-medium">Não foi possível atualizar os dados.</p>
          <p className="mt-1 text-amber-900/90 dark:text-amber-50/90">
            {errMessage}. Os valores abaixo podem estar desatualizados.
          </p>
        </div>
      )}

      {detailsError && detailsData && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
        >
          <p className="font-medium">Não foi possível atualizar o onboarding.</p>
          <p className="mt-1 text-amber-900/90 dark:text-amber-50/90">
            {detailsErrMessage}. Os valores abaixo podem estar desatualizados.
          </p>
        </div>
      )}

      {error && !data && !isPending && (
        <Card className="border-destructive/40 ring-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">
              Erro ao carregar o membro
            </CardTitle>
            <CardDescription>{errMessage}</CardDescription>
          </CardHeader>
          {errMeta && (
            <CardContent>
              <dl className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                <div>
                  <dt className="font-medium text-foreground">Código</dt>
                  <dd className="font-mono">{errMeta.code}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">HTTP</dt>
                  <dd>{errMeta.status}</dd>
                </div>
                <div className="min-w-0 sm:col-span-1">
                  <dt className="font-medium text-foreground">Request ID</dt>
                  <dd className="truncate font-mono">
                    {errMeta.requestId ?? "—"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          )}
        </Card>
      )}

      {data && !isPending && enterpriseId && (
        <div className="space-y-6">
          <MemberDetailHeader member={data} />

          <div className="grid gap-6 lg:grid-cols-2">
            <MemberUserInfoCard
              user={data.user}
              enterpriseId={enterpriseId}
              memberId={data.id}
              canEdit={perms.canAlterUsers}
              onUpdateSuccess={() => void refetch()}
            />
            <MemberLinkCard
              member={data}
              enterpriseId={enterpriseId}
              canEdit={perms.canAlterMembers}
              onUpdateSuccess={() => void refetch()}
            />
          </div>

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
                details={detailsData}
                enterpriseId={enterpriseId}
                userId={data.user.id}
                memberId={data.id}
                canAlter={perms.canAlterUsers}
                isLoading={detailsPending}
                title="Perfil do usuário"
                description="Consulte e edite informações pessoais, endereços, contatos e dados complementares do usuário."
              />
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Onboarding do usuário</CardTitle>
                <CardDescription>
                  Necessita da permissão consultar_usuarios para ver e editar os
                  dados de onboarding.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <MemberDepartmentsSection
            enterpriseId={enterpriseId}
            member={data}
            canAlter={perms.canAlterMembers}
            departmentNameById={departmentNameById}
          />

          <MemberPermissionsSection
            enterpriseId={enterpriseId}
            memberId={data.id}
            departments={data.departments}
            departmentNameById={departmentNameById}
            canAlterPermissions={perms.canAlterPermissions}
          />
        </div>
      )}
    </main>
  )
}
