"use client"

import { useParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { z } from "zod"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import {
  ProductApplicationsSection,
  ProductDetailHeader,
  ProductEnterpriseDetailsCard,
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
import { PRODUCTS_ROUTE_CONFIG } from "@/modules/products/products-route-config"
import {
  usePricesQuery,
  useProductApplicationsQuery,
  useProductEnterpriseQuery,
  useProductTaxationListQuery,
  usePromotionalPricesQuery,
} from "@/modules/products/use-products"

const idSchema = z.uuid()
const config = PRODUCTS_ROUTE_CONFIG

export function ProductEnterpriseDetailPage() {
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
    () => pricesData?.items.find((p) => p.productsEnterprisesId === peId),
    [pricesData, peId]
  )
  const promos = useMemo(
    () =>
      promoData?.items.filter((p) => p.productsEnterprisesId === peId) ?? [],
    [promoData, peId]
  )
  const taxation = useMemo(
    () => taxData?.items.filter((t) => t.productsEnterprisesId === peId) ?? [],
    [taxData, peId]
  )
  const applications = useMemo(
    () => appsData?.items.filter((a) => a.productsEnterprisesId === peId) ?? [],
    [appsData, peId]
  )

  const { errMessage, errMeta } = useListErrorState(
    error,
    config.labels.loadDetailError
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
        <RouteBreadcrumb />
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>{config.labels.invalidIdTitle}</CardTitle>
            <CardDescription>{config.labels.invalidIdDescription}</CardDescription>
          </CardHeader>
        </Card>
      </PaginatedListLayout>
    )
  }

  const displayLabel = product?.description

  return (
    <PaginatedListLayout
      loading={isPending ? <ProductDetailContentLoading /> : null}
    >
      <RouteBreadcrumb currentLabel={displayLabel} />

      {Boolean(error) && product && (
        <StaleDataBanner
          title={config.labels.staleDetailTitle}
          message={errMessage}
        />
      )}

      {error && !product && !isPending && (
        <ListErrorCard
          title={config.labels.loadDetailErrorTitle}
          message={errMessage}
          meta={errMeta}
        />
      )}

      {product && !isPending && (
        <div className="space-y-6">
          <ProductDetailHeader product={product} />

          <div className="grid gap-6 lg:grid-cols-2">
            <ProductEnterpriseDetailsCard product={product} />
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
