import {
  Bell,
  Building2,
  HelpCircle,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Link2,
  Package,
  Settings2,
  ShoppingCart,
  TrendingUp,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"

import { isSidebarPathActive } from "@/app/(app_routes)/_components/route-labels"

export type NavGroupKey =
  | "home"
  | "people"
  | "sales"
  | "products"
  | "config"
  | "support"

export type NavRouteItem = {
  title: string
  url: string
  icon: LucideIcon
}

export type NavGroup = {
  key: NavGroupKey
  label: string
  icon: LucideIcon
  href?: string
  routes?: NavRouteItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "home",
    label: "Home",
    icon: Home,
    href: "/home",
  },
  {
    key: "people",
    label: "Pessoas",
    icon: Users,
    routes: [
      { title: "Clientes", url: "/clients", icon: Users },
      { title: "Membros", url: "/members", icon: Link2 },
    ],
  },
  {
    key: "sales",
    label: "Vendas",
    icon: TrendingUp,
    routes: [
      { title: "Pedidos", url: "/sales", icon: ShoppingCart },
      { title: "Dashboard", url: "/sales/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    key: "products",
    label: "Produtos",
    icon: Package,
    routes: [{ title: "Produtos", url: "/products", icon: Package }],
  },
  {
    key: "config",
    label: "Configuração",
    icon: Settings2,
    routes: [
      { title: "Meu perfil", url: "/profile", icon: User },
      { title: "Empresa", url: "/enterprise", icon: Building2 },
    ],
  },
  {
    key: "support",
    label: "Suporte",
    icon: LifeBuoy,
    routes: [
      { title: "Suporte", url: "/support", icon: HelpCircle },
      { title: "Notificações", url: "/notifications", icon: Bell },
    ],
  },
]

export function getNavGroupForPathname(pathname: string): NavGroupKey | null {
  for (const group of NAV_GROUPS) {
    if (group.href && isSidebarPathActive(pathname, group.href)) {
      return group.key
    }

    if (group.routes?.some((route) => isSidebarPathActive(pathname, route.url))) {
      return group.key
    }
  }

  return null
}

export function isNavGroupActive(pathname: string, group: NavGroup): boolean {
  if (group.href) {
    return isSidebarPathActive(pathname, group.href)
  }

  return (
    group.routes?.some((route) => isSidebarPathActive(pathname, route.url)) ??
    false
  )
}

export function getNavGroupByKey(key: NavGroupKey): NavGroup | undefined {
  return NAV_GROUPS.find((group) => group.key === key)
}

export function getActiveRouteUrl(
  pathname: string,
  routes: NavRouteItem[]
): string | null {
  const sortedRoutes = [...routes].sort((a, b) => b.url.length - a.url.length)

  for (const route of sortedRoutes) {
    if (isSidebarPathActive(pathname, route.url)) {
      return route.url
    }
  }

  return null
}
