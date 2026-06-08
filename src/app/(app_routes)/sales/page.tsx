"use client"

import { useCallback, useState } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { SalesFilters } from "@/app/(app_routes)/sales/_components/sales-filters"
import { SalesContentLoading } from "@/app/(app_routes)/sales/_components/sales-route-loading"
import { SalesTable } from "@/app/(app_routes)/sales/_components/sales-table"
import {
  ListErrorCard,
  PaginatedListLayout,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import {
  defaultSalesFilters,
} from "@/modules/sales/sales-constants"
import type { ListSalesQuery } from "@/modules/sales/sales.schema"
import { useSalesQuery } from "@/modules/sales/use-sales"

export default function SalesPage() {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const [draftFilters, setDraftFilters] = useState<ListSalesQuery>(
    defaultSalesFilters()
  )
  const [appliedFilters, setAppliedFilters] =
    useState<ListSalesQuery>(defaultSalesFilters())

  const { data, error, isPending, isFetching, refetch } = useSalesQuery({
    filters: appliedFilters,
    enabled: ready && perms.canConsultSales,
  })

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: ready && perms.isReady && !perms.isError && perms.canConsultSales,
  })

  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...draftFilters, offset: 0 })
  }, [draftFilters])

  const clearFilters = useCallback(() => {
    const reset = defaultSalesFilters()
    setDraftFilters(reset)
    setAppliedFilters(reset)
  }, [])

  const { errMessage, errMeta } = useListErrorState(
    error,
    "Não foi possível carregar as vendas."
  )

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout loading={<SalesContentLoading />}>{null}</PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />

  if (!perms.canConsultSales) {
    return <PermissionDeniedCard permissionLabel="consultar_vendas" />
  }

  return (
    <PaginatedListLayout loading={isPending ? <SalesContentLoading /> : null}>
      {error && data && <StaleDataBanner message={errMessage} />}
      {error && !data && !isPending && (
        <ListErrorCard
          title="Erro ao carregar vendas"
          message={errMessage}
          meta={errMeta}
        />
      )}
      {data && !isPending && (
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              applyFilters()
            }}
          >
            <SalesFilters
              filters={draftFilters}
              onChange={setDraftFilters}
              onApply={applyFilters}
              onClear={clearFilters}
            />
          </form>

          <SalesTable
            items={data.items}
            total={data.total}
            limit={data.limit}
            offset={data.offset}
            onPageChange={(offset) =>
              setAppliedFilters((f) => ({ ...f, offset }))
            }
          />
        </div>
      )}
    </PaginatedListLayout>
  )
}
