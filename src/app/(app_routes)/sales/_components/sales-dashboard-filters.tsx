"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { DashboardFilters } from "@/modules/sales/sales-constants"
import {
  COMPARE_MODE_OPTIONS,
  GRANULARITY_OPTIONS,
  PERIOD_PRESET_OPTIONS,
} from "@/modules/sales/sales-labels"

type SalesDashboardFiltersProps = {
  draft: DashboardFilters
  onChange: (filters: DashboardFilters) => void
  onApply: () => void
  useCustomRange: boolean
  onToggleCustomRange: (value: boolean) => void
}

export function SalesDashboardFilters({
  draft,
  onChange,
  onApply,
  useCustomRange,
  onToggleCustomRange,
}: SalesDashboardFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>
          Período, comparação e granularidade dos relatórios de vendas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
          onSubmit={(e) => {
            e.preventDefault()
            onApply()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="period-type">Tipo de período</Label>
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
          </div>

          {!useCustomRange ? (
            <div className="space-y-2">
              <Label htmlFor="period-preset">Período</Label>
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
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="date-from">De</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={draft.dateFrom ?? ""}
                  onChange={(e) =>
                    onChange({ ...draft, dateFrom: e.target.value || undefined })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">Até</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={draft.dateTo ?? ""}
                  onChange={(e) =>
                    onChange({ ...draft, dateTo: e.target.value || undefined })
                  }
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="compare-mode">Comparação</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="granularity">Granularidade</Label>
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
          </div>

          <div className="flex items-end md:col-span-2 lg:col-span-1">
            <Button type="submit" className="w-full">
              Aplicar filtros
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
