"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

import { BudgetClosureBadge } from "@/app/(app_routes)/sales/_components/budget-closure-badge"
import { SalesStatusBadge } from "@/app/(app_routes)/sales/_components/sales-status-badge"
import { Button } from "@/components/ui/button"
import { formatDateOnly } from "@/lib/formatters"
import { SALES_BASE_PATH } from "@/modules/sales/sales-constants"
import { formatCurrency } from "@/modules/sales/sales-labels"
import type { SaleSummary } from "@/modules/sales/sales.schema"

type BudgetsTableProps = {
  items: SaleSummary[]
  total: number
  limit: number
  offset: number
  localFilterActive?: boolean
  emptyMessage?: string
  onPageChange: (offset: number) => void
}

export function BudgetsTable({
  items,
  total,
  limit,
  offset,
  localFilterActive = false,
  emptyMessage = "Nenhum orçamento encontrado",
  onPageChange,
}: BudgetsTableProps) {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = offset > 0
  const canNext = offset + limit < total

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-dashed bg-card px-6 py-12 text-center">
          <p className="font-medium text-foreground">
            {localFilterActive
              ? "Nenhum resultado nesta página para o intervalo de datas"
              : emptyMessage}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {localFilterActive
              ? "Ajuste o intervalo de datas ou navegue para outra página."
              : "Ajuste os filtros de pesquisa."}
          </p>
        </div>
        {localFilterActive && total > 0 && (
          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              0 resultado(s) nesta página (filtro de data local) · Página {page} de{" "}
              {totalPages} · {total} registo(s)
            </p>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!canPrev}
                onClick={() => onPageChange(Math.max(0, offset - limit))}
                aria-label="Página anterior"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!canNext}
                onClick={() => onPageChange(offset + limit)}
                aria-label="Página seguinte"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Status do documento</th>
              <th className="px-4 py-3 font-medium">Situação de fechamento</th>
              <th className="px-4 py-3 font-medium">Vendedor</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Valor líquido</th>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">
                  #{item.orderNumber}
                </td>
                <td className="px-4 py-3">
                  <SalesStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3">
                  <BudgetClosureBadge situation={item.budgetClosureSituation} />
                </td>
                <td className="px-4 py-3">{item.memberName ?? item.UserName}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.memberName ? item.UserName : "—"}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatCurrency(item.valueLiquid)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDateOnly(item.completedionDate ?? item.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`${SALES_BASE_PATH}/${item.id}`}>
                      <Eye className="mr-1 size-4" />
                      Ver
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`${SALES_BASE_PATH}/${item.id}`}
            className="block rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">Pedido #{item.orderNumber}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.memberName ?? item.UserName}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <SalesStatusBadge status={item.status} />
                <BudgetClosureBadge situation={item.budgetClosureSituation} />
              </div>
            </div>
            <p className="mt-3 text-lg font-semibold">
              {formatCurrency(item.valueLiquid)}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          {localFilterActive
            ? `${items.length} resultado(s) nesta página (filtro de data local) · `
            : ""}
          Página {page} de {totalPages} · {total} registo(s)
        </p>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canPrev}
            onClick={() => onPageChange(Math.max(0, offset - limit))}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canNext}
            onClick={() => onPageChange(offset + limit)}
            aria-label="Página seguinte"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
