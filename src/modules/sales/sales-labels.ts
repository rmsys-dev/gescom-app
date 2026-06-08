import type {
  BudgetClosureSituation,
  ReturnSituation,
  SaleReturnKind,
  SaleReturnStatus,
  SaleStatus,
  SaleType,
} from "@/modules/sales/sales-enums"
import type {
  CompareMode,
  Granularity,
  PeriodPreset,
} from "@/modules/sales/sales-analytics.schema"
import type { KpiValue } from "@/modules/sales/sales-analytics.schema"

export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  VENDA: "Venda",
  ORCAMENTO: "Orçamento",
}

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  ABERTA: "Aberta",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
}

export const BUDGET_CLOSURE_LABELS: Record<BudgetClosureSituation, string> = {
  ABERTO: "Aberto",
  PARCIAL: "Parcialmente convertido",
  FECHADO: "Fechado",
}

export const BUDGET_CONVERSION_KIND_LABELS: Record<"PARCIAL" | "TOTAL", string> =
  {
    PARCIAL: "Conversão parcial",
    TOTAL: "Conversão total (fechamento orçamento)",
  }

export const RETURN_SITUATION_LABELS: Record<ReturnSituation, string> = {
  SEM_DEVOLUCAO: "Sem devolução",
  PARCIAL: "Parcial",
  TOTAL: "Total",
}

export const SALE_RETURN_KIND_LABELS: Record<SaleReturnKind, string> = {
  PARCIAL: "Parcial",
  TOTAL: "Total",
}

export const SALE_RETURN_STATUS_LABELS: Record<SaleReturnStatus, string> = {
  ABERTA: "Aberta",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
}

export const PERIOD_PRESET_LABELS: Record<PeriodPreset, string> = {
  today: "Hoje",
  yesterday: "Ontem",
  this_week: "Esta semana",
  last_week: "Semana passada",
  this_month: "Este mês",
  last_month: "Mês passado",
  this_quarter: "Este trimestre",
  last_quarter: "Trimestre passado",
  this_year: "Este ano",
  last_year: "Ano passado",
}

export const COMPARE_MODE_LABELS: Record<CompareMode, string> = {
  none: "Sem comparação",
  previous_period: "Período anterior",
  previous_year: "Ano anterior",
}

export const GRANULARITY_LABELS: Record<Granularity, string> = {
  day: "Diário",
  week: "Semanal",
  month: "Mensal",
  year: "Anual",
}

export const PERIOD_PRESET_OPTIONS = Object.entries(PERIOD_PRESET_LABELS).map(
  ([value, label]) => ({ value: value as PeriodPreset, label })
)

export const COMPARE_MODE_OPTIONS = Object.entries(COMPARE_MODE_LABELS).map(
  ([value, label]) => ({ value: value as CompareMode, label })
)

export const GRANULARITY_OPTIONS = Object.entries(GRANULARITY_LABELS).map(
  ([value, label]) => ({ value: value as Granularity, label })
)

export function formatCurrency(value: number | string | null | undefined): string {
  const num =
    typeof value === "string" ? Number.parseFloat(value) : (value ?? Number.NaN)
  if (Number.isNaN(num)) return "—"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num)
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("pt-BR").format(value)
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—"
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

export function formatDelta(kpi: KpiValue): string {
  if (kpi.changePercent === undefined) return "—"
  return formatPercent(kpi.changePercent)
}

export function deltaTone(
  changePercent: number | undefined
): "positive" | "negative" | "neutral" {
  if (changePercent === undefined) return "neutral"
  if (changePercent > 0) return "positive"
  if (changePercent < 0) return "negative"
  return "neutral"
}

export const AGING_BUCKET_LABELS: Record<string, string> = {
  a_vencer: "A vencer",
  vencido_1_30: "Vencido 1–30 dias",
  vencido_31_60: "Vencido 31–60 dias",
  vencido_60_plus: "Vencido 60+ dias",
}
