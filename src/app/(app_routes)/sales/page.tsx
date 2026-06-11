"use client"

import { SalesListPage } from "@/app/(app_routes)/sales/_components/sales-list-page"
import { SALES_ROUTE_CONFIG } from "@/modules/sales/sales-route-config"

export default function SalesPage() {
  return <SalesListPage config={SALES_ROUTE_CONFIG} />
}
