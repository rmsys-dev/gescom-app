"use client"

import { useCallback } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { EnterpriseContentLoading } from "@/app/(app_routes)/enterprise/_components/enterprise-route-loading"
import { EnterprisePermissionBadge } from "@/app/(app_routes)/enterprise/_components/enterprise-permission-badge"
import {
  EnterpriseDetailFields,
  EnterpriseHero,
} from "@/app/(app_routes)/enterprise/_components/enterprise-field"
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
import { useMeQuery } from "@/modules/authentication/use-account"
import { useEnterpriseDetailQuery } from "@/modules/enterprises/use-enterprises"

export default function EnterprisePage() {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const {
    data: enterpriseDetail,
    error: enterpriseError,
    isPending: enterprisePending,
    isFetching: enterpriseFetching,
    refetch: refetchEnterprise,
  } = useEnterpriseDetailQuery({
    enterpriseId,
    enabled: ready && perms.canConsultEnterprises,
  })
  const {
    data: meData,
    error: meError,
    isFetching: meFetching,
    refetch: refetchMe,
  } = useMeQuery()

  const enterpriseErrMessage =
    enterpriseError instanceof HttpError
      ? enterpriseError.message
      : enterpriseError instanceof Error
        ? enterpriseError.message
        : "Não foi possível carregar os dados da empresa."

  const enterpriseErrMeta =
    enterpriseError instanceof HttpError
      ? {
        code: enterpriseError.code,
        status: enterpriseError.status,
        requestId: enterpriseError.requestId,
      }
      : null

  const meErrMessage =
    meError instanceof HttpError
      ? meError.message
      : meError instanceof Error
        ? meError.message
        : "Não foi possível carregar a sessão."

  const handleRefresh = useCallback(() => {
    void refetchEnterprise()
    void refetchMe()
  }, [refetchEnterprise, refetchMe])

  const isRefreshing = enterpriseFetching || meFetching

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching: isRefreshing,
    disabled: enterprisePending || enterpriseFetching,
    enabled: ready && perms.isReady && !perms.isError && perms.canConsultEnterprises,
  })

  if (!ready || !perms.isReady) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <EnterpriseContentLoading />
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
              {meErrMessage} Tente atualizar a página ou iniciar sessão novamente.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  if (!perms.canConsultEnterprises) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Sem permissão</CardTitle>
            <CardDescription>
              Necessita da permissão consultar_empresas.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      {enterprisePending && <EnterpriseContentLoading />}

      {enterpriseError && enterpriseDetail && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
        >
          <p className="font-medium">Não foi possível atualizar os dados.</p>
          <p className="mt-1 text-amber-900/90 dark:text-amber-50/90">
            {enterpriseErrMessage}. Os valores abaixo podem estar desatualizados.
          </p>
        </div>
      )}

      {enterpriseError && !enterpriseDetail && !enterprisePending && (
        <Card className="border-destructive/40 ring-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">
              Erro ao carregar a empresa
            </CardTitle>
            <CardDescription>{enterpriseErrMessage}</CardDescription>
          </CardHeader>
          {enterpriseErrMeta && (
            <CardContent>
              <dl className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                <div>
                  <dt className="font-medium text-foreground">Código</dt>
                  <dd className="font-mono">{enterpriseErrMeta.code}</dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">HTTP</dt>
                  <dd>{enterpriseErrMeta.status}</dd>
                </div>
                <div className="min-w-0 sm:col-span-1">
                  <dt className="font-medium text-foreground">Request ID</dt>
                  <dd className="truncate font-mono">
                    {enterpriseErrMeta.requestId ?? "—"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          )}
        </Card>
      )}

      {enterpriseDetail && !enterprisePending && (
        <div className="space-y-6">
          <EnterpriseHero enterprise={enterpriseDetail}>
            <EnterpriseDetailFields
              enterprise={enterpriseDetail}
              enterpriseId={enterpriseId}
              canEdit={perms.canAlterEnterprises}
              onUpdateSuccess={() => void refetchEnterprise()}
              canConsultAddresses={perms.canConsultAddresses}
              canIncludeAddresses={perms.canIncludeAddresses}
              canAlterAddresses={perms.canAlterAddresses}
            />
          </EnterpriseHero>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Permissões
              </CardTitle>
              <CardDescription>
                Visualize as permissões atribuídas nesta empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {meError && !meData && (
                <p className="text-sm text-destructive">{meErrMessage}</p>
              )}
              {meError && meData && (
                <p
                  role="status"
                  className="text-sm text-amber-950 dark:text-amber-100"
                >
                  Não foi possível atualizar a sessão. {meErrMessage}
                </p>
              )}
              {!meData?.permissions?.length ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma permissão listada para esta sessão.
                </p>
              ) : (
                <ul className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {meData.permissions.map((permission) => (
                    <li key={permission} className="min-w-0">
                      <EnterprisePermissionBadge permission={permission} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
