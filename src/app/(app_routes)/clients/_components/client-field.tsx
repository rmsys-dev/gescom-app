"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  BadgeCheck,
  Calendar,
  User,
  UserPlus,
  UserRoundPlus,
} from "lucide-react"

import { ConfirmSoftDeleteDialog } from "@/components/global/confirm-soft-delete-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CLIENTS_BASE_PATH,
} from "@/app/(app_routes)/clients/_components/clients-constants"
import {
  MemberEditActions,
  MemberField,
  MemberUserInfoCard,
} from "@/app/(app_routes)/members/_components/member-field"
import { MemberClassBadge } from "@/app/(app_routes)/members/_components/member-class-badge"
import { MemberStatusBadge } from "@/app/(app_routes)/members/_components/member-status-badge"
import { formatDateOnly } from "@/lib/formatters"
import { HttpError } from "@/lib/api/http-error"
import { getUserInitials } from "@/lib/user-initials"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import {
  getMemberStatusLabel,
  MEMBER_STATUS_OPTIONS,
} from "@/modules/memberships/member-status-label"
import type { MemberDetail, MemberStatus } from "@/modules/memberships/memberships.schema"
import {
  useMembersQuery,
  useUpdateMemberMutation,
} from "@/modules/memberships/use-members"
import { useUserQuery } from "@/modules/users/use-users"

export function ClientsListHeader({
  canCreateClient,
  canLink,
}: {
  canCreateClient: boolean
  canLink: boolean
}) {
  return (
    <div>
      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            {canCreateClient && (
              <Button
                asChild
                className="w-full"
                variant="outline"
                tooltip="Criar cliente com utilizador novo"
              >
                <Link href={`${CLIENTS_BASE_PATH}/new`}>
                  <UserPlus className="size-4" aria-hidden />
                  Novo cliente
                </Link>
              </Button>
            )}
            {canLink && (
              <Button
                asChild
                className="w-full"
                variant="outline"
                tooltip="Vincular utilizador existente como cliente"
              >
                <Link href={`${CLIENTS_BASE_PATH}/link`}>
                  <UserRoundPlus className="size-4" aria-hidden />
                  Vincular
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ClientDetailHeader({ member }: { member: MemberDetail }) {
  const displayName = member.user.userName.trim() || "Cliente"
  const initials = getUserInitials(displayName)

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex justify-center">
          <Avatar
            size="default"
            className="size-24 ring-2 ring-background shadow-md after:border-0"
          >
            <AvatarFallback className="bg-primary/15 text-4xl font-semibold tracking-tight text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-xl font-semibold sm:text-2xl">
            {displayName}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <MemberClassBadge memberClass={member.class} />
            <MemberStatusBadge status={member.status} />
          </div>
          <p
            className="font-mono text-xs text-muted-foreground"
            title="memberId"
          >
            Identificador de cliente: {member.id.slice(0, 8)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export { MemberUserInfoCard as ClientUserInfoCard }

export function ClientLinkCard({
  member,
  enterpriseId,
  canEdit,
  onUpdateSuccess,
}: {
  member: MemberDetail
  enterpriseId: string
  canEdit?: boolean
  onUpdateSuccess?: () => void
}) {
  const router = useRouter()
  const mutation = useUpdateMemberMutation(enterpriseId, member.id)
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState<MemberStatus>(member.status)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    data: includedByMembers,
    isPending: includedByListPending,
    isFetched: includedByListFetched,
  } = useMembersQuery({
    enterpriseId,
    filters: { userId: member.includedBy, limit: 1 },
    enabled: Boolean(enterpriseId) && Boolean(member.includedBy),
  })

  const includedByNameFromList = includedByMembers?.items[0]?.user.userName

  const { data: includedByUser, isPending: includedByUserPending } =
    useUserQuery({
      enterpriseId,
      userId: member.includedBy,
      enabled:
        Boolean(enterpriseId) &&
        Boolean(member.includedBy) &&
        includedByListFetched &&
        !includedByNameFromList,
      retry: false,
    })

  const includedByDisplay =
    includedByNameFromList ?? includedByUser?.userName
  const includedByPending =
    includedByListPending ||
    (includedByListFetched && !includedByNameFromList && includedByUserPending)

  const resetDraft = () => {
    setStatus(member.status)
  }

  const handleStartEdit = () => {
    resetDraft()
    setEditing(true)
  }

  const handleCancel = () => {
    resetDraft()
    setEditing(false)
  }

  async function handleSave() {
    const patch: { status?: MemberStatus } = {}
    if (status !== member.status) patch.status = status

    if (Object.keys(patch).length === 0) {
      toast.message("Nenhuma alteração detectada.")
      setEditing(false)
      return
    }

    try {
      await mutation.mutateAsync(patch)
      setEditing(false)
      onUpdateSuccess?.()
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível atualizar o cliente.")
        return
      }
      toast.error("Não foi possível atualizar o cliente.")
    }
  }

  async function handleSoftDelete() {
    try {
      await mutation.mutateAsync({ softDelete: true })
      setConfirmDelete(false)
      router.push(CLIENTS_BASE_PATH)
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível inativar o cliente.")
        return
      }
      toast.error("Não foi possível inativar o cliente.")
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vínculo</CardTitle>
          <CardDescription>Cliente na empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MemberField
              label="Status"
              value={getMemberStatusLabel(member.status)}
              icon={BadgeCheck}
              editing={editing}
              editValue={status}
              onEditChange={(v) => setStatus(v as MemberStatus)}
              editSelectOptions={MEMBER_STATUS_OPTIONS}
              inputId="client-status"
            />
            <MemberField
              label="Registrado em"
              value={formatDateOnly(member.registeredOn)}
              icon={Calendar}
            />
            <MemberField
              label="Aprovado em"
              value={formatDateOnly(member.approvedAt)}
              icon={Calendar}
            />
            <MemberField
              label="Incluído por"
              value={includedByPending ? "…" : (includedByDisplay ?? "—")}
              icon={User}
              className="sm:col-span-2"
            />
          </div>
          {canEdit && (
            <>
              <MemberEditActions
                editing={editing}
                canEdit
                onStartEdit={handleStartEdit}
                onCancel={handleCancel}
                onSave={() => void handleSave()}
                isPending={mutation.isPending}
                editLabel="Editar vínculo"
              />
              {!editing && (
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={() => setConfirmDelete(true)}
                  tooltip="Inativar cliente"
                >
                  Inativar cliente
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmSoftDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Inativar cliente?"
        description="O vínculo será marcado como inativo na empresa."
        confirmLabel="Inativar"
        isPending={mutation.isPending}
        onConfirm={() => void handleSoftDelete()}
      />
    </>
  )
}
