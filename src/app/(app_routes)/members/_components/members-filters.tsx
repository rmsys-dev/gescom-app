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
import { MEMBER_CLASS_OPTIONS } from "@/modules/memberships/member-class-label"
import { MEMBER_STATUS_OPTIONS } from "@/modules/memberships/member-status-label"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"

type MembersFiltersProps = {
  filters: ListMembersQuery
  onFiltersChange: (filters: ListMembersQuery) => void
  searchTerm: string
  onSearchTermChange: (term: string) => void
  onSearch: () => void
  onApplyFilters: () => void
  onClear: () => void
  isSearching?: boolean
  showClassFilter?: boolean
  showStatusFilter?: boolean
}

export function MembersFilters({
  filters,
  onFiltersChange,
  searchTerm,
  onSearchTermChange,
  onSearch,
  onApplyFilters,
  onClear,
  isSearching = false,
  showClassFilter = true,
  showStatusFilter = true,
}: MembersFiltersProps) {
  const hasActiveCriteria =
    searchTerm.trim() !== "" ||
    Boolean(filters.status) ||
    Boolean(filters.class)

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      onSearch()
    }
  }

  return (
    <div className="space-y-4 border bg-card p-4 shadow-sm">
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
            id="search-term"
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nome, CPF/CNPJ, e-mail ou telefone"
            className="pl-9 pr-9"
            disabled={isSearching}
            aria-label="Buscar por nome, CPF/CNPJ, e-mail ou telefone"
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

      {(showStatusFilter || showClassFilter) && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Filtros
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {showStatusFilter && (
              <Field>
                <FieldLabel htmlFor="filter-status">Status</FieldLabel>
                <Select
                  value={filters.status ?? "all"}
                  onValueChange={(v) =>
                    onFiltersChange({
                      ...filters,
                      status:
                        v === "all"
                          ? undefined
                          : (v as ListMembersQuery["status"]),
                    })
                  }
                >
                  <SelectTrigger id="filter-status" className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {MEMBER_STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}

            {showClassFilter && (
              <Field>
                <FieldLabel htmlFor="filter-class">Classe</FieldLabel>
                <Select
                  value={filters.class ?? "all"}
                  onValueChange={(v) =>
                    onFiltersChange({
                      ...filters,
                      class:
                        v === "all"
                          ? undefined
                          : (v as ListMembersQuery["class"]),
                    })
                  }
                >
                  <SelectTrigger id="filter-class" className="w-full">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {MEMBER_CLASS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </div>
        </div>
      )}

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

        {(showStatusFilter || showClassFilter) && (
          <Button
            type="button"
            variant="outline"
            onClick={onApplyFilters}
            disabled={isSearching}
            tooltip="Aplicar filtros de status e classe"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filtrar
          </Button>
        )}

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
