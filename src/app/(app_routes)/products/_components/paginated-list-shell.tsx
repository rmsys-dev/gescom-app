"use client"

import type { ReactNode } from "react"
import {
  PermissionDeniedCard,
  PermissionsErrorCard,
} from "@/components/guards/permission-cards"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HttpError } from "@/lib/api/http-error"

export { PermissionDeniedCard, PermissionsErrorCard }

export function ListErrorCard({
  title,
  message,
  meta,
}: {
  title: string
  message: string
  meta: { code: string; status: number; requestId: string | null } | null
}) {
  return (
    <Card className="border-destructive/40 ring-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive">{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {meta && (
        <CardContent>
          <dl className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <div>
              <dt className="font-medium text-foreground">Código</dt>
              <dd className="font-mono">{meta.code}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">HTTP</dt>
              <dd>{meta.status}</dd>
            </div>
            <div className="min-w-0">
              <dt className="font-medium text-foreground">Request ID</dt>
              <dd className="truncate font-mono">{meta.requestId ?? "—"}</dd>
            </div>
          </dl>
        </CardContent>
      )}
    </Card>
  )
}

export function StaleDataBanner({
  message,
  title = "Não foi possível atualizar a lista.",
  showStaleNote = true,
}: {
  message: string
  title?: string
  showStaleNote?: boolean
}) {
  return (
    <div
      role="status"
      className="border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-amber-900/90 dark:text-amber-50/90">
        {message}
        {showStaleNote ? ". Os valores abaixo podem estar desatualizados." : ""}
      </p>
    </div>
  )
}

export function useListErrorState(error: unknown, fallbackMessage: string) {
  const errMessage =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : fallbackMessage

  const errMeta =
    error instanceof HttpError
      ? { code: error.code, status: error.status, requestId: error.requestId }
      : null

  return { errMessage, errMeta }
}

export function PaginatedListLayout({
  loading,
  children,
}: {
  loading: ReactNode
  children: ReactNode
}) {
  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      {loading}
      {children}
    </main>
  )
}
