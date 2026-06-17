import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SelectEnterpriseRouteLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar seleção de empresa"
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-full max-w-xs" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-17 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
