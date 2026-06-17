"use client"

import { useMemo, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
} from "lucide-react"

import { PromotionalPriceActionsMenu } from "@/app/(app_routes)/products/_components/promotional-price-actions-menu"
import { PromotionalPriceDetailDialog } from "@/app/(app_routes)/products/_components/promotional-price-detail-dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import type { PromotionalPrice } from "@/modules/products/products-tenant-extras.schema"

type PromotionalPricesListTableProps = {
  items: PromotionalPrice[]
  total: number
  limit: number
  offset: number
  config: ProductsListRouteConfig
  emptyTitle: string
  emptyHint: string
  onPageChange: (offset: number) => void
  onLimitChange?: (limit: number) => void
  onClearFilters?: () => void
}

const PAGE_SIZE_OPTIONS = [20, 50, 100]

export function PromotionalPricesListTable({
  items,
  total,
  limit,
  offset,
  config,
  emptyTitle,
  emptyHint,
  onPageChange,
  onLimitChange,
  onClearFilters,
}: PromotionalPricesListTableProps) {
  const [viewId, setViewId] = useState<string | null>(null)

  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = offset > 0
  const canNext = offset + limit < total

  const pageNumbers = useMemo(() => {
    const total5 = Math.min(5, totalPages)
    let start: number
    if (totalPages <= 5) start = 1
    else if (page <= 3) start = 1
    else if (page >= totalPages - 2) start = totalPages - 4
    else start = page - 2
    return Array.from({ length: total5 }, (_, i) => start + i)
  }, [page, totalPages])

  function openView(id: string) {
    setViewId(id)
  }

  const listLabel = `Lista de ${config.labels.plural}`

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
        <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
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
      <div className="hidden overflow-hidden border md:block">
        <table className="w-full text-sm" aria-label={listLabel}>
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Preço
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Descrição
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                onClick={() => openView(item.id)}
                className={cn(
                  "cursor-pointer border-b transition-colors last:border-0",
                  "hover:bg-primary/5 focus-within:bg-primary/5",
                  idx % 2 === 1 && "bg-muted/20"
                )}
                tabIndex={0}
                role="row"
                aria-label={`Ver detalhes de ${item.description ?? formatCurrency(item.price)}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    openView(item.id)
                  }
                }}
              >
                <td className="px-4 py-3 font-medium tabular-nums">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-4 py-3">{item.description ?? "—"}</td>
                <td
                  className="px-4 py-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PromotionalPriceActionsMenu onView={() => openView(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={listLabel}>
        {items.map((item) => (
          <li
            key={item.id}
            className="border bg-card p-4 shadow-sm"
          >
            <div className="min-w-0">
              <p className="font-medium tabular-nums">
                {formatCurrency(item.price)}
              </p>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {item.description ?? "—"}
              </p>
            </div>
            <Button
              type="button"
              className="mt-3 w-full"
              variant="outline"
              size="sm"
              onClick={() => openView(item.id)}
            >
              Visualizar
            </Button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="shrink-0">Registros por página:</span>
          <Select
            value={String(limit)}
            onValueChange={(v) => onLimitChange?.(Number(v))}
            disabled={!onLimitChange}
          >
            <SelectTrigger
              className="h-7 w-[72px] text-xs"
              aria-label="Registros por página"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className="flex items-center gap-1"
          role="navigation"
          aria-label="Paginação"
        >
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canPrev}
            onClick={() => onPageChange(0)}
            tooltip="Primeira página"
            aria-label="Primeira página"
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canPrev}
            onClick={() => onPageChange(Math.max(0, offset - limit))}
            tooltip="Página anterior"
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              type="button"
              variant={pageNum === page ? "default" : "outline"}
              size="icon-sm"
              onClick={() => onPageChange((pageNum - 1) * limit)}
              aria-label={`Página ${pageNum}`}
              aria-current={pageNum === page ? "page" : undefined}
            >
              {pageNum}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canNext}
            onClick={() => onPageChange(offset + limit)}
            tooltip="Próxima página"
            aria-label="Próxima página"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canNext}
            onClick={() => onPageChange((totalPages - 1) * limit)}
            tooltip="Última página"
            aria-label="Última página"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>

        <span
          className="text-sm text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          Página {page} de {totalPages}
        </span>
      </div>

      {viewId && (
        <PromotionalPriceDetailDialog
          promotionalPriceId={viewId}
          config={config}
          open={viewId !== null}
          onOpenChange={(open) => {
            if (!open) setViewId(null)
          }}
        />
      )}
    </div>
  )
}
