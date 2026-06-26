"use client"

import { useMemo, useState } from "react"
import { Globe, MapPin, Tag } from "lucide-react"
import { toast } from "sonner"

import {
  ProfileEditActions,
  ProfileField,
} from "@/app/(app_routes)/profile/_components/profile-field"
import { Input } from "@/components/ui/input"
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

/**
 * Campos do formulário de endereço de usuário.
 * countryId/stateId/cityId são apenas para navegação em cascata — não enviados ao backend.
 */
export function UserAddressFormFields({
  editing,
  countryId,
  stateId,
  cityId,
  cepId,
  number,
  complement,
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
  onNumberChange,
  onComplementChange,
  onAdressTypeChange,
}: {
  editing: boolean
  countryId: string
  stateId: string
  cityId: string
  cepId: string
  number: string
  complement: string
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
  onNumberChange: (value: string) => void
  onComplementChange: (value: string) => void
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
      {editing && (
        <>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Número</span>
            <Input
              value={number}
              onChange={(e) => onNumberChange(e.target.value)}
              placeholder="Ex.: 123, S/N"
              maxLength={255}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Complemento (opcional)</span>
            <Input
              value={complement}
              onChange={(e) => onComplementChange(e.target.value)}
              placeholder="Ex.: Apto 42, Bloco B"
              maxLength={255}
            />
          </div>
        </>
      )}
      {!editing && number && (
        <ProfileField
          label="Número"
          value={number}
          icon={MapPin}
          editing={false}
          editValue={number}
          onEditChange={() => undefined}
        />
      )}
      {!editing && complement && (
        <ProfileField
          label="Complemento"
          value={complement}
          icon={MapPin}
          editing={false}
          editValue={complement}
          onEditChange={() => undefined}
        />
      )}
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
  const [number, setNumber] = useState("")
  const [complement, setComplement] = useState("")
  const [adressType, setAdressType] = useState<UserAddressType>("PRINCIPAL")

  async function handleSave() {
    if (!cepId) {
      toast.error("Selecione o CEP.")
      return
    }
    if (!number.trim()) {
      toast.error("Informe o número do endereço.")
      return
    }

    try {
      const payload: {
        cepId: string
        number: string
        complement?: string
        adressType: UserAddressType
      } = { cepId, number: number.trim(), adressType }
      if (complement.trim()) payload.complement = complement.trim()

      await createMutation.mutateAsync(payload)
      onSaved()
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <div className="space-y-4 border border-dashed border-border/80 bg-muted/10 p-4">
      <p className="text-sm font-semibold text-foreground">Novo endereço</p>
      <UserAddressFormFields
        editing
        countryId={countryId}
        stateId={stateId}
        cityId={cityId}
        cepId={cepId}
        number={number}
        complement={complement}
        adressType={adressType}
        displayCountry={null}
        displayState={null}
        displayCity={null}
        displayCep={null}
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
        onNumberChange={setNumber}
        onComplementChange={setComplement}
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
