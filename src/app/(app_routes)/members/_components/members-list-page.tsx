"use client"

import { useCallback } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { MembersFilters } from "@/app/(app_routes)/members/_components/members-filters"
import { MembersListHeader } from "@/app/(app_routes)/members/_components/members-list-header"
import { MembershipContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { MembersTable } from "@/app/(app_routes)/members/_components/members-table"
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
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
import { useMembersListFilters } from "@/modules/memberships/use-members-list-filters"
import { useMembersQuery } from "@/modules/memberships/use-members"

export function MembersListPage({
  config,
}: {
  config: MembershipRouteConfig
}) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applyFiltersFromForm,
    clearFilters,
    setPageOffset,
  } = useMembersListFilters(config)

  const { data, error, isPending, isFetching, refetch } = useMembersQuery({
    enterpriseId,
    filters: appliedFilters,
    enabled: ready && perms.canConsultMembers,
  })

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: ready && perms.isReady && !perms.isError && perms.canConsultMembers,
  })

  const errMessage =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : config.labels.loadListError

  const errMeta =
    error instanceof HttpError
      ? { code: error.code, status: error.status, requestId: error.requestId }
      : null

  if (!ready || !perms.isReady) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <MembershipContentLoading config={config} />
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

  if (!perms.canConsultMembers) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Sem permissão</CardTitle>
            <CardDescription>
              Necessita da permissão consultar_membros para ver esta área.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      {isPending && <MembershipContentLoading config={config} />}

      {error && data && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
        >
          <p className="font-medium">Não foi possível atualizar a lista.</p>
          <p className="mt-1 text-amber-900/90 dark:text-amber-50/90">
            {errMessage}. Os valores abaixo podem estar desatualizados.
          </p>
        </div>
      )}

      {error && !data && !isPending && (
        <Card className="border-destructive/40 ring-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">
              {config.labels.loadListErrorTitle}
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
          <MembersListHeader config={config} perms={perms} />
          <form
            id={config.list.filtersFormId}
            onSubmit={(e) => {
              e.preventDefault()
              applyFiltersFromForm()
            }}
          >
            <MembersFilters
              filters={draftFilters}
              onChange={setDraftFilters}
              onApply={applyFiltersFromForm}
              onClear={clearFilters}
              showClassFilter={config.list.showClassFilter}
            />
          </form>
          <MembersTable
            items={data.items}
            total={data.total}
            limit={data.limit}
            offset={data.offset}
            basePath={config.basePath}
            showClassColumn={config.list.showClassColumn}
            emptyTitle={config.labels.emptyList}
            emptyHint={config.labels.emptyListHint}
            onPageChange={setPageOffset}
          />
        </div>
      )}
    </main>
  )
}
