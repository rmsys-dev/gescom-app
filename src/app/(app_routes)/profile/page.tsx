"use client"

import { useCallback } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { UserOnboardingPanel } from "@/app/(app_routes)/profile/_components/onboarding/user-onboarding-panel"
import { ProfileContentLoading } from "@/app/(app_routes)/profile/_components/profile-route-loading"
import { ProfileSection } from "@/app/(app_routes)/profile/_components/profile-field"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { HttpError } from "@/lib/api/http-error"
import { useMeQuery } from "@/modules/authentication/use-account"
import { useUserDetailsQuery } from "@/modules/users-onboarding/use-users-onboarding"

export default function ProfilePage() {
  const { ready, enterpriseId } = useRequireEnterprise()
  const { data, error, isPending, isFetching, refetch } = useMeQuery()

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
    enabled: ready && Boolean(enterpriseId) && Boolean(userId),
  })

  const errMessage =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Não foi possível carregar o perfil. Caso o problema persista, entre em contato com o suporte."

  const detailsErrMessage =
    detailsError instanceof HttpError
      ? detailsError.message
      : detailsError instanceof Error
        ? detailsError.message
        : "Não foi possível carregar o onboarding. Caso o problema persista, entre em contato com o suporte."

  const errMeta =
    error instanceof HttpError
      ? { code: error.code, status: error.status, requestId: error.requestId }
      : null

  const isRefreshing = isFetching || detailsFetching

  const handleRefresh = useCallback(() => {
    void refetch()
    if (enterpriseId && userId) {
      void refetchDetails()
    }
  }, [enterpriseId, refetch, refetchDetails, userId])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching: isRefreshing,
    disabled: isRefreshing,
    enabled: ready,
  })

  if (!ready) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <ProfileContentLoading />
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      {isPending && <ProfileContentLoading />}

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
              Erro ao carregar o perfil
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

      {data && !isPending && (
        <div className="space-y-6">
          <ProfileSection
            user={data.user}
            enterpriseId={enterpriseId}
            canEdit={Boolean(enterpriseId)}
            onUpdateSuccess={() => void refetch()}
          />

          {enterpriseId ? (
            <>
              {detailsError && !detailsData && !detailsPending && (
                <Card className="border-destructive/40">
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
                memberId={data.enterprise?.memberId}
                canAlter
                isLoading={detailsPending}
                title="Perfil de usuário"
                description="Preencha ou atualize as suas informações pessoais, endereços, contatos e dados complementares."
              />
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Onboarding</CardTitle>
                <CardDescription>
                  Selecione uma empresa ativa para consultar e editar os seus
                  dados completos.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

        </div>
      )}
    </main>
  )
}
