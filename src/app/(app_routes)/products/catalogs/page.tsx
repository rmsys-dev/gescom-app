"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { CATALOG_CONFIGS } from "@/app/(app_routes)/products/_components/catalog-config"
import {
  PermissionDeniedCard,
  PermissionsErrorCard,
  PaginatedListLayout,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import { PRODUCTS_BASE_PATH } from "@/app/(app_routes)/products/_components/products-constants"
import { Button } from "@/components/ui/button"
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
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={PRODUCTS_BASE_PATH}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
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
    </main>
  )
}
