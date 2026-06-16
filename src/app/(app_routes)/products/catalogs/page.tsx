"use client"

import Link from "next/link"

import { CATALOG_CONFIGS } from "@/app/(app_routes)/products/_components/catalog-config"
import {
  PermissionDeniedCard,
  PermissionsErrorCard,
  PaginatedListLayout,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useOperatorPermissions } from "@/lib/permissions"

export default function CatalogsHubPage() {
  const perms = useOperatorPermissions()

  if (!perms.isReady) {
    return <PaginatedListLayout loading={null}>{null}</PaginatedListLayout>
  }

  if (perms.isError) return <PermissionsErrorCard />

  const visibleCatalogs = CATALOG_CONFIGS.filter((c) => perms[c.permissionKey])

  if (visibleCatalogs.length === 0) {
    return (
      <PermissionDeniedCard permissionLabel="qualquer permissão de catálogo de produtos" />
    )
  }

  return (
    <PaginatedListLayout loading={null}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <RouteBreadcrumb />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Catálogos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Consulte os catálogos fiscais e de referência de produtos
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCatalogs.map((catalog) => (
            <Link key={catalog.slug} href={catalog.basePath}>
              <Card className="h-full transition-colors hover:bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">{catalog.title}</CardTitle>
                  <CardDescription>{catalog.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PaginatedListLayout>
  )
}
