"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import type { ProductsInlineSearchField } from "@/app/(app_routes)/products/_components/products-constants"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type ProductsFiltersInlineProps = {
    onSearchByField: (field: ProductsInlineSearchField, value: string) => void
    isSearching?: boolean
}

const SEARCH_ACTIONS: {
    field: ProductsInlineSearchField
    label: string
}[] = [
        { field: "code", label: "Código" },
        { field: "description", label: "Descrição" },
        { field: "barCode", label: "Código de barras" },
        { field: "manufacturer", label: "Fabricante" },
    ]

export function ProductsFiltersInline({
    onSearchByField,
    isSearching = false,
}: ProductsFiltersInlineProps) {
    const [searchValue, setSearchValue] = useState("")

    function handleSearch(field: ProductsInlineSearchField) {
        onSearchByField(field, searchValue)
    }

    return (
        <div className=" border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                        Buscar produto
                    </p>
                </div>
            </div>

            <div className="space-y-4 p-4">
                <Field>
                    <FieldLabel htmlFor="products-inline-search">
                        Termo de busca
                    </FieldLabel>
                    <Input
                        id="products-inline-search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Código, descrição, código de barras ou fabricante"
                        disabled={isSearching}
                        aria-label="Termo de busca"
                    />
                </Field>

                <div>
                    <p className="mb-2 text-sm font-semibold text-foreground">
                        Buscar por
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {SEARCH_ACTIONS.map((action) => (
                            <Button
                                key={action.field}
                                type="button"
                                size="sm"
                                className="bg-transparent border-border text-foreground hover:bg-primary hover:text-foreground hover:border-primary hover:font-semibold hover:scale-105 transition-all duration-500 "
                                onClick={() => handleSearch(action.field)}
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <Loader2 className="size-4 animate-spin" aria-hidden />
                                ) : (
                                    action.label
                                )}

                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
