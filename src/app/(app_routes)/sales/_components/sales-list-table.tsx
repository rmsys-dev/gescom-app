"use client"

import { useMemo, useState } from "react"
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
} from "lucide-react"

import { BudgetClosureBadge } from "@/app/(app_routes)/sales/_components/budget-closure-badge"
import { SaleDetailDialog } from "@/app/(app_routes)/sales/_components/sale-detail-dialog"
import { SalesActionsMenu } from "@/app/(app_routes)/sales/_components/sales-actions-menu"
import { SalesStatusBadge } from "@/app/(app_routes)/sales/_components/sales-status-badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDateOnly, formatPersonName } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import {
  RETURN_SITUATION_LABELS,
  formatCurrency,
} from "@/modules/sales/sales-labels"
import type { SalesListRouteConfig } from "@/modules/sales/sales-route-config"
import type { SaleSummary } from "@/modules/sales/sales.schema"

type SortKey =
  | "orderNumber"
  | "status"
  | "budgetClosureSituation"
  | "seller"
  | "client"
  | "valueLiquid"
  | "date"
type SortDir = "asc" | "desc"
type SortState = { key: SortKey; dir: SortDir } | null

type SalesListTableProps = {
  items: SaleSummary[]
  total: number
  limit: number
  offset: number
  config: SalesListRouteConfig
  emptyTitle: string
  emptyHint: string
  onPageChange: (offset: number) => void
  onLimitChange?: (limit: number) => void
  onClearFilters?: () => void
}

const PAGE_SIZE_OPTIONS = [20, 50, 100]

function SortIndicator({
  column,
  sort,
}: {
  column: SortKey
  sort: SortState
}) {
  if (!sort || sort.key !== column) {
    return (
      <ArrowUpDown
        className="ml-1 inline size-3 shrink-0 opacity-35"
        aria-hidden
      />
    )
  }
  return (
    <span className="ml-1 inline text-[10px] font-bold" aria-hidden>
      {sort.dir === "asc" ? "↑" : "↓"}
    </span>
  )
}

function SortableTh({
  column,
  sort,
  onSort,
  children,
  className,
}: {
  column: SortKey
  sort: SortState
  onSort: (key: SortKey) => void
  children: React.ReactNode
  className?: string
}) {
  const isActive = sort?.key === column
  const ariaSortValue =
    isActive ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"

  return (
    <th
      scope="col"
      className={cn(
        "cursor-pointer select-none px-4 py-3 text-left font-medium transition-colors hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground",
        className
      )}
      onClick={() => onSort(column)}
      aria-sort={ariaSortValue}
    >
      {children}
      <SortIndicator column={column} sort={sort} />
    </th>
  )
}

function getSaleDate(item: SaleSummary): string {
  return item.completedionDate ?? item.createdAt
}

