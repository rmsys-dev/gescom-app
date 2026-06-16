"use client"

import { useParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { z } from "zod"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import {
  ProductApplicationsSection,
  ProductEnterpriseInfoCard,
  ProductPriceSection,
  ProductPromotionalPricesSection,
  ProductTaxationSection,
} from "@/app/(app_routes)/products/_components/product-enterprise-field"
import { ProductDetailContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import {
  ListErrorCard,
  PaginatedListLayout,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import {
  usePricesQuery,
  useProductApplicationsQuery,
  useProductEnterpriseQuery,
  useProductTaxationListQuery,
  usePromotionalPricesQuery,
} from "@/modules/products/use-products"

const idSchema = z.uuid()

export default function ProductEnterpriseDetailPage() {
  const params = useParams()
  const rawId =
    typeof params.productEnterpriseId === "string"
      ? params.productEnterpriseId
      : ""
  const idResult = idSchema.safeParse(rawId)
  const productEnterpriseId = idResult.success ? idResult.data : null

  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const {
    data: product,
    error,
    isPending,
    isFetching,
    refetch,
  } = useProductEnterpriseQuery({
    productEnterpriseId: productEnterpriseId ?? undefined,
    enabled: ready && perms.canConsultProducts && Boolean(productEnterpriseId),
  })

  const peId = product?.id

  const { data: pricesData } = usePricesQuery({
    enabled: ready && perms.canConsultPrices && Boolean(peId),
  })
  const { data: promoData } = usePromotionalPricesQuery({
    enabled: ready && perms.canConsultPromotionalPrices && Boolean(peId),
  })
  const { data: taxData } = useProductTaxationListQuery({
    enabled: ready && perms.canConsultProductTaxation && Boolean(peId),
  })
  const { data: appsData } = useProductApplicationsQuery({
    enabled: ready && perms.canConsultProductApplications && Boolean(peId),
  })

  const price = useMemo(
    () =>
      pricesData?.items.find((p) => p.productsEnterprisesId === peId),
    [pricesData, peId]
  )
  const promos = useMemo(
    () =>
      promoData?.items.filter((p) => p.productsEnterprisesId === peId) ?? [],
    [promoData, peId]
  )
  const taxation = useMemo(
    () =>
      taxData?.items.filter((t) => t.productsEnterprisesId === peId) ?? [],
    [taxData, peId]
  )
  const applications = useMemo(
    () =>
      appsData?.items.filter((a) => a.productsEnterprisesId === peId) ?? [],
    [appsData, peId]
  )

  const { errMessage, errMeta } = useListErrorState(
    error,
    "Não foi possível carregar o produto."
  )

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled:
      ready &&
      perms.isReady &&
      !perms.isError &&
      perms.canConsultProducts &&
      Boolean(productEnterpriseId),
  })

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout loading={<ProductDetailContentLoading />}>
        {null}
      </PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />
  if (!perms.canConsultProducts) {
    return <PermissionDeniedCard permissionLabel="consultar_produtos" />
  }

  if (!productEnterpriseId) {
    return (
      <PaginatedListLayout loading={null}>
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Identificador inválido</CardTitle>
            <CardDescription>O ID do produto não é válido.</CardDescription>
          </CardHeader>
        </Card>
      </PaginatedListLayout>
    )
  }

  return (
    <PaginatedListLayout
      loading={isPending ? <ProductDetailContentLoading /> : null}
    >
      {Boolean(error) && product && <StaleDataBanner message={errMessage} />}
      {error && !product && !isPending && (
        <ListErrorCard
          title="Erro ao carregar produto"
          message={errMessage}
          meta={errMeta}
        />
      )}
      {product && !isPending && (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <RouteBreadcrumb currentLabel={product.description} />
            <h1 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              {product.description}
            </h1>
          </div>
          <ProductEnterpriseInfoCard product={product} />
          <div className="grid gap-6 lg:grid-cols-2">
            <ProductPriceSection
              price={price}
              canConsult={perms.canConsultPrices}
            />
            <ProductPromotionalPricesSection
              items={promos}
              canConsult={perms.canConsultPromotionalPrices}
            />
            <ProductTaxationSection
              items={taxation}
              canConsult={perms.canConsultProductTaxation}
            />
            <ProductApplicationsSection
              items={applications}
              canConsult={perms.canConsultProductApplications}
            />
          </div>
        </div>
      )}
    </PaginatedListLayout>
  )
}
