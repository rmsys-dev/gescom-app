"use client"

import { useState } from "react"
import { Mail, Phone, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { ConfirmSoftDeleteDialog } from "@/components/global/confirm-soft-delete-dialog"
import {
  ProfileEditActions,
  ProfileField,
} from "@/app/(app_routes)/profile/_components/profile-field"
import { UserOnboardingEmpty } from "@/app/(app_routes)/profile/_components/onboarding/user-onboarding-empty"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatPhone } from "@/lib/formatters"
import {
  getUserContactTypeLabel,
  USER_CONTACT_TYPE_OPTIONS,
} from "@/modules/users-onboarding/users-onboarding-labels"
import type {
  UserContact,
  UserContactType,
} from "@/modules/users-onboarding/users-onboarding.schema"
import { appendOnboardingStringField } from "@/modules/users-onboarding/users-onboarding-patch"
import type { PatchUserContactRequest } from "@/modules/users-onboarding/users-onboarding.schema"
import {
  useCreateUserContactMutation,
  usePatchUserContactMutation,
} from "@/modules/users-onboarding/use-users-onboarding"

type EditingTarget = { mode: "create" } | { mode: "edit"; contact: UserContact }

function ContactFormFields({
  editing,
  type,
  displayType,
  onTypeChange,
  phone,
  displayPhone,
  onPhoneChange,
  email,
  displayEmail,
  onEmailChange,
  whatsapp,
  displayWhatsapp,
  onWhatsappChange,
}: {
  editing: boolean
  type: UserContactType
  displayType: string
  onTypeChange: (value: UserContactType) => void
  phone: string
  displayPhone: string | null | undefined
  onPhoneChange: (value: string) => void
  email: string
  displayEmail: string | null | undefined
  onEmailChange: (value: string) => void
  whatsapp: string
  displayWhatsapp: string | null | undefined
  onWhatsappChange: (value: string) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ProfileField
        label="Tipo"
        value={displayType}
        icon={Phone}
        editing={editing}
        editValue={type}
        onEditChange={(value) => onTypeChange(value as UserContactType)}
        editSelectOptions={USER_CONTACT_TYPE_OPTIONS}
      />
      <ProfileField
        label="Telefone"
        value={formatPhone(displayPhone)}
        icon={Phone}
        editing={editing}
        editValue={phone}
        onEditChange={onPhoneChange}
      />
      <ProfileField
        label="E-mail"
        value={displayEmail}
        icon={Mail}
        editing={editing}
        editValue={email}
        onEditChange={onEmailChange}
        inputType="email"
      />
      <ProfileField
        label="WhatsApp"
        value={formatPhone(displayWhatsapp)}
        icon={Phone}
        className="sm:col-span-2"
        editing={editing}
        editValue={whatsapp}
        onEditChange={onWhatsappChange}
      />
    </div>
  )
}

export function UserContactsSection({
  enterpriseId,
  userId,
  memberId,
  contacts,
  canAlter,
}: {
  enterpriseId: string
  userId: string
  memberId?: string
  contacts: UserContact[]
  canAlter: boolean
}) {
  const [editingTarget, setEditingTarget] = useState<EditingTarget | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserContact | null>(null)

  const patchMutation = usePatchUserContactMutation(
    enterpriseId,
    userId,
    memberId
  )

  const isCreating = editingTarget?.mode === "create"
  const editingContact =
    editingTarget?.mode === "edit" ? editingTarget.contact : null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="size-5 text-primary text-base" aria-hidden />
          Contatos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.length === 0 && !isCreating ? (
          <UserOnboardingEmpty
            title="Sem contatos cadastrados."
            description="Adicione contatos secundários ou de referência."
          />
        ) : (
          <ul className="space-y-4">
            {contacts.map((contact) => (
              <ContactListItem
                key={contact.id}
                contact={contact}
                canAlter={canAlter}
                isEditing={
                  editingTarget?.mode === "edit" &&
                  editingTarget.contact.id === contact.id
                }
                onStartEdit={() =>
                  setEditingTarget({ mode: "edit", contact })
                }
                onCancelEdit={() => setEditingTarget(null)}
                onSaved={() => setEditingTarget(null)}
                onDelete={() => setDeleteTarget(contact)}
                enterpriseId={enterpriseId}
                userId={userId}
                memberId={memberId}
                disableActions={Boolean(editingTarget)}
              />
            ))}
          </ul>
        )}

        {isCreating && (
          <ContactCreateForm
            enterpriseId={enterpriseId}
            userId={userId}
            memberId={memberId}
            onCancel={() => setEditingTarget(null)}
            onSaved={() => setEditingTarget(null)}
          />
        )}

        {canAlter && !editingTarget && contacts.length > 0 && (
          <div className="flex w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingTarget({ mode: "create" })}
              className="w-full"
            >
              <Plus className="size-4" aria-hidden />
              Adicionar contato
            </Button>
          </div>
        )}

        {canAlter && contacts.length === 0 && !isCreating && (
          <ProfileEditActions
            editing={false}
            canEdit
            onStartEdit={() => setEditingTarget({ mode: "create" })}
            onCancel={() => undefined}
            onSave={() => undefined}
            addLabel="Adicionar contato"
            isEmpty
          />
        )}
      </CardContent>

      {canAlter && (
        <ConfirmSoftDeleteDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Remover contato?"
          description="O contato será removido logicamente."
          confirmLabel="Remover"
          isPending={patchMutation.isPending}
          onConfirm={async () => {
            if (!deleteTarget) return
            try {
              await patchMutation.mutateAsync({
                contactId: deleteTarget.id,
                input: { softDelete: true },
              })
              setDeleteTarget(null)
              if (editingContact?.id === deleteTarget.id) {
                setEditingTarget(null)
              }
            } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
          }}
        />
      )}
    </Card>
  )
}

