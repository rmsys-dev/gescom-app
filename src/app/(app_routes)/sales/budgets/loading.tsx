import { SalesContentLoading } from "@/app/(app_routes)/sales/_components/sales-route-loading"
import { BUDGETS_ROUTE_CONFIG } from "@/modules/sales/sales-route-config"

export default function BudgetsLoading() {
  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <SalesContentLoading config={BUDGETS_ROUTE_CONFIG} />
    </main>
  )
}
