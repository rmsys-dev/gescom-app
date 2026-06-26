"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { ConfirmSoftDeleteDialog } from "@/components/global/dialogs/confirm-soft-delete-dialog"
import { ProfileEditActions, profileFormCardClassName } from "@/app/(app_routes)/profile/_components/profile-field"
import { UserOnboardingEmpty } from "@/app/(app_routes)/profile/_components/onboarding/user-onboarding-empty"
import {
  UserAddressCreateForm,
  UserAddressFormFields,
} from "@/app/(app_routes)/profile/_components/onboarding/user-address-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useResolveAddressDisplay } from "@/modules/addresses/use-resolve-address-display"
import { getUserAddressTypeLabel } from "@/modules/users-onboarding/users-onboarding-labels"
import type {
  UserAddress,
  UserAddressType,
} from "@/modules/users-onboarding/users-onboarding.schema"
import { usePatchUserAddressMutation } from "@/modules/users-onboarding/use-users-onboarding"

type EditingTarget = { mode: "create" } | { mode: "edit"; address: UserAddress }

export function UserAddressesSection({
  enterpriseId,
  userId,
  memberId,
  addresses,
  canAlter,
}: {
  enterpriseId: string
  userId: string
  memberId?: string
  addresses: UserAddress[]
  canAlter: boolean
}) {
  const [editingTarget, setEditingTarget] = useState<EditingTarget | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserAddress | null>(null)

  const { getDisplay, isLoading } = useResolveAddressDisplay(
    addresses,
    addresses.length > 0
  )
  const patchMutation = usePatchUserAddressMutation(
    enterpriseId,
    userId,
    memberId
  )

  const isCreating = editingTarget?.mode === "create"
  const editingAddress =
    editingTarget?.mode === "edit" ? editingTarget.address : null

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await patchMutation.mutateAsync({
        addressId: deleteTarget.id,
        input: { softDelete: true },
      })
      setDeleteTarget(null)
      if (editingAddress?.id === deleteTarget.id) {
        setEditingTarget(null)
      }
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  const isEditingSection = Boolean(editingTarget)

  return (
    <Card className={profileFormCardClassName(isEditingSection)}>
      <CardHeader>
        <CardTitle className="text-base">
          {isEditingSection ? "Editar endereços" : "Endereços"}
        </CardTitle>
        <CardDescription>
          {isEditingSection
            ? "Edite ou adicione endereços com CEP, número e complemento"
            : "Endereços com CEP, número e complemento"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.length === 0 && !isCreating ? (
          <UserOnboardingEmpty
            title="Sem endereços cadastrados."
            description="Adicione um endereço com CEP e número."
          />
        ) : (
          <ul className="space-y-4">
            {addresses.map((address) => {
              const display = getDisplay(address)
              const loadingLabel = isLoading ? "A carregar..." : null

              return (
                <AddressListItem
                  key={address.id}
                  address={address}
                  canAlter={canAlter}
                  isEditing={
                    editingTarget?.mode === "edit" &&
                    editingTarget.address.id === address.id
                  }
                  displayCountry={(loadingLabel ?? display.countryName) ?? null}
                  displayState={(loadingLabel ?? display.stateLabel) ?? null}
                  displayCity={(loadingLabel ?? display.cityName) ?? null}
                  displayCep={(loadingLabel ?? display.cepSummary) ?? null}
                  onStartEdit={() =>
                    setEditingTarget({ mode: "edit", address })
                  }
                  onCancelEdit={() => setEditingTarget(null)}
                  onSaved={() => setEditingTarget(null)}
                  onDelete={() => setDeleteTarget(address)}
                  enterpriseId={enterpriseId}
                  userId={userId}
                  memberId={memberId}
                  disableActions={Boolean(editingTarget)}
                />
              )
            })}
          </ul>
        )}

        {isCreating && (
          <UserAddressCreateForm
            enterpriseId={enterpriseId}
            userId={userId}
            memberId={memberId}
            onCancel={() => setEditingTarget(null)}
            onSaved={() => setEditingTarget(null)}
          />
        )}

        {canAlter && !editingTarget && addresses.length > 0 && (
          <div className="flex w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingTarget({ mode: "create" })}
              className="w-full"
            >
              <Plus className="size-4" aria-hidden />
              Adicionar endereço
            </Button>
          </div>
        )}

        {canAlter && addresses.length === 0 && !isCreating && (
          <ProfileEditActions
            editing={false}
            canEdit
            onStartEdit={() => setEditingTarget({ mode: "create" })}
            onCancel={() => undefined}
            onSave={() => undefined}
            addLabel="Adicionar endereço"
            isEmpty
          />
        )}
      </CardContent>

      {canAlter && (
        <ConfirmSoftDeleteDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Remover endereço?"
          description="O endereço será removido logicamente."
          confirmLabel="Remover"
          isPending={patchMutation.isPending}
          onConfirm={() => void confirmDelete()}
        />
      )}
    </Card>
  )
}

