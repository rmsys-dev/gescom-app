"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"

import { MemberDetailView } from "@/app/(app_routes)/members/_components/member-detail-view"
import { AnimatedLoading } from "@/components/global/loading/animated-loading"
import { EntityDetailSheet } from "@/components/global/sheets/entity-detail-sheet"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import { useMemberQuery } from "@/modules/memberships/use-members"

type MemberDetailDialogProps = {
  memberId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberDetailDialog({
  memberId,
  open,
  onOpenChange,
}: MemberDetailDialogProps) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const { data, error, isPending } = useMemberQuery({
    enterpriseId,
    memberId,
    enabled: open && ready && perms.canConsultMembers && Boolean(memberId),
  })

  const notFound =
    data && !isPending && !enterpriseId ? (
      <Card>
        <CardHeader>
          <CardTitle>Membro não encontrado</CardTitle>
          <CardDescription>
            Este vínculo não pertence à classe esperada.
          </CardDescription>
        </CardHeader>
      </Card>
    ) : null

  return (
    <EntityDetailSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Membro"
      description="Visualização rápida do membro"
      isPending={isPending}
      error={error}
      errorTitle="Erro ao carregar o membro"
      fallbackErrorMessage="Não foi possível carregar o membro."
      loading={<AnimatedLoading />}
      contentClassName="w-full h-full p-2"
      sheetClassName="w-auto"
      footer={
        data && !isPending ? (
          <div className="p-2">
            <Button variant="default" size="sm" asChild>
              <Link href={`/members/${memberId}`}>
                <Pencil className="size-4" aria-hidden />
                Editar
              </Link>
            </Button>
          </div>
        ) : undefined
      }
      notFound={notFound}
    >
      {data && enterpriseId ? (
        <MemberDetailView member={data} enterpriseId={enterpriseId} />
      ) : null}
    </EntityDetailSheet>
  )
}
