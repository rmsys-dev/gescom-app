"use client"

import { useState } from "react"
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
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ConfirmSoftDeleteDialog } from "@/components/global/dialogs/confirm-soft-delete-dialog"
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
import { getUserInitials } from "@/lib/user-initials"
import { cn } from "@/lib/utils"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import {
  getMemberClassLabel,
  MEMBER_CLASS_OPTIONS,
} from "@/modules/memberships/member-class-label"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
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
import { memberQueryKey } from "@/modules/memberships/memberships-query-keys"
import {
  useMembersQuery,
  useUpdateMemberMutation,
} from "@/modules/memberships/use-members"
import { useUpdateUserMutation, useUserQuery } from "@/modules/users/use-users"
import { userDetailsQueryKey } from "@/modules/users-onboarding/use-users-onboarding"

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
          "flex min-h-10 gap-3 border border-border/60 bg-muted/25 px-3 py-2.5 transition-colors",
          multiline && !empty && !editing ? "items-start" : "items-center",
          !editing && empty && "text-muted-foreground"
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center bg-background/80 text-muted-foreground shadow-sm ring-1 ring-border/50">
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

export function MemberDetailHeader({
  member,
  config,
}: {
  member: MemberDetail
  config: MembershipRouteConfig
}) {
  const displayName =
    member.user.userName.trim() || config.labels.defaultDisplayName
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
            {config.labels.identifierLabel}: {member.id.slice(0, 8)}
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
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
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
  config,
  canEdit,
  onUpdateSuccess,
}: {
  member: MemberDetail
  enterpriseId: string
  config: MembershipRouteConfig
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
  const allowClassEdit = config.detail.allowClassEdit

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
    if (allowClassEdit && memberClass !== member.class) {
      patch.class = memberClass
    }
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
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  async function handleSoftDelete() {
    try {
      await mutation.mutateAsync({ softDelete: true })
      setConfirmDelete(false)
      router.push(config.basePath)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{config.detail.linkCardTitle}</CardTitle>
          <CardDescription>{config.detail.linkCardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {allowClassEdit && (
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
            )}
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
                  tooltip={config.detail.softDeleteLabel}
                >
                  {config.detail.softDeleteLabel}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmSoftDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={config.detail.softDeleteTitle}
        description={config.detail.softDeleteDescription}
        confirmLabel={config.detail.softDeleteConfirm}
        isPending={mutation.isPending}
        onConfirm={() => void handleSoftDelete()}
      />
    </>
  )
}
