"use client"

import { Loader2, Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SalesDateFilters } from "@/modules/sales/sales-constants"
import type { ListSalesQuery } from "@/modules/sales/sales.schema"
import {
  BUDGET_CLOSURE_LABELS,
  SALE_STATUS_LABELS,
} from "@/modules/sales/sales-labels"

export type SalesFiltersProps = {
  filters: ListSalesQuery
  dateFilters: SalesDateFilters
  searchTerm: string
  onSearchTermChange: (term: string) => void
  onFiltersChange: (filters: ListSalesQuery) => void
  onDateFiltersChange: (dateFilters: SalesDateFilters) => void
  onSearch: () => void
  onApplyFilters: () => void
  onClear: () => void
  isSearching?: boolean
  showBudgetClosureFilter?: boolean
}

const ALL = "all"

export function SalesFilters({
  filters,
  dateFilters,
  searchTerm,
  onSearchTermChange,
  onFiltersChange,
  onDateFiltersChange,
  onSearch,
  onApplyFilters,
  onClear,
  isSearching = false,
  showBudgetClosureFilter = false,
}: SalesFiltersProps) {
  const hasActiveCriteria =
    searchTerm.trim() !== "" ||
    (!showBudgetClosureFilter && Boolean(filters.status)) ||
    (showBudgetClosureFilter && Boolean(filters.budgetClosureSituation)) ||
    Boolean(dateFilters.dateFrom) ||
    Boolean(dateFilters.dateTo)

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      onSearch()
    }
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Busca
        </p>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            id="sales-search-term"
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pedido, vendedor ou cliente"
            className="pl-9 pr-9"
            disabled={isSearching}
            aria-label="Buscar por pedido, vendedor ou cliente"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchTermChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Limpar busca"
              disabled={isSearching}
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Filtros
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {!showBudgetClosureFilter && (
            <Field>
              <FieldLabel htmlFor="sale-status">Status</FieldLabel>
              <Select
                value={filters.status ?? ALL}
                onValueChange={(v) =>
                  onFiltersChange({
                    ...filters,
                    status:
                      v === ALL ? undefined : (v as ListSalesQuery["status"]),
                  })
                }
                disabled={isSearching}
              >
                <SelectTrigger id="sale-status" className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos</SelectItem>
                  {Object.entries(SALE_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="filter-date-from">De</FieldLabel>
            <Input
              id="filter-date-from"
              name="dateFrom"
              type="date"
              value={dateFilters.dateFrom ?? ""}
              onChange={(e) =>
                onDateFiltersChange({
                  ...dateFilters,
                  dateFrom: e.target.value || undefined,
                })
              }
              disabled={isSearching}
              aria-label="Data inicial"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="filter-date-to">Até</FieldLabel>
            <Input
              id="filter-date-to"
              name="dateTo"
              type="date"
              value={dateFilters.dateTo ?? ""}
              onChange={(e) =>
                onDateFiltersChange({
                  ...dateFilters,
                  dateTo: e.target.value || undefined,
                })
              }
              disabled={isSearching}
              aria-label="Data final"
            />
          </Field>

          {showBudgetClosureFilter && (
            <BudgetClosureFilterField
              filters={filters}
              onFiltersChange={onFiltersChange}
              isSearching={isSearching}
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={onSearch}
          disabled={isSearching}
          tooltip="Buscar com o termo informado"
        >
          {isSearching ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Buscando...
            </>
          ) : (
            <>
              <Search className="size-4" aria-hidden />
              Buscar
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onApplyFilters}
          disabled={isSearching}
          tooltip={
            showBudgetClosureFilter
              ? "Aplicar filtros de fechamento e datas"
              : "Aplicar filtros de status e datas"
          }
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filtrar
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          disabled={isSearching || !hasActiveCriteria}
          tooltip="Limpar busca e filtros"
        >
          <X className="size-4" aria-hidden />
          Limpar
        </Button>
      </div>
    </div>
  )
}

function BudgetClosureFilterField({
  filters,
  onFiltersChange,
  isSearching,
}: {
  filters: ListSalesQuery
  onFiltersChange: (filters: ListSalesQuery) => void
  isSearching: boolean
}) {
  return (
    <Field>
      <FieldLabel htmlFor="budget-closure-situation">
        Situação de fechamento
      </FieldLabel>
      <Select
        value={filters.budgetClosureSituation ?? ALL}
        onValueChange={(v) =>
          onFiltersChange({
            ...filters,
            budgetClosureSituation:
              v === ALL
                ? undefined
                : (v as ListSalesQuery["budgetClosureSituation"]),
          })
        }
        disabled={isSearching}
      >
        <SelectTrigger id="budget-closure-situation" className="w-full">
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos</SelectItem>
          {Object.entries(BUDGET_CLOSURE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