export function SalesListTable({
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
}: SalesListTableProps) {
  const [sort, setSort] = useState<SortState>(null)
  const [viewSaleId, setViewSaleId] = useState<string | null>(null)

  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = offset > 0
  const canNext = offset + limit < total
  const sortedItems = useMemo(() => {
    if (!sort) return items
    return [...items].sort((a, b) => {
      let valA: string | number = ""
      let valB: string | number = ""
      switch (sort.key) {
        case "orderNumber":
          valA = a.orderNumber
          valB = b.orderNumber
          break
        case "status":
          valA = a.status
          valB = b.status
          break
        case "budgetClosureSituation":
          valA = a.budgetClosureSituation
          valB = b.budgetClosureSituation
          break
        case "seller":
          valA = formatPersonName(a.sellerLegalName)
          valB = formatPersonName(b.sellerLegalName)
          break
        case "client":
          valA = formatPersonName(a.memberName)
          valB = formatPersonName(b.memberName)
          break
        case "valueLiquid":
          valA = Number(a.valueLiquid)
          valB = Number(b.valueLiquid)
          break
        case "date":
          valA = getSaleDate(a)
          valB = getSaleDate(b)
          break
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return sort.dir === "asc" ? valA - valB : valB - valA
      }
      const cmp = String(valA).localeCompare(String(valB), "pt-BR")
      return sort.dir === "asc" ? cmp : -cmp
    })
  }, [items, sort])

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" }
      if (prev.dir === "asc") return { key, dir: "desc" }
      return null
    })
  }

  function openSaleView(saleId: string) {
    setViewSaleId(saleId)
  }

  const pageNumbers = useMemo(() => {
    const total5 = Math.min(5, totalPages)
    let start: number
    if (totalPages <= 5) start = 1
    else if (page <= 3) start = 1
    else if (page >= totalPages - 2) start = totalPages - 4
    else start = page - 2
    return Array.from({ length: total5 }, (_, i) => start + i)
  }, [page, totalPages])

  const listLabel =
    config.variant === "budgets" ? "Lista de orçamentos" : "Lista de vendas"

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
    <div className="space-y-3">
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm" aria-label={listLabel}>
          <thead className="border-b bg-muted/40 text-xs">
            <tr>
              <SortableTh
                column="orderNumber"
                sort={sort}
                onSort={toggleSort}
              >
                Pedido
              </SortableTh>
              {config.list.showBudgetClosureFilter ? (
                <SortableTh
                  column="budgetClosureSituation"
                  sort={sort}
                  onSort={toggleSort}
                >
                  Status
                </SortableTh>
              ) : (
                <SortableTh column="status" sort={sort} onSort={toggleSort}>
                  Status
                </SortableTh>
              )}
              <SortableTh column="seller" sort={sort} onSort={toggleSort}>
                Vendedor
              </SortableTh>
              <SortableTh column="client" sort={sort} onSort={toggleSort}>
                Cliente
              </SortableTh>
              <SortableTh
                column="valueLiquid"
                sort={sort}
                onSort={toggleSort}
              >
                Valor líquido
              </SortableTh>
              {config.list.showReturnColumn && (
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"
                >
                  Devolução
                </th>
              )}
              <SortableTh column="date" sort={sort} onSort={toggleSort}>
                Data
              </SortableTh>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-muted-foreground"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, idx) => (
              <tr
                key={item.id}
                onClick={() => openSaleView(item.id)}
                className={cn(
                  "cursor-pointer border-b transition-colors last:border-0",
                  "hover:bg-primary/5 focus-within:bg-primary/5",
                  idx % 2 === 1 && "bg-muted/20"
                )}
                tabIndex={0}
                role="row"
                aria-label={`Ver detalhes do pedido ${item.orderNumber}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    openSaleView(item.id)
                  }
                }}
              >
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  #{item.orderNumber}
                </td>
                <td className="px-4 py-3">
                  {config.list.showBudgetClosureFilter ? (
                    <BudgetClosureBadge
                      situation={item.budgetClosureSituation}
                    />
                  ) : (
                    <SalesStatusBadge status={item.status} />
                  )}
                </td>
                <td className="max-w-[200px] px-4 py-3 text-muted-foreground">
                  <span
                    className="block truncate"
                    title={formatPersonName(item.sellerLegalName)}
                  >
                    {formatPersonName(item.sellerLegalName)}
                  </span>
                </td>
                <td className="max-w-[200px] px-4 py-3 text-muted-foreground">
                  <span
                    className="block truncate"
                    title={
                      item.memberName
                        ? formatPersonName(item.memberName)
                        : undefined
                    }
                  >
                    {formatPersonName(item.memberName)}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">
                  {formatCurrency(item.valueLiquid)}
                </td>
                {config.list.showReturnColumn && (
                  <td className="px-4 py-3 text-muted-foreground">
                    {RETURN_SITUATION_LABELS[item.returnSituation] ??
                      item.returnSituation}
                  </td>
                )}
                <td className="px-4 py-3 text-muted-foreground tabular-nums">
                  {formatDateOnly(getSaleDate(item))}
                </td>
                <td
                  className="px-4 py-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <SalesActionsMenu
                    saleId={item.id}
                    basePath={config.basePath}
                    onView={() => openSaleView(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={listLabel}>
        {sortedItems.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium">Pedido #{item.orderNumber}</p>
                <p
                  className="mt-0.5 truncate text-sm text-muted-foreground"
                  title={formatPersonName(item.memberName)}
                >
                  {formatPersonName(item.memberName)}
                </p>
                <p
                  className="mt-0.5 truncate text-sm text-muted-foreground"
                  title={formatPersonName(item.sellerLegalName)}
                >
                  Vendedor: {formatPersonName(item.sellerLegalName)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {config.list.showBudgetClosureFilter ? (
                  <BudgetClosureBadge
                    situation={item.budgetClosureSituation}
                  />
                ) : (
                  <SalesStatusBadge status={item.status} />
                )}
              </div>
            </div>
            <p className="mt-3 text-lg font-semibold tabular-nums">
              {formatCurrency(item.valueLiquid)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground tabular-nums">
              {formatDateOnly(getSaleDate(item))}
            </p>
            <Button
              type="button"
              className="mt-3 w-full"
              variant="outline"
              size="sm"
              onClick={() => openSaleView(item.id)}
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

      {viewSaleId && (
        <SaleDetailDialog
          saleId={viewSaleId}
          config={config}
          open={viewSaleId !== null}
          onOpenChange={(open) => {
            if (!open) setViewSaleId(null)
          }}
        />
      )}
    </div>
  )
}
