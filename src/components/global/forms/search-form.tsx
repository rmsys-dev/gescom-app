"use client"

import { Loader2, Search } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export type SearchFormField = {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    ariaLabel?: string
}

type SearchFormProps = {
    title: string
    fields: SearchFormField[]
    onSearch: () => void
    isSearching?: boolean
    searchLabel?: string
    searchTooltip?: string
    idPrefix?: string
    footer?: ReactNode
    loadingLabel?: string
}

export function SearchForm({
    title,
    fields,
    onSearch,
    isSearching = false,
    searchLabel = "Buscar",
    searchTooltip,
    idPrefix = "search",
    footer,
    loadingLabel = "Carregando...",
}: SearchFormProps) {
    return (
        <div className="border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                </div>
            </div>

            <div className="space-y-5 p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {fields.map((field) => (
                        <Field key={field.id}>
                            <FieldLabel htmlFor={`${idPrefix}-${field.id}`}>
                                {field.label}
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-${field.id}`}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder={field.placeholder}
                                disabled={isSearching}
                                aria-label={field.ariaLabel ?? field.label}
                            />
                        </Field>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 border-t pt-4">
                    <Button
                        type="button"
                        onClick={onSearch}
                        disabled={isSearching}
                        tooltip={searchTooltip}
                    >
                        {isSearching ? (
                            <>
                                <Loader2 className="size-4 animate-spin" aria-hidden />
                                {loadingLabel}
                            </>
                        ) : (
                            <>
                                <Search className="size-4" aria-hidden />
                                {searchLabel}
                            </>
                        )}
                    </Button>
                    {footer}
                </div>
            </div>
        </div>
    )
}
