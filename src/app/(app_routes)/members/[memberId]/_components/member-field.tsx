"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  BadgeCheck,
  Calendar,
  Fingerprint,
  Hash,
  Mail,
  Pencil,
  Phone,
  Trash,
  User,
  X,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ConfirmSoftDeleteDialog } from "@/components/global/dialogs/confirm-soft-delete-dialog"
import { MemberProfileSummary } from "@/app/(app_routes)/members/_components/member-profile-summary"
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
import { EMPTY_DISPLAY, formatCpfCnpj, formatDateOnly, formatEmpty, formatPhone } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
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
import { memberQueryKey } from "@/modules/memberships/memberships-query-keys"
import {
  useUpdateMemberMutation,
} from "@/modules/memberships/use-members"
import { useIncludedByDisplay } from "@/modules/memberships/use-included-by-display"
import { useUpdateUserMutation } from "@/modules/users/use-users"
import { userDetailsQueryKey } from "@/modules/users-onboarding/use-users-onboarding"

export type MemberSelectOption = {
  value: string
  label: string
}

function memberFormCardClassName(editing: boolean) {
  return cn(
    !editing && "border-none ring-0 shadow-md transition-all duration-450",
    editing &&
    "bg-primary/5 border-primary/40 ring-primary/40 shadow-md transition-all duration-450"
  )
}

function MemberFieldReveal({
  open,
  className,
  children,
}: {
  open: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-450 ease-in-out",
        open
          ? "grid-rows-[1fr] opacity-100"
          : "pointer-events-none grid-rows-[0fr] opacity-0",
        className
      )}
      aria-hidden={!open}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