function AddressListItem({
  address,
  canAlter,
  isEditing,
  displayCountry,
  displayState,
  displayCity,
  displayCep,
  onStartEdit,
  onCancelEdit,
  onSaved,
  onDelete,
  enterpriseId,
  userId,
  memberId,
  disableActions,
}: {
  address: UserAddress
  canAlter: boolean
  isEditing: boolean
  displayCountry: string | null | undefined
  displayState: string | null | undefined
  displayCity: string | null | undefined
  displayCep: string | null | undefined
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaved: () => void
  onDelete: () => void
  enterpriseId: string
  userId: string
  memberId?: string
  disableActions: boolean
}) {
  const patchMutation = usePatchUserAddressMutation(
    enterpriseId,
    userId,
    memberId
  )

  /** Seletores de cascata — apenas para navegação, não enviados ao backend */
  const [countryId, setCountryId] = useState("")
  const [stateId, setStateId] = useState("")
  const [cityId, setCityId] = useState("")
  const [cepId, setCepId] = useState(address.cepId)
  const [number, setNumber] = useState(address.number ?? "")
  const [complement, setComplement] = useState(address.complement ?? "")
  const [adressType, setAdressType] = useState<UserAddressType>(
    address.adressType
  )

  const resetDraft = () => {
    setCountryId("")
    setStateId("")
    setCityId("")
    setCepId(address.cepId)
    setNumber(address.number ?? "")
    setComplement(address.complement ?? "")
    setAdressType(address.adressType)
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
    if (!cepId) {
      toast.error("Selecione o CEP.")
      return
    }
    if (!number.trim()) {
      toast.error("Informe o número do endereço.")
      return
    }

    const input: {
      cepId?: string
      number?: string
      complement?: string | null
      adressType?: UserAddressType
    } = {}

    if (cepId !== address.cepId) input.cepId = cepId
    if (number.trim() !== (address.number ?? "")) input.number = number.trim()
    const newComplement = complement.trim() || null
    if (newComplement !== address.complement) input.complement = newComplement
    if (adressType !== address.adressType) input.adressType = adressType

    if (Object.keys(input).length === 0) {
      onSaved()
      return
    }

    try {
      await patchMutation.mutateAsync({
        addressId: address.id,
        input,
      })
      onSaved()
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <li className="space-y-4 border border-border/60 bg-muted/15 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">
          {getUserAddressTypeLabel(address.adressType)}
        </p>
        {canAlter && !isEditing && (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={onDelete}
            aria-label="Remover endereço"
            disabled={disableActions}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </div>

      <UserAddressFormFields
        editing={isEditing}
        countryId={countryId}
        stateId={stateId}
        cityId={cityId}
        cepId={cepId}
        number={number}
        complement={complement}
        adressType={adressType}
        displayCountry={displayCountry}
        displayState={displayState}
        displayCity={displayCity}
        displayCep={displayCep}
        displayType={getUserAddressTypeLabel(address.adressType)}
        onCountryChange={(value) => {
          setCountryId(value)
          setStateId("")
          setCityId("")
          setCepId("")
        }}
        onStateChange={(value) => {
          setStateId(value)
          setCityId("")
          setCepId("")
        }}
        onCityChange={(value) => {
          setCityId(value)
          setCepId("")
        }}
        onCepChange={setCepId}
        onNumberChange={setNumber}
        onComplementChange={setComplement}
        onAdressTypeChange={setAdressType}
      />

      {canAlter && (
        <ProfileEditActions
          editing={isEditing}
          canEdit
          onStartEdit={handleStartEdit}
          onCancel={handleCancel}
          onSave={() => void handleSave()}
          isPending={patchMutation.isPending}
          editLabel="Editar endereço"
        />
      )}
    </li>
  )
}
