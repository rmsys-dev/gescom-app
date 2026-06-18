"use client"

import { SalesListPage } from "@/app/(app_routes)/sales/_components/sales-list-page"
import { RouteBreadcrumb } from "@/components/global/navigation/route-breadcrumb"
import { BUDGETS_ROUTE_CONFIG } from "@/modules/sales/sales-route-config"

export default function BudgetsPage() {
  return (
    <SalesListPage
      config={BUDGETS_ROUTE_CONFIG}
      leading={<RouteBreadcrumb currentLabel="Orçamentos" />}
    />
  )
}
