"use client"

import { SalesFilters, type SalesFiltersProps } from "@/app/(app_routes)/sales/_components/sales-filters"

export type BudgetsFiltersProps = Omit<SalesFiltersProps, "showBudgetClosureFilter">

export function BudgetsFilters(props: BudgetsFiltersProps) {
  return <SalesFilters {...props} showBudgetClosureFilter />
}
