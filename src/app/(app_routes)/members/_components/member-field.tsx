"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  BadgeCheck,
  Calendar,
  Fingerprint,
  Mail,
  Pencil,
  Phone,
  User,
  UserPlus,
  UserRoundPlus,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { MemberClassBadge } from "@/app/(app_routes)/members/_components/member-class-badge"
import { MemberStatusBadge } from "@/app/(app_routes)/members/_components/member-status-badge"
import { formatCpfCnpj, formatDateOnly, formatPhone } from "@/lib/formatters"
import { HttpError } from "@/lib/api/http-error"
import { getUserInitials } from "@/lib/user-initials"
import { cn } from "@/lib/utils"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import {
  getMemberClassLabel,
  MEMBER_CLASS_OPTIONS,
} from "@/modules/memberships/member-class-label"
import {
  getMemberStatusLabel,
  MEMBER_STATUS_OPTIONS,
} from "@/modules/memberships/member-status-label"
import type {
  EnterpriseMemberClass,
  MemberDetail,
  MemberStatus,
  MemberUserSummary,
} from "@/modules/memberships/memberships.schema"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"
import {
  memberQueryKey,
  useMembersQuery,
  useUpdateMemberMutation,
} from "@/modules/memberships/use-members"
import { useUpdateUserMutation, useUserQuery } from "@/modules/users/use-users"
import { userDetailsQueryKey } from "@/modules/users-onboarding/use-users-onboarding"
import { MEMBERS_BASE_PATH } from "./members-constants"

export type MemberSelectOption = {
  value: string
  label: string
}

function formatValue(value: string | null | undefined | boolean): string {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "boolean") return value ? "Sim" : "Não"
  return String(value)
}

