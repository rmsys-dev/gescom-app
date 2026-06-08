"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import {
  ProductsListHeader,
} from "@/app/(app_routes)/products/_components/product-enterprise-field"
import { ProductsContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import {
  defaultProductsEnterprisesFilters,
} from "@/app/(app_routes)/products/_components/products-constants"
import { ProductsFilters } from "@/app/(app_routes)/products/_components/products-filters"
import { ProductsTable } from "@/app/(app_routes)/products/_components/products-table"
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
import type { ListProductsEnterprisesQuery } from "@/modules/products/products.schema"
import { useProductsEnterprisesQuery } from "@/modules/products/use-products"

export default function ProductsPage() {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const [draftFilters, setDraftFilters] = useState<ListProductsEnterprisesQuery>(
    defaultProductsEnterprisesFilters()
  )
  const [appliedFilters, setAppliedFilters] =
    useState<ListProductsEnterprisesQuery>(defaultProductsEnterprisesFilters())

  const { data, error, isPending, isFetching, refetch } =
    useProductsEnterprisesQuery({
      filters: appliedFilters,
      enabled: ready && perms.canConsultProducts,
    })

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: ready && perms.isReady && !perms.isError && perms.canConsultProducts,
  })

  const applyFilters = useCallback(() => {
    const search = draftFilters.search?.trim()
    if (search !== undefined && search.length > 0 && search.length < 1) {
      toast.error("A pesquisa deve ter pelo menos 1 caractere.")
      return
    }
    setAppliedFilters({
      ...draftFilters,
      offset: 0,
      search: search && search.length > 0 ? search : undefined,
    })
  }, [draftFilters])

  const clearFilters = useCallback(() => {
    const reset = defaultProductsEnterprisesFilters()
    setDraftFilters(reset)
    setAppliedFilters(reset)
  }, [])

  const { errMessage, errMeta } = useListErrorState(
    error,
    "Não foi possível carregar os produtos."
  )

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout loading={<ProductsContentLoading />}>{null}</PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />

  if (!perms.canConsultProducts) {
    return (
      <PermissionDeniedCard permissionLabel="consultar_produtos" />
    )
  }

  return (
    <PaginatedListLayout loading={isPending ? <ProductsContentLoading /> : null}>
      {error && data && <StaleDataBanner message={errMessage} />}
      {error && !data && !isPending && (
        <ListErrorCard
          title="Erro ao carregar produtos"
          message={errMessage}
          meta={errMeta}
        />
      )}
      {data && !isPending && (
        <div className="space-y-6">
          <ProductsListHeader total={data.total} />
          <form
            onSubmit={(e) => {
              e.preventDefault()
              applyFilters()
            }}
          >
            <ProductsFilters
              filters={draftFilters}
              onChange={setDraftFilters}
              onApply={applyFilters}
              onClear={clearFilters}
            />
          </form>
          <ProductsTable
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
