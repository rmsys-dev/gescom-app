import {
  SALES_BASE_PATH,
  defaultBudgetFilters,
  defaultSalesFilters,
} from "@/modules/sales/sales-constants"
import type { ListSalesQuery } from "@/modules/sales/sales.schema"

export type SalesListVariant = "sales" | "budgets"

export type SalesListRouteConfig = {
  variant: SalesListVariant
  basePath: string
  defaultListFilters: () => ListSalesQuery
  labels: {
    singular: string
    plural: string
    loadingList: string
    loadListError: string
    loadListErrorTitle: string
    emptyList: string
    emptyListHint: string
  }
  list: {
    filtersFormId: string
    showBudgetClosureFilter: boolean
    showReturnColumn: boolean
  }
}

export const SALES_ROUTE_CONFIG: SalesListRouteConfig = {
  variant: "sales",
  basePath: SALES_BASE_PATH,
  defaultListFilters: defaultSalesFilters,
  labels: {
    singular: "venda",
    plural: "vendas",
    loadingList: "A carregar vendas",
    loadListError: "Não foi possível carregar as vendas.",
    loadListErrorTitle: "Erro ao carregar vendas",
    emptyList: "Nenhuma venda encontrada",
    emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
  },
  list: {
    filtersFormId: "sales-filters-form",
    showBudgetClosureFilter: false,
    showReturnColumn: true,
  },
}

export const BUDGETS_ROUTE_CONFIG: SalesListRouteConfig = {
  variant: "budgets",
  basePath: SALES_BASE_PATH,
  defaultListFilters: defaultBudgetFilters,
  labels: {
    singular: "orçamento",
    plural: "orçamentos",
    loadingList: "A carregar orçamentos",
    loadListError: "Não foi possível carregar os orçamentos.",
    loadListErrorTitle: "Erro ao carregar orçamentos",
    emptyList: "Nenhum orçamento encontrado",
    emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
  },
  list: {
    filtersFormId: "budgets-filters-form",
    showBudgetClosureFilter: true,
    showReturnColumn: false,
  },
}
