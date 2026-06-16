"use client"

import { PromotionalPricesListPage } from "@/app/(app_routes)/products/_components/promotional-prices-list-page"
import { PROMOTIONAL_PRICES_ROUTE_CONFIG } from "@/modules/products/products-route-config"

export default function PromotionalPricesPage() {
  return <PromotionalPricesListPage config={PROMOTIONAL_PRICES_ROUTE_CONFIG} />
}
