"use client"

import { useMemo, useState } from "react"
import { Globe, MapPin, Tag } from "lucide-react"
import { toast } from "sonner"

import {
  ProfileEditActions,
  ProfileField,
} from "@/app/(app_routes)/profile/_components/profile-field"
import { HttpError } from "@/lib/api/http-error"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import {
  useCepsQuery,
  useCitiesQuery,
  useCountriesQuery,
  useStatesQuery,
} from "@/modules/addresses/use-address-catalog"
import {
  getUserAddressTypeLabel,
  USER_ADDRESS_TYPE_OPTIONS,
} from "@/modules/users-onboarding/users-onboarding-labels"
import type { UserAddressType } from "@/modules/users-onboarding/users-onboarding.schema"
import { useCreateUserAddressMutation } from "@/modules/users-onboarding/use-users-onboarding"

function formatCepMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function UserAddressFormFields({
  editing,
  countryId,
  stateId,
  cityId,
  cepId,
  adressType,
  displayCountry,
  displayState,
  displayCity,
  displayCep,
  displayType,
  onCountryChange,
  onStateChange,
  onCityChange,
  onCepChange,
  onAdressTypeChange,
}: {
  editing: boolean
  countryId: string
  stateId: string
  cityId: string
  cepId: string
  adressType: UserAddressType
  displayCountry: string | null | undefined
  displayState: string | null | undefined
  displayCity: string | null | undefined
  displayCep: string | null | undefined
  displayType: string
  onCountryChange: (value: string) => void
  onStateChange: (value: string) => void
  onCityChange: (value: string) => void
  onCepChange: (value: string) => void
  onAdressTypeChange: (value: UserAddressType) => void
}) {
  const countriesQuery = useCountriesQuery(editing)
  const statesQuery = useStatesQuery(countryId || undefined, editing)
  const citiesQuery = useCitiesQuery(stateId || undefined, editing)
  const cepsQuery = useCepsQuery(cityId || undefined, undefined, editing)

  const countryOptions = useMemo(
    () =>
      (countriesQuery.data ?? []).map((c) => ({
        value: c.id,
        label: c.countryName,
      })),
    [countriesQuery.data]
  )

  const stateOptions = useMemo(
    () =>
      (statesQuery.data ?? []).map((s) => ({
        value: s.id,
        label: `${s.acronym} — ${s.description}`,
      })),
    [statesQuery.data]
  )

  const cityOptions = useMemo(
    () =>
      (citiesQuery.data ?? []).map((c) => ({
        value: c.id,
        label: c.citieName,
      })),
    [citiesQuery.data]
  )

  const cepOptions = useMemo(
    () =>
      (cepsQuery.data ?? []).map((c) => ({
        value: c.id,
        label: `${formatCepMask(c.cepNumber)} — ${c.address}, ${c.neighborhood}`,
      })),
    [cepsQuery.data]
  )

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ProfileField
        label="País"
        value={displayCountry}
        icon={Globe}
        editing={editing}
        editValue={countryId}
        onEditChange={onCountryChange}
        editSelectOptions={countryOptions}
        editPlaceholder="Selecione o país..."
      />
      <ProfileField
        label="Estado"
        value={displayState}
        icon={MapPin}
        editing={editing}
        editValue={stateId}
        onEditChange={onStateChange}
        editSelectOptions={stateOptions}
        editPlaceholder="Selecione o estado..."
        editDisabled={!countryId}
      />
      <ProfileField
        label="Cidade"
        value={displayCity}
        icon={MapPin}
        editing={editing}
        editValue={cityId}
        onEditChange={onCityChange}
        editSelectOptions={cityOptions}
        editPlaceholder="Selecione a cidade..."
        editDisabled={!stateId}
      />
      <ProfileField
        label="CEP / Logradouro"
        value={displayCep}
        icon={MapPin}
        className="sm:col-span-2"
        editing={editing}
        editValue={cepId}
        onEditChange={onCepChange}
        editSelectOptions={cepOptions}
        editPlaceholder="Selecione o CEP..."
        editDisabled={!cityId}
      />
      <ProfileField
        label="Tipo"
        value={displayType}
        icon={Tag}
        editing={editing}
        editValue={adressType}
        onEditChange={(value) => onAdressTypeChange(value as UserAddressType)}
        editSelectOptions={USER_ADDRESS_TYPE_OPTIONS}
      />
    </div>
  )
}

export function UserAddressCreateForm({
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
  const createMutation = useCreateUserAddressMutation(
    enterpriseId,
    userId,
    memberId
  )

  const [countryId, setCountryId] = useState("")
  const [stateId, setStateId] = useState("")
  const [cityId, setCityId] = useState("")
  const [cepId, setCepId] = useState("")
  const [adressType, setAdressType] = useState<UserAddressType>("PRINCIPAL")

  async function handleSave() {
    if (!countryId || !stateId || !cityId || !cepId) {
      toast.error("Preencha país, estado, cidade e CEP.")
      return
    }

    try {
      await createMutation.mutateAsync({
        countryId,
        stateId,
        cityId,
        cepId,
        adressType,
      })
      onSaved()
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível adicionar o endereço.")
        return
      }
      toast.error("Não foi possível adicionar o endereço.")
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-dashed border-border/80 bg-muted/10 p-4">
      <p className="text-sm font-semibold text-foreground">Novo endereço</p>
      <UserAddressFormFields
        editing
        countryId={countryId}
        stateId={stateId}
        cityId={cityId}
        cepId={cepId}
        adressType={adressType}
        displayCountry={countryId}
        displayState={stateId}
        displayCity={cityId}
        displayCep={cepId}
        displayType={getUserAddressTypeLabel(adressType)}
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
