"use client"

import { useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { defaultProductsEnterprisesFilters } from "@/app/(app_routes)/products/_components/products-constants"
import { useOperatorPermissions } from "@/lib/permissions"
import { prefetchTenantQuery } from "@/lib/react-query/prefetch"
import { useActiveEnterpriseId } from "@/lib/tenant/use-active-enterprise-id"
import {
  CLIENTS_ROUTE_CONFIG,
  MEMBERS_ROUTE_CONFIG,
} from "@/modules/memberships/membership-route-config"
import { membersQueryKey } from "@/modules/memberships/memberships-query-keys"
import { listMembersService } from "@/modules/memberships/memberships.service"
import { productsQueryKeys } from "@/modules/products/products-query-keys"
import { listProductsEnterprisesService } from "@/modules/products/products.service"
import { defaultSalesFilters } from "@/modules/sales/sales-constants"
import { salesQueryKeys } from "@/modules/sales/sales-query-keys"
import { listSalesService } from "@/modules/sales/sales.service"
import { stockQueryKeys } from "@/modules/stock/stock-query-keys"
import { listStockSectorsService } from "@/modules/stock/stock.service"

const DEFAULT_STOCK_FILTERS = { limit: 50, offset: 0 }

export function useListRoutePrefetch() {
  const queryClient = useQueryClient()
  const enterpriseId = useActiveEnterpriseId()
  const perms = useOperatorPermissions()

  return useCallback(
    (routeUrl: string) => {
      if (!enterpriseId) return

      switch (routeUrl) {
        case "/sales":
          if (!perms.canConsultSales) return
          prefetchTenantQuery(queryClient, {
            queryKey: salesQueryKeys.list(enterpriseId, defaultSalesFilters()),
            queryFn: () => listSalesService(defaultSalesFilters()),
          })
          break
        case "/members":
          if (!perms.canConsultMembers) return
          prefetchTenantQuery(queryClient, {
            queryKey: membersQueryKey(
              enterpriseId,
              MEMBERS_ROUTE_CONFIG.defaultListFilters()
            ),
            queryFn: () =>
              listMembersService(
                enterpriseId,
                MEMBERS_ROUTE_CONFIG.defaultListFilters()
              ),
          })
          break
        case "/clients":
          if (!perms.canConsultMembers) return
          prefetchTenantQuery(queryClient, {
            queryKey: membersQueryKey(
              enterpriseId,
              CLIENTS_ROUTE_CONFIG.defaultListFilters()
            ),
            queryFn: () =>
              listMembersService(
                enterpriseId,
                CLIENTS_ROUTE_CONFIG.defaultListFilters()
              ),
          })
          break
        case "/products":
          if (!perms.canConsultProducts) return
          prefetchTenantQuery(queryClient, {
            queryKey: productsQueryKeys.enterprises(
              enterpriseId,
              defaultProductsEnterprisesFilters()
            ),
            queryFn: () =>
              listProductsEnterprisesService(defaultProductsEnterprisesFilters()),
          })
          break
        case "/stock/sectors":
          if (!perms.canConsultStockSectors) return
          prefetchTenantQuery(queryClient, {
            queryKey: stockQueryKeys.sectors(enterpriseId, DEFAULT_STOCK_FILTERS),
            queryFn: () => listStockSectorsService(DEFAULT_STOCK_FILTERS),
          })
          break
        default:
          break
      }
    },
    [enterpriseId, perms, queryClient]
  )
}
