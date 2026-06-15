import { apiFetch } from "@/lib/api/client"
import { parseSuccessEnvelope } from "@/lib/api/parse-response"
import {
  analyticsQuerySchema,
  budgetFunnelSchema,
  buildAnalyticsQuery,
  cancellationsAnalyticsSchema,
  pipelineBudgetsSchema,
  pipelineCompareSchema,
  pipelineOverviewSchema,
  pipelineTimeseriesSchema,
  rankingResponseSchema,
  realizedCompareSchema,
  realizedOverviewSchema,
  realizedTimeseriesSchema,
  receivablesAgingSchema,
  receivablesSummarySchema,
  returnsAnalyticsSchema,
  statusBreakdownSchema,
  topProductsResponseSchema,
  type AnalyticsQuery,
} from "@/modules/sales/sales-analytics.schema"

const ANALYTICS_BASE = "sales/analytics"

async function getAnalytics<T>(
  path: string,
  query: AnalyticsQuery,
  schema: import("zod").ZodType<T>
) {
  const parsed = analyticsQuerySchema.parse(query)
  const qs = buildAnalyticsQuery(parsed)
  const raw = await apiFetch<unknown>(`${ANALYTICS_BASE}${path}${qs}`, {
    method: "GET",
  })
  return parseSuccessEnvelope(
    raw,
    schema,
    `GET ${ANALYTICS_BASE}${path}`
  )
}

export async function getRealizedOverviewService(query: AnalyticsQuery) {
  return getAnalytics("/realized/overview", query, realizedOverviewSchema)
}

export async function getRealizedTimeseriesService(query: AnalyticsQuery) {
  return getAnalytics("/realized/timeseries", query, realizedTimeseriesSchema)
}

export async function getRealizedByPaymentTypeService(query: AnalyticsQuery) {
  return getAnalytics("/realized/by-payment-type", query, rankingResponseSchema)
}

export async function getRealizedBySellerService(query: AnalyticsQuery) {
  return getAnalytics("/realized/by-seller", query, rankingResponseSchema)
}

export async function getRealizedByCustomerService(query: AnalyticsQuery) {
  return getAnalytics("/realized/by-customer", query, rankingResponseSchema)
}

export async function getRealizedTopProductsService(query: AnalyticsQuery) {
  return getAnalytics("/realized/top-products", query, topProductsResponseSchema)
}

export async function getRealizedReturnsService(query: AnalyticsQuery) {
  return getAnalytics("/realized/returns", query, returnsAnalyticsSchema)
}

export async function getPipelineOverviewService(query: AnalyticsQuery) {
  return getAnalytics("/pipeline/overview", query, pipelineOverviewSchema)
}

export async function getPipelineTimeseriesService(query: AnalyticsQuery) {
  return getAnalytics("/pipeline/timeseries", query, pipelineTimeseriesSchema)
}

export async function getPipelineBudgetsService(query: AnalyticsQuery) {
  return getAnalytics("/pipeline/budgets", query, pipelineBudgetsSchema)
}

export async function getPipelineBudgetsFunnelService(query: AnalyticsQuery) {
  return getAnalytics("/pipeline/budgets/funnel", query, budgetFunnelSchema)
}

export async function getOperationsStatusBreakdownService(
  query: AnalyticsQuery
) {
  return getAnalytics(
    "/operations/status-breakdown",
    query,
    statusBreakdownSchema
  )
}

export async function getOperationsCancellationsService(query: AnalyticsQuery) {
  return getAnalytics(
    "/operations/cancellations",
    query,
    cancellationsAnalyticsSchema
  )
}

export async function getReceivablesSummaryService(query: AnalyticsQuery) {
  return getAnalytics("/receivables/summary", query, receivablesSummarySchema)
}

export async function getReceivablesAgingService(query: AnalyticsQuery) {
  return getAnalytics("/receivables/aging", query, receivablesAgingSchema)
}

export async function getRealizedCompareService(query: AnalyticsQuery) {
  return getAnalytics("/realized/compare", query, realizedCompareSchema)
}

export async function getPipelineCompareService(query: AnalyticsQuery) {
  return getAnalytics("/pipeline/compare", query, pipelineCompareSchema)
}

export async function getRealizedByProductGroupService(query: AnalyticsQuery) {
  return getAnalytics("/realized/by-product-group", query, rankingResponseSchema)
}

export async function getRealizedByProductBrandService(query: AnalyticsQuery) {
  return getAnalytics("/realized/by-product-brand", query, rankingResponseSchema)
}
