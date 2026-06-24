"use client"

import { Loader2, Search, SearchX } from "lucide-react"
import type { ReactNode } from "react"

export type ListingSearchResultProps = {
  hasSearched: boolean
  isSearching: boolean
  error: unknown
  idleTitle?: string
  idleHint?: string
  searchingTitle?: string
  searchingHint?: string
  errorSummaryTitle?: string
  errorSummaryHint?: string
  errorDetails?: ReactNode
  total: number
  rangeStart: number
  rangeEnd: number
  summarySuffix?: string
  children: ReactNode
}

export function ListingSearchResult({
  hasSearched,
  isSearching,
  error,
  idleTitle = "Nenhuma busca realizada",
  idleHint = "Use os campos acima e clique em Buscar para ver os resultados",
  searchingTitle = "Buscando...",
  searchingHint = "Aguarde enquanto consultamos os registros",
  errorSummaryTitle = "Não foi possível concluir a busca",
  errorSummaryHint = "Verifique os filtros informados e tente novamente",
  errorDetails,
  total,
  rangeStart,
  rangeEnd,
  summarySuffix = "",
  children,
}: ListingSearchResultProps) {
  if (!hasSearched) {
    return (
      <div
        role="status"
        className="border border-dashed px-6 py-20 text-center"
      >
        <Search
          className="mx-auto mb-4 size-12 text-muted-foreground"
          aria-hidden
        />
        <p className="font-semibold text-muted-foreground">{idleTitle}</p>
        <p className="mt-1 font-light text-sm text-muted-foreground">{idleHint}</p>
      </div>
    )
  }

  if (isSearching) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center border bg-card px-6 py-20 text-center"
      >
        <Loader2
          className="mb-4 size-10 animate-spin text-muted-foreground"
          aria-hidden
        />
        <p className="font-semibold text-foreground">{searchingTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{searchingHint}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div
          role="status"
          className="border border-dashed bg-card px-6 py-12 text-center"
        >
          <SearchX
            className="mx-auto mb-4 size-10 text-muted-foreground/40"
            aria-hidden
          />
          <p className="font-semibold text-foreground">{errorSummaryTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{errorSummaryHint}</p>
        </div>
        {errorDetails}
      </div>
    )
  }

  const summary =
    total === 1
      ? "1 registro encontrado"
      : `Mostrando ${rangeStart}–${rangeEnd} de ${total} registros`

  return (
    <div className="space-y-4">
      <p
        className="text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {summary}
        {summarySuffix}
      </p>

      {children}
    </div>
  )
}