export function MemberField({
  label,
  value,
  icon: Icon,
  className,
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
  const display = formatEmpty(value)
  const empty = display === EMPTY_DISPLAY
  const isSelectEdit =
    editing && Boolean(editSelectOptions?.length && onEditChange)

  const activeFieldStyles =
    "group-focus-within:border-primary/40 group-has-data-[state=open]:border-primary/40"
  const activeLegendStyles =
    "group-focus-within:text-primary group-has-data-[state=open]:text-primary"
  const activeIconStyles =
    "group-focus-within:bg-transparent group-focus-within:text-primary group-focus-within:ring-0 group-focus-within:shadow-none group-has-data-[state=open]:bg-transparent group-has-data-[state=open]:text-primary group-has-data-[state=open]:ring-0 group-has-data-[state=open]:shadow-none"
  const activeInputStyles =
    "group-focus-within:text-primary group-has-data-[state=open]:text-primary bg-transparent px-2 dark:bg-transparent"
  const memberSelectTriggerClassName = cn(
    "min-w-0 flex-1 h-auto w-full border-0 bg-transparent p-0 shadow-none",
    "text-sm font-medium transition-all duration-450",
    "focus-visible:border-0 focus-visible:ring-0",
    "data-[size=default]:h-auto data-[size=sm]:h-auto",
    "dark:bg-transparent dark:hover:bg-transparent",
    "[&_svg]:text-muted-foreground [&_svg]:transition-all [&_svg]:duration-450",
    "focus:text-primary focus:[&_svg]:text-primary",
    "data-[state=open]:text-primary data-[state=open]:[&_svg]:text-primary",
    editing && activeInputStyles
  )

  return (
    <fieldset className={cn("group min-w-0 space-y-2", className)}>
      <legend
        className={cn(
          "text-xs font-medium tracking-wide text-muted-foreground transition-all duration-450",
          editing && activeLegendStyles
        )}
      >
        {label}
      </legend>
      <div
        className={cn(
          "flex min-h-10 gap-3 border border-border/60 bg-muted/25 px-3 py-2.5 transition-all duration-450",
          multiline && !empty && !editing ? "items-start" : "items-center",
          !editing && empty && "text-muted-foreground",
          editing && activeFieldStyles
        )}
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center bg-background/80 text-muted-foreground shadow-sm ring-1 ring-border/50 transition-all duration-450",
            editing && activeIconStyles
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
        {isSelectEdit ? (
          <Select value={editValue ?? ""} onValueChange={onEditChange}>
            <SelectTrigger
              id={inputId}
              className={memberSelectTriggerClassName}
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
              "min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 transition-all duration-450",
              !empty && activeInputStyles
            )}
          />
        ) : (
          <span
            className={cn(
              "min-w-0 flex-1 text-sm font-medium text-foreground",
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
          className="w-full"
        >
          <Pencil className="size-4" aria-hidden />
          {editLabel}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2 items-center">
      <Button
        type="button"
        onClick={onSave}
        disabled={isPending}
        className="w-full flex-1"
      >
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Cancelar edição"
        tooltip="Cancelar edição"
        className="border-0 shadow-none ring-0"
        onClick={onCancel}
        disabled={isPending}
      >
        <X className="size-4" aria-hidden />
      </Button>
    </div>
  )
}

export function MemberDetailHeader({
  member,
}: {
  member: MemberDetail
}) {
  return <MemberProfileSummary member={member} variant="card" />
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
    <Card className={memberFormCardClassName(editing)}>
      <CardHeader>
        <CardTitle className="text-base">{editing ? "Editar dados do usuário" : "Dados do usuário"}</CardTitle>
        <CardDescription>{editing ? "Edite as informações cadastrais do usuário" : "Informações cadastrais do usuário"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <MemberField
            label="Nome"
            value={user.userName}
            icon={User}
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

  const { display: includedByDisplay, isPending: includedByPending } =
    useIncludedByDisplay(enterpriseId, member.includedBy)

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
    if (memberClass !== member.class) {
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
      router.push("/members")
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <>
      <Card className={memberFormCardClassName(editing)}>
        <CardHeader>
          <CardTitle className="text-base">
            {editing ? "Editar vínculo" : "Vínculo"}
          </CardTitle>
          <CardDescription>
            {editing
              ? "Edite as informações sobre o vínculo do membro"
              : "Informações sobre o vínculo do membro"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-0">
            <MemberFieldReveal open={!editing}>
              <div className="grid gap-4 sm:grid-cols-3">
                <MemberField
                  label="Código"
                  value={member.code != null ? String(member.code) : null}
                  icon={Hash}
                />
                <MemberField
                  label="Classe"
                  value={getMemberClassLabel(member.class)}
                  icon={BadgeCheck}
                />
                <MemberField
                  label="Status"
                  value={getMemberStatusLabel(member.status)}
                  icon={BadgeCheck}
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
                  value={includedByPending ? "…" : formatEmpty(includedByDisplay)}
                  icon={User}
                />
              </div>
            </MemberFieldReveal>

            <MemberFieldReveal open={editing}>
              <div className="grid gap-4 sm:grid-cols-2">
                <MemberField
                  label="Classe"
                  value={getMemberClassLabel(member.class)}
                  icon={BadgeCheck}
                  editing
                  editValue={memberClass}
                  onEditChange={(v) => setMemberClass(v as EnterpriseMemberClass)}
                  editSelectOptions={MEMBER_CLASS_OPTIONS}
                  inputId="member-class"
                />
                <MemberField
                  label="Status"
                  value={getMemberStatusLabel(member.status)}
                  icon={BadgeCheck}
                  editing
                  editValue={status}
                  onEditChange={(v) => setStatus(v as MemberStatus)}
                  editSelectOptions={MEMBER_STATUS_OPTIONS}
                  inputId="member-status"
                />
              </div>
            </MemberFieldReveal>
          </div>
          {canEdit && (
            <div className={cn("w-full", !editing && "w-full flex justify-between gap-2 items-center")}>
              <MemberEditActions
                editing={editing}
                canEdit
                onStartEdit={handleStartEdit}
                onCancel={handleCancel}
                onSave={() => void handleSave()}
                isPending={mutation.isPending}
                editLabel="Editar vínculo"
              />
              <div />
              {!editing && (
                <Button
                  type="button"
                  variant="destructive"
                  className="border-0 shadow-none ring-0"
                  onClick={() => setConfirmDelete(true)}
                  tooltip="Remover vínculo"
                >
                  <Trash className="size-4" aria-hidden />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmSoftDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Remover vínculo"
        description="Tem certeza que deseja remover o vínculo do membro? Esta ação não pode ser desfeita."
        confirmLabel="Remover vínculo"
        isPending={mutation.isPending}
        onConfirm={() => void handleSoftDelete()}
      />
    </>
  )
}
