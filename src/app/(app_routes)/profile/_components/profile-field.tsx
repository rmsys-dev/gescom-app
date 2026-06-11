"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  BadgeCheck,
  Mail,
  Pencil,
  Phone,
  User,
  UserRound,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCpfCnpj, formatPhone } from "@/lib/formatters"
import { getUserInitials } from "@/lib/user-initials"
import { cn } from "@/lib/utils"
import { HttpError } from "@/lib/api/http-error"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import type { MeResponse } from "@/modules/authentication/auth.schema"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"
import { useUpdateUserMutation } from "@/modules/users/use-users"
import { userDetailsQueryKey } from "@/modules/users-onboarding/use-users-onboarding"

function formatValue(value: string | null | undefined | boolean): string {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "boolean") return value ? "Sim" : "Não"
  return String(value)
}

export type ProfileSelectOption = {
  value: string
  label: string
}

export function ProfileField({
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
  editDisabled,
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
  editSelectOptions?: ProfileSelectOption[]
  editPlaceholder?: string
  editDisabled?: boolean
}) {
  const display = formatValue(value)
  const empty = display === "—"
  const isSelectEdit = editing && Boolean(editSelectOptions?.length && onEditChange)

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
          <Select
            value={editValue ?? ""}
            onValueChange={onEditChange}
            disabled={editDisabled}
          >
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

export function ProfileEditActions({
  editing,
  canEdit,
  onStartEdit,
  onCancel,
  onSave,
  isPending,
  editLabel = "Editar",
  addLabel = "Adicionar",
  isEmpty = false,
}: {
  editing: boolean
  canEdit: boolean
  onStartEdit: () => void
  onCancel: () => void
  onSave: () => void
  isPending?: boolean
  editLabel?: string
  addLabel?: string
  isEmpty?: boolean
}) {
  if (!canEdit) return null

  if (!editing) {
    return (
      <div className="flex w-full">
        <Button
          type="button"
          variant="outline"
          onClick={onStartEdit}
          aria-label={isEmpty ? addLabel : editLabel}
          tooltip={isEmpty ? addLabel : editLabel}
          className="w-full"
        >
          <Pencil className="size-4" aria-hidden />
          {isEmpty ? addLabel : editLabel}
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

function ProfilePersonalInfoFields({
  user,
  enterpriseId,
  canEdit,
  onUpdateSuccess,
}: {
  user: MeResponse["user"]
  enterpriseId?: string
  canEdit?: boolean
  onUpdateSuccess?: () => void
}) {
  const queryClient = useQueryClient()
  const mutation = useUpdateUserMutation(enterpriseId ?? "", user.id)
  const [editing, setEditing] = useState(false)
  const [userName, setUserName] = useState(user.name)
  const [userRegistration, setUserRegistration] = useState(user.registration)
  const [userEmail, setUserEmail] = useState(user.email ?? "")
  const [userPhone, setUserPhone] = useState(user.phone ?? "")

  const resetDraft = () => {
    setUserName(user.name)
    setUserRegistration(user.registration)
    setUserEmail(user.email ?? "")
    setUserPhone(user.phone ?? "")
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

    if (name && name !== user.name) patch.userName = name
    if (registration && registration !== user.registration) {
      const regParsed = cpfCnpjSchema.safeParse(registration)
      if (!regParsed.success) {
        toast.error("CPF/CNPJ invalido.")
        return
      }
      patch.userRegistration = regParsed.data
    }
    if (email && email !== (user.email ?? "")) patch.userEmail = email
    if (phone && phone !== (user.phone ?? "")) {
      const phoneParsed = phoneE164Schema.safeParse(phone)
      if (!phoneParsed.success) {
        toast.error("Telefone invalido. Use formato +5511999999999.")
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
      if (enterpriseId) {
        void queryClient.invalidateQueries({
          queryKey: userDetailsQueryKey(enterpriseId, user.id),
        })
      }
      setEditing(false)
      onUpdateSuccess?.()
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível atualizar o perfil.")
        return
      }
      toast.error("Não foi possível atualizar o perfil.")
    }
  }

  const showEditControls = Boolean(canEdit && enterpriseId)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField
          label="Nome completo"
          value={user.name}
          icon={User}
          className="sm:col-span-2"
          editing={editing}
          editValue={userName}
          onEditChange={setUserName}
          inputId="profile-userName"
          required
        />
        <ProfileField
          label="E-mail"
          value={user.email}
          icon={Mail}
          editing={editing}
          editValue={userEmail}
          onEditChange={setUserEmail}
          inputId="profile-userEmail"
          inputType="email"
          required
        />
        <ProfileField
          label="Telefone"
          value={formatPhone(user.phone)}
          icon={Phone}
          editing={editing}
          editValue={userPhone}
          onEditChange={setUserPhone}
          inputId="profile-userPhone"
          required
        />
        <ProfileField
          label="CPF / CNPJ"
          value={formatCpfCnpj(user.registration)}
          icon={BadgeCheck}
          mono
          editing={editing}
          editValue={userRegistration}
          onEditChange={setUserRegistration}
          inputId="profile-userRegistration"
          required
        />
        <ProfileField
          label="Perfil completo"
          value={user.onboardingCompleted}
          icon={UserRound}
        />
      </div>

      {showEditControls && (
        <ProfileEditActions
          editing={editing}
          canEdit
          onStartEdit={handleStartEdit}
          onCancel={handleCancel}
          onSave={() => void handleSave()}
          isPending={mutation.isPending}
          editLabel="Editar perfil"
        />
      )}
    </div>
  )
}

export function ProfileSection({
  user,
  enterpriseId,
  canEdit,
  onUpdateSuccess,
}: {
  user: MeResponse["user"]
  enterpriseId?: string
  canEdit?: boolean
  onUpdateSuccess?: () => void
}) {
  const initials = getUserInitials(user.name)

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex justify-center">
          <Avatar
            size="default"
            className="size-24 ring-4 ring-background shadow-md after:border-0"
          >
            <AvatarFallback className="bg-primary/15 text-4xl font-semibold tracking-tight text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <ProfilePersonalInfoFields
          user={user}
          enterpriseId={enterpriseId}
          canEdit={canEdit}
          onUpdateSuccess={onUpdateSuccess}
        />
      </CardContent>
    </Card>
  )
}
