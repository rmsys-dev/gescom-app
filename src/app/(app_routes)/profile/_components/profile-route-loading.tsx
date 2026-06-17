import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileContentLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar dados do perfil"
      className="space-y-6"
    >
      <div className="overflow-hidden  border bg-card">
        <div className="flex flex-col items-center gap-5 px-6 py-8 sm:flex-row sm:items-center">
          <Skeleton className="size-24 shrink-0" />
          <div className="flex w-full flex-col items-center gap-2 sm:items-start">
            <Skeleton className="h-7 w-48 max-w-full" />
            <Skeleton className="h-4 w-56 max-w-full" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-18 sm:col-span-2" />
          <Skeleton className="h-18" />
          <Skeleton className="h-18" />
        </CardContent>
      </Card>
    </div>
  )
}

export function ProfileRouteLoading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar perfil"
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-28 shrink-0" />
      </div>
      <ProfileContentLoading />
    </main>
  )
}
