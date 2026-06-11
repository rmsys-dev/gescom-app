"use client"

import { useState } from "react"
import { MapPin, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { ConfirmSoftDeleteDialog } from "@/components/global/confirm-soft-delete-dialog"
import { ProfileEditActions } from "@/app/(app_routes)/profile/_components/profile-field"
import { UserOnboardingEmpty } from "@/app/(app_routes)/profile/_components/onboarding/user-onboarding-empty"
import {
  UserAddressCreateForm,
  UserAddressFormFields,
} from "@/app/(app_routes)/profile/_components/onboarding/user-address-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HttpError } from "@/lib/api/http-error"
import { useResolveAddressDisplay } from "@/modules/addresses/use-resolve-address-display"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
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
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível remover o endereço.")
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-5 text-primary text-base" aria-hidden />
          Endereços
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.length === 0 && !isCreating ? (
          <UserOnboardingEmpty
            title="Sem endereços cadastrados."
            description="Adicione um endereço com país, estado, cidade e CEP."
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
                  displayCountry={loadingLabel ?? display.countryName}
                  displayState={loadingLabel ?? display.stateLabel}
                  displayCity={loadingLabel ?? display.cityName}
                  displayCep={loadingLabel ?? display.cepSummary}
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

  const [countryId, setCountryId] = useState(address.countryId)
  const [stateId, setStateId] = useState(address.stateId)
  const [cityId, setCityId] = useState(address.cityId)
  const [cepId, setCepId] = useState(address.cepId)
  const [adressType, setAdressType] = useState<UserAddressType>(
    address.adressType
  )

  const resetDraft = () => {
    setCountryId(address.countryId)
    setStateId(address.stateId)
    setCityId(address.cityId)
    setCepId(address.cepId)
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
    if (!countryId || !stateId || !cityId || !cepId) {
      toast.error("Preencha país, estado, cidade e CEP.")
      return
    }

    const input: {
      countryId?: string
      stateId?: string
      cityId?: string
      cepId?: string
      adressType?: UserAddressType
    } = {}

    if (countryId !== address.countryId) input.countryId = countryId
    if (stateId !== address.stateId) input.stateId = stateId
    if (cityId !== address.cityId) input.cityId = cityId
    if (cepId !== address.cepId) input.cepId = cepId
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
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível atualizar o endereço.")
        return
      }
      toast.error("Não foi possível atualizar o endereço.")
    }
  }

  return (
    <li className="space-y-4 rounded-lg border border-border/60 bg-muted/15 p-4">
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
