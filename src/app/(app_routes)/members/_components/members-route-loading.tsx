import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"

function ListContentLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className="space-y-6"
    >
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full rounded-lg" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-48 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}

function DetailContentLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-end">
            <Skeleton className="size-9 shrink-0 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Skeleton className="size-24 shrink-0 rounded-full" />
          </div>
          <Skeleton className="mx-auto h-7 w-48" />
          <Skeleton className="mx-auto h-6 w-32 rounded-full" />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-18 rounded-lg sm:col-span-2" />
            <Skeleton className="h-18 rounded-lg" />
            <Skeleton className="h-18 rounded-lg" />
            <Skeleton className="h-18 rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-18 rounded-lg" />
            <Skeleton className="h-18 rounded-lg" />
            <Skeleton className="h-18 rounded-lg sm:col-span-2" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  )
}

function FormContentLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className="space-y-6"
    >
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-18 rounded-lg sm:col-span-2" />
          <Skeleton className="h-18 rounded-lg" />
          <Skeleton className="h-18 rounded-lg" />
          <Skeleton className="h-18 rounded-lg" />
          <Skeleton className="h-18 rounded-lg sm:col-span-2" />
          <Skeleton className="h-10 w-36 rounded-md sm:col-span-2" />
        </CardContent>
      </Card>
    </div>
  )
}

export function MembershipRouteLoading({
  config,
}: {
  config: MembershipRouteConfig
}) {
  return (
    <main
      className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={config.labels.loadingRoute}
    >
      <ListContentLoading label={config.labels.loadingRoute} />
    </main>
  )
}

export function MembershipContentLoading({
  config,
}: {
  config: MembershipRouteConfig
}) {
  return <ListContentLoading label={config.labels.loadingList} />
}

export function MembershipDetailContentLoading({
  config,
}: {
  config: MembershipRouteConfig
}) {
  return <DetailContentLoading label={config.labels.loadingDetail} />
}

export function MembershipFormContentLoading({
  config,
}: {
  config: MembershipRouteConfig
}) {
  return <FormContentLoading label={config.labels.loadingForm} />
}
