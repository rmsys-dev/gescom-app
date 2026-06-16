"use client"

import { useMemo, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
} from "lucide-react"

import { ProductActionsMenu } from "@/app/(app_routes)/products/_components/product-actions-menu"
import { ProductDetailDialog } from "@/app/(app_routes)/products/_components/product-detail-dialog"
import { ProductStatusBadge } from "@/app/(app_routes)/products/_components/product-status-badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import type { ProductEnterprise } from "@/modules/products/products.schema"

type ProductsListTableProps = {
  items: ProductEnterprise[]
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

export function ProductsListTable({
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
}: ProductsListTableProps) {
  const [viewProductId, setViewProductId] = useState<string | null>(null)

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

  function openProductView(productId: string) {
    setViewProductId(productId)
  }

  const listLabel = `Lista de ${config.labels.plural}`

  if (items.length === 0) {
    return (
      <div
        role="status"
        className="rounded-lg border border-dashed bg-card px-6 py-16 text-center"
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
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm" aria-label={listLabel}>
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Código
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Descrição
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Cód. barras
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Lote
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
                onClick={() => openProductView(item.id)}
                className={cn(
                  "cursor-pointer border-b transition-colors last:border-0",
                  "hover:bg-primary/5 focus-within:bg-primary/5",
                  idx % 2 === 1 && "bg-muted/20"
                )}
                tabIndex={0}
                role="row"
                aria-label={`Ver detalhes de ${item.description}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    openProductView(item.id)
                  }
                }}
              >
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {item.code ?? "—"}
                </td>
                <td className="px-4 py-3">{item.description}</td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {item.barCode}
                </td>
                <td className="px-4 py-3">
                  <ProductStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.controlsBatch ? "Sim" : "Não"}
                </td>
                <td
                  className="px-4 py-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ProductActionsMenu
                    productId={item.id}
                    basePath={config.basePath}
                    onView={() => openProductView(item.id)}
                  />
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
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{item.description}</p>
                <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                  {item.code ?? "—"}
                </p>
                <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                  {item.barCode}
                </p>
              </div>
              <ProductStatusBadge status={item.status} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Lote: {item.controlsBatch ? "Sim" : "Não"}
            </p>
            <Button
              type="button"
              className="mt-3 w-full"
              variant="outline"
              size="sm"
              onClick={() => openProductView(item.id)}
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

      {viewProductId && (
        <ProductDetailDialog
          productEnterpriseId={viewProductId}
          config={config}
          open={viewProductId !== null}
          onOpenChange={(open) => {
            if (!open) setViewProductId(null)
          }}
        />
      )}
    </div>
  )
}
