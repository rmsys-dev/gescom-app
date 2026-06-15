"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function PermissionDeniedCard({
  permissionLabel,
}: {
  permissionLabel: string
}) {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Sem permissão</CardTitle>
          <CardDescription>
            Necessita da permissão {permissionLabel} para ver esta área.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  )
}

export function PermissionsErrorCard() {
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
    </main>
  )
}
