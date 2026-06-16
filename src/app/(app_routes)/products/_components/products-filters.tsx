"use client"

import { Loader2, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ProductsFiltersProps = {
  searchTerm: string
  onSearchTermChange: (term: string) => void
  onSearch: () => void
  onClear: () => void
  isSearching?: boolean
}

export function ProductsFilters({
  searchTerm,
  onSearchTermChange,
  onSearch,
  onClear,
  isSearching = false,
}: ProductsFiltersProps) {
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
            id="products-search-term"
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descrição, código de barras ou código"
            className="pl-9 pr-9"
            disabled={isSearching}
            aria-label="Buscar por descrição, código de barras ou código"
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

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={onSearch}
          disabled={isSearching}
          tooltip="Buscar produtos"
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
          onClick={onClear}
          disabled={isSearching}
          tooltip="Limpar filtros"
        >
          <X className="size-4" aria-hidden />
          Limpar
        </Button>
      </div>
    </div>
  )
}
