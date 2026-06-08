"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { ProductStatusBadge } from "@/app/(app_routes)/products/_components/product-status-badge"
import {
  PaginatedListLayout,
  ListErrorCard,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import {
  PaginatedResourceTable,
} from "@/app/(app_routes)/products/_components/paginated-resource-table"
import { ProductsContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import { PRODUCTS_BASE_PATH } from "@/app/(app_routes)/products/_components/products-constants"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ListProductsQuery } from "@/modules/products/products.schema"
import { useProductsQuery } from "@/modules/products/use-products"

const DEFAULT_FILTERS: ListProductsQuery = { limit: 50, offset: 0 }

export default function GlobalProductsPage() {
  const perms = useOperatorPermissions()
  const [draftFilters, setDraftFilters] = useState<ListProductsQuery>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<ListProductsQuery>(DEFAULT_FILTERS)

  const { data, error, isPending, isFetching, refetch } = useProductsQuery({
    filters: appliedFilters,
    enabled: perms.isReady && perms.canConsultProducts,
  })

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: perms.isReady && !perms.isError && perms.canConsultProducts,
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

  const { errMessage, errMeta } = useListErrorState(
    error,
    "Não foi possível carregar o catálogo global."
  )

  if (!perms.isReady) {
    return (
      <PaginatedListLayout loading={<ProductsContentLoading />}>{null}</PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />
  if (!perms.canConsultProducts) {
    return <PermissionDeniedCard permissionLabel="consultar_produtos" />
  }

  return (
    <PaginatedListLayout loading={isPending ? <ProductsContentLoading /> : null}>
      {error && data && <StaleDataBanner message={errMessage} />}
      {error && !data && !isPending && (
        <ListErrorCard
          title="Erro ao carregar produtos globais"
          message={errMessage}
          meta={errMeta}
        />
      )}
      {data && !isPending && (
        <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={PRODUCTS_BASE_PATH}>
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-2xl font-semibold">Produtos globais</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Catálogo partilhado · {data.total} registo(s)
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select
                      value={draftFilters.status ?? "all"}
                      onValueChange={(v) =>
                        setDraftFilters({
                          ...draftFilters,
                          status:
                            v === "all"
                              ? undefined
                              : (v as ListProductsQuery["status"]),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="ATIVO">Ativo</SelectItem>
                        <SelectItem value="INATIVO">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Pesquisa</FieldLabel>
                    <Input
                      value={draftFilters.search ?? ""}
                      onChange={(e) =>
                        setDraftFilters({
                          ...draftFilters,
                          search: e.target.value || undefined,
                        })
                      }
                    />
                  </Field>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button type="button" onClick={applyFilters}>
                    Aplicar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDraftFilters(DEFAULT_FILTERS)
                      setAppliedFilters(DEFAULT_FILTERS)
                    }}
                  >
                    Limpar
                  </Button>
                </div>
              </div>

              <PaginatedResourceTable
                items={data.items}
                total={data.total}
                limit={data.limit}
                offset={data.offset}
                onPageChange={(offset) =>
                  setAppliedFilters((f) => ({ ...f, offset }))
                }
                basePath="/products/global"
                emptyTitle="Nenhum produto encontrado"
                emptyDescription="Ajuste os filtros."
                columns={[
                  { header: "Descrição", cell: (item) => item.description },
                  { header: "Cód. barras", cell: (item) => item.barCode },
                  {
                    header: "Status",
                    cell: (item) => <ProductStatusBadge status={item.status} />,
                  },
                ]}
                mobileTitle={(item) => item.description}
                mobileSubtitle={(item) => item.barCode}
              />
            </div>
          )}
    </PaginatedListLayout>
  )
}
