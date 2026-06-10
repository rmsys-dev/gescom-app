"use client"

import { LinkClientForm } from "@/app/(app_routes)/clients/_components/link-client-form"
import { MembershipFormContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { CLIENTS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"

export default function LinkClientPage() {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  if (!ready || !perms.isReady) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <MembershipFormContentLoading config={CLIENTS_ROUTE_CONFIG} />
      </main>
    )
  }

  if (perms.isError) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Não foi possível carregar permissões</CardTitle>
            <CardDescription>
              Não foi possível obter as permissões da sessão. Tente atualizar a
              página ou iniciar sessão novamente.
            </CardDescription>
          </CardHeader>
        </Card>
        <RouteBreadcrumb />
      </main>
    )
  }

  if (!enterpriseId) return null

  if (!perms.canIncludeMembers) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <RouteBreadcrumb />
        <Card>
          <CardHeader>
            <CardTitle>Sem permissão</CardTitle>
            <CardDescription>
              Necessita da permissão incluir_membros.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  if (!perms.canConsultUsers) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <RouteBreadcrumb />
        <Card>
          <CardHeader>
            <CardTitle>Sem permissão</CardTitle>
            <CardDescription>
              Necessita da permissão consultar_usuarios para pesquisar
              usuários.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <RouteBreadcrumb />
      <LinkClientForm enterpriseId={enterpriseId} />
    </main>
  )
}
