"use client"

import type { ReactNode } from "react"
import { SearchX } from "lucide-react"

import { PaginatedListControls } from "@/app/(app_routes)/products/_components/paginated-list-controls"
import { Button } from "@/components/ui/button"
import {
  Card,
} from "@/components/ui/card"

export type ResourceCardField<T> = {
  label: string
  value: (item: T) => ReactNode
}

type PaginatedResourceGridProps<T extends { id: string }> = {
  items: T[]
  total: number
  limit: number
  offset: number
  onPageChange: (offset: number) => void
  onLimitChange?: (limit: number) => void
  emptyTitle: string
  emptyDescription: string
  cardTitle: (item: T) => string
  cardFields?: ResourceCardField<T>[]
  onClearFilters?: () => void
  listLabel?: string
}

export function PaginatedResourceGrid<T extends { id: string }>({
  items,
  total,
  limit,
  offset,
  onPageChange,
  onLimitChange,
  emptyTitle,
  emptyDescription,
  cardTitle,
  cardFields,
  onClearFilters,
  listLabel = "Lista de registros",
}: PaginatedResourceGridProps<T>) {
  if (items.length === 0) {
    return (
      <div
        role="status"
        className="border border-dashed bg-card px-6 py-16 text-center"
      >
        <SearchX
          className="mx-auto mb-4 size-10 text-muted-foreground/40"
          aria-hidden
        />
        <p className="font-semibold text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>
        {onClearFilters && (
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={onClearFilters}
          >
            Limpar filtros
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ul
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label={listLabel}
      >
        {items.map((item) => (
          <li key={item.id}>
            <Card className="flex h-full flex-col items-center justify-center gap-2 p-4">
              <p className="text-center text-sm font-medium text-foreground">
                {cardTitle(item)}
              </p>
              {cardFields?.map((field) => (
                <p key={field.label} className="text-center text-sm">
                  <span className="text-muted-foreground">{field.label}: </span>
                  <span className="text-foreground">{field.value(item)}</span>
                </p>
              ))}
            </Card>
          </li>
        ))}
      </ul>

      <PaginatedListControls
        total={total}
        limit={limit}
        offset={offset}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  )
}
