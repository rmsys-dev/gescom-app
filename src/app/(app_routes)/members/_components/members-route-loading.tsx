import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"

const SKELETON_ROW_COUNT = 8

function ListContentLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className="space-y-6"
    >
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="border bg-card p-4 shadow-sm space-y-4">
        <Skeleton className="h-9 w-full" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[62px]" />
          <Skeleton className="h-[62px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-48" />
        <div className="overflow-hidden border">
          {/* Header row */}
          <div className="border-b bg-muted/40 px-4 py-3">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-3" />
              ))}
            </div>
          </div>
          {/* Data rows */}
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
            <div
              key={i}
              className={
                "border-b px-4 py-3 last:border-0" +
                (i % 2 === 1 ? " bg-muted/20" : "")
              }
            >
              <div className="grid grid-cols-5 gap-4 items-center">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-5 w-14" />
              </div>
            </div>
          ))}
        </div>
        {/* Pagination skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="size-7" />
            ))}
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
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
            <Skeleton className="size-9 shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Skeleton className="size-24 shrink-0" />
          </div>
          <Skeleton className="mx-auto h-7 w-48" />
          <Skeleton className="mx-auto h-6 w-32" />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-18 sm:col-span-2" />
            <Skeleton className="h-18" />
            <Skeleton className="h-18" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-18" />
            <Skeleton className="h-18" />
            <Skeleton className="h-18 sm:col-span-2" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

function PageHeaderSkeleton({ withNote = true }: { withNote?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      {withNote && <Skeleton className="h-4 w-full max-w-xl" />}
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
      <PageHeaderSkeleton />
      <Card>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
          <Skeleton className="h-18 sm:col-span-2" />
          <Skeleton className="h-18" />
          <Skeleton className="h-18" />
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

export function MemberDetailLoading({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="A carregar detalhe do membro"
        className="space-y-4"
      >
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-40" />
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar detalhe do membro"
      className="space-y-6"
    >
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export function MembershipFormContentLoading({
  config,
}: {
  config: MembershipRouteConfig
}) {
  return <FormContentLoading label={config.labels.loadingForm} />
}

function LinkTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-48" />
      <div className="overflow-hidden border">
        <div className="border-b bg-muted/40 px-4 py-3">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-3" />
            ))}
          </div>
        </div>
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
          <div
            key={i}
            className={
              "border-b px-4 py-3 last:border-0" +
              (i % 2 === 1 ? " bg-muted/20" : "")
            }
          >
            <div className="grid grid-cols-4 items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-2/5" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="size-7" />
          ))}
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

function LinkContentLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className="space-y-6"
    >
      <PageHeaderSkeleton />
      <div className="border bg-card p-4 shadow-sm space-y-4">
        <Skeleton className="h-9 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <LinkTableSkeleton />
      <div className="flex justify-end border-t pt-4">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  )
}

export function MembershipLinkTableLoading({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <LinkTableSkeleton />
    </div>
  )
}

export function MembershipLinkContentLoading({
  config,
}: {
  config: MembershipRouteConfig
}) {
  return <LinkContentLoading label={config.labels.loadingForm} />
}
