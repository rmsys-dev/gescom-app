"use client"

import { useCallback, useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { BudgetsFilters } from "@/app/(app_routes)/sales/_components/budgets-filters"
import { BudgetsTable } from "@/app/(app_routes)/sales/_components/budgets-table"
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
import { filterSalesItemsByDate } from "@/modules/sales/sales-client-filters"
import {
  defaultBudgetFilters,
  defaultSalesDateFilters,
  defaultSalesFilters,
  hasActiveSalesDateFilters,
  type SalesDateFilters,
} from "@/modules/sales/sales-constants"
import type { ListSalesQuery } from "@/modules/sales/sales.schema"
import { useSalesQuery } from "@/modules/sales/use-sales"

type SalesListVariant = "sales" | "budgets"

const LIST_PAGE_CONFIG: Record<
  SalesListVariant,
  {
    defaultFilters: () => ListSalesQuery
    formId: string
    loadErrorMessage: string
    loadErrorTitle: string
    emptyMessage: string
  }
> = {
  sales: {
    defaultFilters: defaultSalesFilters,
    formId: "sales-filters-form",
    loadErrorMessage: "Não foi possível carregar as vendas.",
    loadErrorTitle: "Erro ao carregar vendas",
    emptyMessage: "Nenhuma venda encontrada",
  },
  budgets: {
    defaultFilters: defaultBudgetFilters,
    formId: "budgets-filters-form",
    loadErrorMessage: "Não foi possível carregar os orçamentos.",
    loadErrorTitle: "Erro ao carregar orçamentos",
    emptyMessage: "Nenhum orçamento encontrado",
  },
}

function parseFiltersFromForm(form: HTMLFormElement): {
  filters: Pick<ListSalesQuery, "orderNumber" | "seller" | "client">
  dateFilters: SalesDateFilters
} {
  const orderNumberEl = form.elements.namedItem(
    "orderNumber"
  ) as HTMLInputElement | null
  const sellerEl = form.elements.namedItem("seller") as HTMLInputElement | null
  const clientEl = form.elements.namedItem("client") as HTMLInputElement | null
  const dateFromEl = form.elements.namedItem(
    "dateFrom"
  ) as HTMLInputElement | null
  const dateToEl = form.elements.namedItem("dateTo") as HTMLInputElement | null

  return {
    filters: {
      orderNumber: orderNumberEl?.value.trim() || undefined,
      seller: sellerEl?.value.trim() || undefined,
      client: clientEl?.value.trim() || undefined,
    },
    dateFilters: {
      dateFrom: dateFromEl?.value.trim() || undefined,
      dateTo: dateToEl?.value.trim() || undefined,
    },
  }
}

type SalesListPageProps = {
  variant: SalesListVariant
  leading?: ReactNode
}

export function SalesListPage({ variant, leading }: SalesListPageProps) {
  const config = LIST_PAGE_CONFIG[variant]
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const [draftFilters, setDraftFilters] = useState<ListSalesQuery>(
    config.defaultFilters()
  )
  const [appliedFilters, setAppliedFilters] = useState<ListSalesQuery>(
    config.defaultFilters()
  )
  const [draftDateFilters, setDraftDateFilters] = useState(
    defaultSalesDateFilters()
  )
  const [appliedDateFilters, setAppliedDateFilters] = useState(
    defaultSalesDateFilters()
  )
  const [formKey, setFormKey] = useState(0)

  const { data, error, isPending, isFetching, refetch } = useSalesQuery({
    enterpriseId,
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

  const applyFiltersFromForm = useCallback(() => {
    const form = document.getElementById(config.formId)
    if (!form || !(form instanceof HTMLFormElement)) {
      setAppliedFilters({ ...draftFilters, offset: 0 })
      setAppliedDateFilters(draftDateFilters)
      return
    }

    const { filters: textFilters, dateFilters } = parseFiltersFromForm(form)

    if (
      dateFilters.dateFrom &&
      dateFilters.dateTo &&
      dateFilters.dateFrom > dateFilters.dateTo
    ) {
      toast.error("A data inicial não pode ser posterior à data final.")
      return
    }

    const nextFilters: ListSalesQuery = {
      ...draftFilters,
      offset: 0,
      orderNumber: textFilters.orderNumber,
      seller: textFilters.seller,
      client: textFilters.client,
    }

    setDraftFilters(nextFilters)
    setDraftDateFilters(dateFilters)
    setAppliedFilters(nextFilters)
    setAppliedDateFilters(dateFilters)
  }, [config.formId, draftFilters, draftDateFilters])

  const clearFilters = useCallback(() => {
    const reset = config.defaultFilters()
    const resetDate = defaultSalesDateFilters()
    setDraftFilters(reset)
    setAppliedFilters(reset)
    setDraftDateFilters(resetDate)
    setAppliedDateFilters(resetDate)
    setFormKey((key) => key + 1)
  }, [config])

  const visibleItems = useMemo(
    () =>
      data ? filterSalesItemsByDate(data.items, appliedDateFilters) : [],
    [data, appliedDateFilters]
  )

  const localDateFilterActive = hasActiveSalesDateFilters(appliedDateFilters)

  const { errMessage, errMeta } = useListErrorState(
    error,
    config.loadErrorMessage
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
      {leading}
      {error && data && <StaleDataBanner message={errMessage} />}
      {error && !data && !isPending && (
        <ListErrorCard
          title={config.loadErrorTitle}
          message={errMessage}
          meta={errMeta}
        />
      )}
      {data && !isPending && (
        <div className="space-y-6">
          <form
            key={formKey}
            id={config.formId}
            onSubmit={(e) => {
              e.preventDefault()
              applyFiltersFromForm()
            }}
          >
            {variant === "sales" ? (
              <SalesFilters
                filters={draftFilters}
                dateFilters={draftDateFilters}
                onChange={setDraftFilters}
                onApply={applyFiltersFromForm}
                onClear={clearFilters}
              />
            ) : (
              <BudgetsFilters
                filters={draftFilters}
                dateFilters={draftDateFilters}
                onChange={setDraftFilters}
                onApply={applyFiltersFromForm}
                onClear={clearFilters}
              />
            )}
          </form>

          {variant === "sales" ? (
            <SalesTable
              items={visibleItems}
              total={data.total}
              limit={data.limit}
              offset={data.offset}
              localFilterActive={localDateFilterActive}
              emptyMessage={config.emptyMessage}
              onPageChange={(offset) =>
                setAppliedFilters((f) => ({ ...f, offset }))
              }
            />
          ) : (
            <BudgetsTable
              items={visibleItems}
              total={data.total}
              limit={data.limit}
              offset={data.offset}
              localFilterActive={localDateFilterActive}
              emptyMessage={config.emptyMessage}
              onPageChange={(offset) =>
                setAppliedFilters((f) => ({ ...f, offset }))
              }
            />
          )}
        </div>
      )}
    </PaginatedListLayout>
  )
}
