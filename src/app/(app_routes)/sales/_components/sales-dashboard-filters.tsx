"use client"

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
import type { DashboardFilters } from "@/modules/sales/sales-constants"
import {
  COMPARE_MODE_OPTIONS,
  GRANULARITY_OPTIONS,
  PERIOD_PRESET_OPTIONS,
} from "@/modules/sales/sales-labels"

export type SalesDashboardFiltersProps = {
  draft: DashboardFilters
  onChange: (filters: DashboardFilters) => void
  onApply: () => void
  onClear: () => void
  useCustomRange: boolean
  onToggleCustomRange: (value: boolean) => void
}

export function SalesDashboardFilters({
  draft,
  onChange,
  onApply,
  onClear,
  useCustomRange,
  onToggleCustomRange,
}: SalesDashboardFiltersProps) {
  return (
    <div className="border bg-card p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="period-type">Tipo de período</FieldLabel>
          <Select
            value={useCustomRange ? "custom" : "preset"}
            onValueChange={(v) => onToggleCustomRange(v === "custom")}
          >
            <SelectTrigger id="period-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preset">Predefinido</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {!useCustomRange ? (
          <Field>
            <FieldLabel htmlFor="period-preset">Período</FieldLabel>
            <Select
              value={draft.periodPreset}
              onValueChange={(v) =>
                onChange({
                  ...draft,
                  periodPreset: v as DashboardFilters["periodPreset"],
                  dateFrom: undefined,
                  dateTo: undefined,
                })
              }
            >
              <SelectTrigger id="period-preset" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_PRESET_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : (
          <>
            <Field>
              <FieldLabel htmlFor="date-from">De</FieldLabel>
              <Input
                id="date-from"
                type="date"
                value={draft.dateFrom ?? ""}
                onChange={(e) =>
                  onChange({ ...draft, dateFrom: e.target.value || undefined })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="date-to">Até</FieldLabel>
              <Input
                id="date-to"
                type="date"
                value={draft.dateTo ?? ""}
                onChange={(e) =>
                  onChange({ ...draft, dateTo: e.target.value || undefined })
                }
              />
            </Field>
          </>
        )}

        <Field>
          <FieldLabel htmlFor="compare-mode">Comparação</FieldLabel>
          <Select
            value={draft.compareMode}
            onValueChange={(v) =>
              onChange({
                ...draft,
                compareMode: v as DashboardFilters["compareMode"],
              })
            }
          >
            <SelectTrigger id="compare-mode" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPARE_MODE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="granularity">Granularidade</FieldLabel>
          <Select
            value={draft.granularity}
            onValueChange={(v) =>
              onChange({
                ...draft,
                granularity: v as DashboardFilters["granularity"],
              })
            }
          >
            <SelectTrigger id="granularity" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GRANULARITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={onApply} tooltip="Aplicar filtros">
          Filtrar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          tooltip="Limpar filtros"
        >
          Limpar
        </Button>
      </div>
    </div>
  )
}
