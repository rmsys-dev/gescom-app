"use client"

import { useParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { z } from "zod"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import {
  ProductApplicationsSection,
  ProductEnterpriseDetailHeader,
  ProductEnterpriseInfoCard,
  ProductPriceSection,
  ProductPromotionalPricesSection,
  ProductTaxationSection,
} from "@/app/(app_routes)/products/_components/product-enterprise-field"
import { ProductDetailContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import {
  PermissionDeniedCard,
  PermissionsErrorCard,
  ListErrorCard,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
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
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <ProductDetailContentLoading />
      </main>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />
  if (!perms.canConsultProducts) {
    return <PermissionDeniedCard permissionLabel="consultar_produtos" />
  }

  if (!productEnterpriseId) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Identificador inválido</CardTitle>
            <CardDescription>O ID do produto não é válido.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      {isPending && <ProductDetailContentLoading />}

      {error && !product && !isPending && (
        <ListErrorCard
          title="Erro ao carregar produto"
          message={errMessage}
          meta={errMeta}
        />
      )}

      {product && !isPending && (
        <div className="space-y-6">
          <ProductEnterpriseDetailHeader description={product.description} />
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
    </main>
  )
}
