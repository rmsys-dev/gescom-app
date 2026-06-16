"use client"

import { ProductsListPage } from "@/app/(app_routes)/products/_components/products-list-page"
import { PRODUCTS_ROUTE_CONFIG } from "@/modules/products/products-route-config"

export default function ProductsPage() {
  return <ProductsListPage config={PRODUCTS_ROUTE_CONFIG} />
}
