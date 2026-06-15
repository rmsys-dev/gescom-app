import type { OperatorPermissions } from "@/components/guards/permission-route-guard"
import { PERMISSION_CODES } from "@/lib/permissions"

type RoutePermissionRule = {
  prefix: string
  check: (perms: OperatorPermissions) => boolean
  permissionLabel: string
}

/** Mapa de prefixos de rota para checagens de permissão (UX no cliente). */
export const ROUTE_PERMISSION_RULES: readonly RoutePermissionRule[] = [
  {
    prefix: "/members",
    check: (p) => p.canConsultMembers,
    permissionLabel: PERMISSION_CODES.consultarMembros,
  },
  {
    prefix: "/clients",
    check: (p) => p.canConsultMembers,
    permissionLabel: PERMISSION_CODES.consultarMembros,
  },
  {
    prefix: "/enterprise",
    check: (p) => p.canConsultEnterprises,
    permissionLabel: PERMISSION_CODES.consultarEmpresas,
  },
  {
    prefix: "/sales",
    check: (p) => p.canConsultSales,
    permissionLabel: PERMISSION_CODES.consultarVendas,
  },
  {
    prefix: "/products",
    check: (p) => p.canConsultProducts,
    permissionLabel: PERMISSION_CODES.consultarProdutos,
  },
  {
    prefix: "/stock",
    check: (p) => p.canConsultStockSectors,
    permissionLabel: PERMISSION_CODES.consultarSetoresEstoque,
  },
] as const

export function findRoutePermissionRule(
  pathname: string
): RoutePermissionRule | undefined {
  return ROUTE_PERMISSION_RULES.find(
    (rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)
  )
}