export function MemberField({
  label,
  value,
  icon: Icon,
  className,
  mono,
  multiline,
  editing = false,
  editValue,
  onEditChange,
  inputId,
  inputType = "text",
  required,
  editSelectOptions,
  editPlaceholder,
}: {
  label: string
  value: string | null | undefined | boolean
  icon: LucideIcon
  className?: string
  mono?: boolean
  multiline?: boolean
  editing?: boolean
  editValue?: string
  onEditChange?: (value: string) => void
  inputId?: string
  inputType?: React.HTMLInputTypeAttribute
  required?: boolean
  editSelectOptions?: MemberSelectOption[]
  editPlaceholder?: string
}) {
  const display = formatValue(value)
  const empty = display === "—"
  const isSelectEdit =
    editing && Boolean(editSelectOptions?.length && onEditChange)

  return (
    <fieldset className={cn("min-w-0 space-y-2", className)}>
      <legend className="text-xs font-medium tracking-wide text-muted-foreground">
        {label}
      </legend>
      <div
        className={cn(
          "flex min-h-10 gap-3 rounded-lg border border-border/60 bg-muted/25 px-3 py-2.5 transition-colors",
          multiline && !empty && !editing ? "items-start" : "items-center",
          !editing && empty && "text-muted-foreground"
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background/80 text-muted-foreground shadow-sm ring-1 ring-border/50">
          <Icon className="size-4" aria-hidden />
        </span>
        {isSelectEdit ? (
          <Select value={editValue ?? ""} onValueChange={onEditChange}>
            <SelectTrigger
              id={inputId}
              className="min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            >
              <SelectValue placeholder={editPlaceholder ?? "Selecione..."} />
            </SelectTrigger>
            <SelectContent>
              {editSelectOptions!.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : editing && onEditChange ? (
          <Input
            id={inputId}
            type={inputType}
            value={editValue ?? ""}
            onChange={(e) => onEditChange(e.target.value)}
            required={required}
            className={cn(
              "min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0",
              mono && "font-mono text-xs sm:text-sm"
            )}
          />
        ) : (
          <span
            className={cn(
              "min-w-0 flex-1 text-sm font-medium text-foreground",
              mono && "font-mono text-xs sm:text-sm",
              empty && "font-normal",
              multiline && !empty
                ? "whitespace-pre-wrap wrap-break-words"
                : "truncate"
            )}
          >
            {display}
          </span>
        )}
      </div>
    </fieldset>
  )
}

export function MemberEditActions({
  editing,
  canEdit,
  onStartEdit,
  onCancel,
  onSave,
  isPending,
  editLabel = "Editar",
}: {
  editing: boolean
  canEdit: boolean
  onStartEdit: () => void
  onCancel: () => void
  onSave: () => void
  isPending?: boolean
  editLabel?: string
}) {
  if (!canEdit) return null

  if (!editing) {
    return (
      <div className="flex w-full">
        <Button
          type="button"
          variant="outline"
          onClick={onStartEdit}
          aria-label={editLabel}
          tooltip={editLabel}
          className="w-full"
        >
          <Pencil className="size-4" aria-hidden />
          {editLabel}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-end gap-2 border-t border-border/60 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        Cancelar
      </Button>
      <Button
        type="button"
        onClick={onSave}
        disabled={isPending}
        tooltip="Salvar alterações"
      >
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  )
}

export function MembersListHeader({
  canCreateMember,
  canInvite,
}: {
  canCreateMember: boolean
  canInvite: boolean
}) {
  return (
    <div>
      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center justify-center gap-2 w-full">
            {canCreateMember && (
              <Button asChild className="w-full" variant="outline" tooltip="Criar membro com usuário novo">
                <Link href={`${MEMBERS_BASE_PATH}/new`}>
                  <UserPlus className="size-4" aria-hidden />
                  Novo membro
                </Link>
              </Button>
            )}
            {canInvite && (
              <Button
                asChild
                className="w-full"
                variant="outline"
                tooltip="Convidar usuário existente"
              >
                <Link href={`${MEMBERS_BASE_PATH}/invite`}>
                  <UserRoundPlus className="size-4" aria-hidden />
                  Convidar
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MemberDetailHeader({ member }: { member: MemberDetail }) {
  const displayName = member.user.userName.trim() || "Membro"
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
            className="font-mono text-xs text-muted-foreground pt-2"
            title={member.id}
          >
            Identificador de membro: {member.id.slice(0, 8)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function MemberUserInfoCard({
  user,
  enterpriseId,
  memberId,
  canEdit,
  onUpdateSuccess,
}: {
  user: MemberUserSummary
  enterpriseId: string
  memberId: string
  canEdit?: boolean
  onUpdateSuccess?: () => void
}) {
  const queryClient = useQueryClient()
  const mutation = useUpdateUserMutation(enterpriseId, user.id)
  const [editing, setEditing] = useState(false)
  const [userName, setUserName] = useState(user.userName)
  const [userRegistration, setUserRegistration] = useState(user.userRegistration)
  const [userEmail, setUserEmail] = useState(user.userEmail ?? "")
  const [userPhone, setUserPhone] = useState(user.userPhone ?? "")

  const resetDraft = () => {
    setUserName(user.userName)
    setUserRegistration(user.userRegistration)
    setUserEmail(user.userEmail ?? "")
    setUserPhone(user.userPhone ?? "")
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
    const patch: {
      userName?: string
      userRegistration?: string
      userEmail?: string
      userPhone?: string
    } = {}

    const name = userName.trim()
    const registration = normalizeRegistration(userRegistration)
    const email = normalizeEmail(userEmail)
    const phone = normalizePhone(userPhone)

    if (name && name !== user.userName) patch.userName = name
    if (registration && registration !== user.userRegistration) {
      const regParsed = cpfCnpjSchema.safeParse(registration)
      if (!regParsed.success) {
        toast.error("CPF/CNPJ inválido.")
        return
      }
      patch.userRegistration = regParsed.data
    }
    if (email && email !== (user.userEmail ?? "")) patch.userEmail = email
    if (phone && phone !== (user.userPhone ?? "")) {
      const phoneParsed = phoneE164Schema.safeParse(phone)
      if (!phoneParsed.success) {
        toast.error("Telefone inválido. Use formato +5511999999999.")
        return
      }
      patch.userPhone = phoneParsed.data
    }

    if (name.length < 2) {
      toast.error("Nome completo deve ter pelo menos 2 caracteres.")
      return
    }

    if (Object.keys(patch).length === 0) {
      toast.message("Nenhuma alteração detectada.")
      setEditing(false)
      return
    }

    try {
      await mutation.mutateAsync(patch)
      void queryClient.invalidateQueries({
        queryKey: userDetailsQueryKey(enterpriseId, user.id),
      })
      void queryClient.invalidateQueries({
        queryKey: memberQueryKey(enterpriseId, memberId),
      })
      setEditing(false)
      onUpdateSuccess?.()
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível atualizar o usuário.")
        return
      }
      toast.error("Não foi possível atualizar o usuário.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dados do usuário</CardTitle>
        <CardDescription>Informações cadastrais do usuário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <MemberField
            label="Nome"
            value={user.userName}
            icon={User}
            className="sm:col-span-2"
            editing={editing}
            editValue={userName}
            onEditChange={setUserName}
            inputId="member-userName"
            required
          />
          <MemberField
            label="CPF/CNPJ"
            value={formatCpfCnpj(user.userRegistration)}
            icon={Fingerprint}
            mono
            editing={editing}
            editValue={userRegistration}
            onEditChange={setUserRegistration}
            inputId="member-userRegistration"
            required
          />
          <MemberField
            label="E-mail"
            value={user.userEmail}
            icon={Mail}
            editing={editing}
            editValue={userEmail}
            onEditChange={setUserEmail}
            inputId="member-userEmail"
            inputType="email"
            required
          />
          <MemberField
            label="Telefone"
            value={formatPhone(user.userPhone)}
            icon={Phone}
            editing={editing}
            editValue={userPhone}
            onEditChange={setUserPhone}
            inputId="member-userPhone"
            required
          />
        </div>
        {canEdit && (
          <MemberEditActions
            editing={editing}
            canEdit
            onStartEdit={handleStartEdit}
            onCancel={handleCancel}
            onSave={() => void handleSave()}
            isPending={mutation.isPending}
            editLabel="Editar usuário"
          />
        )}
      </CardContent>
    </Card>
  )
}

export function MemberLinkCard({
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
  const [memberClass, setMemberClass] = useState<EnterpriseMemberClass>(
    member.class
  )
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
    setMemberClass(member.class)
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
    const patch: { class?: EnterpriseMemberClass; status?: MemberStatus } = {}
    if (memberClass !== member.class) patch.class = memberClass
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
        toastHttpError(error, "Não foi possível atualizar o vínculo.")
        return
      }
      toast.error("Não foi possível atualizar o vínculo.")
    }
  }

  async function handleSoftDelete() {
    try {
      await mutation.mutateAsync({ softDelete: true })
      setConfirmDelete(false)
      router.push(MEMBERS_BASE_PATH)
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível inativar o membro.")
        return
      }
      toast.error("Não foi possível inativar o membro.")
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados de vínculo</CardTitle>
          <CardDescription>Informações de vínculo do membro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MemberField
              label="Classe"
              value={getMemberClassLabel(member.class)}
              icon={BadgeCheck}
              editing={editing}
              editValue={memberClass}
              onEditChange={(v) => setMemberClass(v as EnterpriseMemberClass)}
              editSelectOptions={MEMBER_CLASS_OPTIONS}
              inputId="member-class"
            />
            <MemberField
              label="Status"
              value={getMemberStatusLabel(member.status)}
              icon={BadgeCheck}
              editing={editing}
              editValue={status}
              onEditChange={(v) => setStatus(v as MemberStatus)}
              editSelectOptions={MEMBER_STATUS_OPTIONS}
              inputId="member-status"
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
                  tooltip="Desvincular membro"
                >
                  Desvincular membro
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmSoftDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Desvincular membro?"
        description="O membro será desvinculado da empresa e departamentos associados serão removidos."
        confirmLabel="Desvincular"
        isPending={mutation.isPending}
        onConfirm={() => void handleSoftDelete()}
      />
    </>
  )
}
