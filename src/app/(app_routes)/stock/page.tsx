import { RouteBreadcrumb } from "@/components/global/navigation/route-breadcrumb"
import { StockMiniDashboard } from "@/app/(app_routes)/stock/_components/stock-mini-dashboard"

export default function StockIndexPage() {
  return (
    <div className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <RouteBreadcrumb />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Estoque</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral do estoque da empresa
          </p>
        </div>
      </div>

      <StockMiniDashboard />
    </div>
  )
}
