"use client"

import {
  Loader2,
  Search,
} from "lucide-react"

import {
  type ProductsDateFilters,
  type ProductsDraftFilters,
} from "@/app/(app_routes)/products/_components/products-constants"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type ProductsFiltersProps = {
  draftFilters: ProductsDraftFilters
  dateFilters: ProductsDateFilters
  activeFilterCount: number
  onDraftFiltersChange: (filters: ProductsDraftFilters) => void
  onDateFiltersChange: (dateFilters: ProductsDateFilters) => void
  onSearch: () => void
  isSearching?: boolean
}

export function ProductsFilters({
  draftFilters,
  onDraftFiltersChange,
  onSearch,
  isSearching = false,
}: ProductsFiltersProps) {

  function updateDraft(patch: Partial<ProductsDraftFilters>) {
    onDraftFiltersChange({ ...draftFilters, ...patch })
  }

  return (
    <div className="border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">
            Buscar produto
          </p>
        </div>
      </div>

      <div className="space-y-5 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field>
            <FieldLabel htmlFor="products-filter-code">Código interno</FieldLabel>
            <Input
              id="products-filter-code"
              value={draftFilters.code}
              onChange={(e) => updateDraft({ code: e.target.value })}
              placeholder="Ex: 1234"
              disabled={isSearching}
              aria-label="Código interno"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="products-filter-description">
              Descrição
            </FieldLabel>
            <Input
              id="products-filter-description"
              value={draftFilters.description}
              onChange={(e) => updateDraft({ description: e.target.value })}
              placeholder="Ex: Produto de exemplo"
              disabled={isSearching}
              aria-label="Descrição do produto"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="products-filter-barcode">
              Código de barras
            </FieldLabel>
            <Input
              id="products-filter-barcode"
              value={draftFilters.barCode}
              onChange={(e) => updateDraft({ barCode: e.target.value })}
              placeholder="Ex: 1234567890123"
              disabled={isSearching}
              aria-label="Código de barras"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="products-filter-manufacturer">
              Fabricante
            </FieldLabel>
            <Input
              id="products-filter-manufacturer"
              value={draftFilters.manufacturer}
              onChange={(e) => updateDraft({ manufacturer: e.target.value })}
              placeholder="Ex: Fabricante"
              disabled={isSearching}
              aria-label="Fabricante"
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-4">
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
                Buscar produto
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
