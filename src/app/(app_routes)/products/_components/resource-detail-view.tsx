"use client"

import { useParams } from "next/navigation"
import { useCallback } from "react"
import { z } from "zod"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import {
  PermissionDeniedCard,
  PermissionsErrorCard,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import { ProductDetailContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"

const idSchema = z.uuid()

type ResourceDetailViewProps<T> = {
  paramKey: string
  title: string
  permissionLabel: string
  canConsult: boolean
  requiresEnterprise?: boolean
  useDetailData: (opts: { id: string | undefined; enabled: boolean }) => {
    data: T | undefined
    error: unknown
    isPending: boolean
    isFetching: boolean
    refetch: () => void
  }
  renderContent: (data: T) => React.ReactNode
}

export function ResourceDetailView<T>({
  paramKey,
  title,
  permissionLabel,
  canConsult,
  requiresEnterprise = false,
  useDetailData,
  renderContent,
}: ResourceDetailViewProps<T>) {
  const params = useParams()
  const rawId = typeof params[paramKey] === "string" ? params[paramKey] : ""
  const idResult = idSchema.safeParse(rawId)
  const id = idResult.success ? idResult.data : null

  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const enterpriseReady = requiresEnterprise ? ready : true

  const { data, error, isPending, isFetching, refetch } = useDetailData({
    id: id ?? undefined,
    enabled:
      enterpriseReady && perms.isReady && canConsult && Boolean(id),
  })

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled:
      enterpriseReady && perms.isReady && !perms.isError && canConsult && Boolean(id),
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    `Não foi possível carregar ${title.toLowerCase()}.`
  )

  if ((!enterpriseReady || !perms.isReady) && requiresEnterprise) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <ProductDetailContentLoading />
      </main>
    )
  }

  if (!requiresEnterprise && !perms.isReady) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <ProductDetailContentLoading />
      </main>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />
  if (!canConsult) {
    return <PermissionDeniedCard permissionLabel={permissionLabel} />
  }

  if (!id) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Identificador inválido</CardTitle>
            <CardDescription>O ID na URL não é válido.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      {isPending && <ProductDetailContentLoading />}

      {Boolean(error) && !data && !isPending && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
            <CardDescription>{errMessage}</CardDescription>
          </CardHeader>
          {errMeta && (
            <CardContent>
              <p className="font-mono text-xs text-muted-foreground">
                {errMeta.code} · HTTP {errMeta.status}
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {data && !isPending && (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <RouteBreadcrumb currentLabel={title} />
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          </div>
          {renderContent(data)}
        </div>
      )}
    </main>
  )
}

export function DetailDl({
  rows,
}: {
  rows: { label: string; value: React.ReactNode }[]
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <dl className="grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className="text-xs font-medium text-muted-foreground">
                {row.label}
              </dt>
              <dd className="mt-0.5 text-sm">{row.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
