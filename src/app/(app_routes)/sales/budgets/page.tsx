import { SalesListPage } from "@/app/(app_routes)/sales/_components/sales-list-page"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"

export default function BudgetsPage() {
  return (
    <SalesListPage
      variant="budgets"
      leading={<RouteBreadcrumb currentLabel="Orçamentos" />}
    />
  )
}
