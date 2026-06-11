import { SalesContentLoading } from "@/app/(app_routes)/sales/_components/sales-route-loading"
import { SALES_ROUTE_CONFIG } from "@/modules/sales/sales-route-config"

export default function SalesLoadingPage() {
  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <SalesContentLoading config={SALES_ROUTE_CONFIG} />
    </main>
  )
}