function ContactListItem({
  contact,
  canAlter,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaved,
  onDelete,
  enterpriseId,
  userId,
  memberId,
  disableActions,
}: {
  contact: UserContact
  canAlter: boolean
  isEditing: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaved: () => void
  onDelete: () => void
  enterpriseId: string
  userId: string
  memberId?: string
  disableActions: boolean
}) {
  const patchMutation = usePatchUserContactMutation(
    enterpriseId,
    userId,
    memberId
  )
  const [type, setType] = useState<UserContactType>(contact.type)
  const [phone, setPhone] = useState(contact.phone ?? "")
  const [email, setEmail] = useState(contact.email ?? "")
  const [whatsapp, setWhatsapp] = useState(contact.whatsapp ?? "")

  const resetDraft = () => {
    setType(contact.type)
    setPhone(contact.phone ?? "")
    setEmail(contact.email ?? "")
    setWhatsapp(contact.whatsapp ?? "")
  }

  const handleStartEdit = () => {
    resetDraft()
    onStartEdit()
  }

  const handleCancel = () => {
    resetDraft()
    onCancelEdit()
  }

  async function handleSave() {
    const patch: PatchUserContactRequest = {}
    if (type !== contact.type) patch.type = type
    appendOnboardingStringField(patch, "phone", phone, contact.phone, true)
    appendOnboardingStringField(patch, "email", email, contact.email, true)
    appendOnboardingStringField(
      patch,
      "whatsapp",
      whatsapp,
      contact.whatsapp,
      true
    )

    if (Object.keys(patch).length === 0) {
      onSaved()
      return
    }

    try {
      await patchMutation.mutateAsync({
        contactId: contact.id,
        input: patch,
      })
      onSaved()
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <li className="space-y-4 rounded-lg border border-border/60 bg-muted/15 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">
          {getUserContactTypeLabel(contact.type)}
        </p>
        {canAlter && !isEditing && (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={onDelete}
            aria-label="Remover contato"
            disabled={disableActions}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </div>

      <ContactFormFields
        editing={isEditing}
        type={type}
        displayType={getUserContactTypeLabel(contact.type)}
        onTypeChange={setType}
        phone={phone}
        displayPhone={contact.phone}
        onPhoneChange={setPhone}
        email={email}
        displayEmail={contact.email}
        onEmailChange={setEmail}
        whatsapp={whatsapp}
        displayWhatsapp={contact.whatsapp}
        onWhatsappChange={setWhatsapp}
      />

      {canAlter && (
        <ProfileEditActions
          editing={isEditing}
          canEdit
          onStartEdit={handleStartEdit}
          onCancel={handleCancel}
          onSave={() => void handleSave()}
          isPending={patchMutation.isPending}
          editLabel="Editar contato"
        />
      )}
    </li>
  )
}

function ContactCreateForm({
  enterpriseId,
  userId,
  memberId,
  onCancel,
  onSaved,
}: {
  enterpriseId: string
  userId: string
  memberId?: string
  onCancel: () => void
  onSaved: () => void
}) {
  const createMutation = useCreateUserContactMutation(
    enterpriseId,
    userId,
    memberId
  )
  const [type, setType] = useState<UserContactType>("PRINCIPAL")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  async function handleSave() {
    const body: Record<string, string> = { type }
    if (phone.trim()) body.phone = phone.trim()
    if (email.trim()) body.email = email.trim()
    if (whatsapp.trim()) body.whatsapp = whatsapp.trim()

    if (!body.phone && !body.email && !body.whatsapp) {
      toast.message("Informe telefone, e-mail ou WhatsApp.")
      return
    }

    try {
      await createMutation.mutateAsync(
        body as { type: UserContactType; phone?: string; email?: string; whatsapp?: string }
      )
      onSaved()
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-dashed border-border/80 bg-muted/10 p-4">
      <p className="text-sm font-semibold text-foreground">Novo contato</p>
      <ContactFormFields
        editing
        type={type}
        displayType={getUserContactTypeLabel(type)}
        onTypeChange={setType}
        phone={phone}
        displayPhone={phone}
        onPhoneChange={setPhone}
        email={email}
        displayEmail={email}
        onEmailChange={setEmail}
        whatsapp={whatsapp}
        displayWhatsapp={whatsapp}
        onWhatsappChange={setWhatsapp}
      />
      <ProfileEditActions
        editing
        canEdit
        onStartEdit={() => undefined}
        onCancel={onCancel}
        onSave={() => void handleSave()}
        isPending={createMutation.isPending}
      />
    </div>
  )
}
