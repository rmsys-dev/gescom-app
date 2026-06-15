"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Cep } from "@/modules/addresses/addresses.schema"
import {
  useCepsQuery,
  useCitiesQuery,
  useCountriesQuery,
  useStatesQuery,
} from "@/modules/addresses/use-address-catalog"
import { ENTERPRISE_ADDRESS_TYPE_OPTIONS } from "@/modules/enterprises/enterprise-address-type-label"
import {
  ENTERPRISE_PRINCIPAL_ADDRESS_EXISTS_MESSAGE,
  findPrincipalEnterpriseAddress,
  hasConflictingPrincipalEnterpriseAddress,
} from "@/modules/enterprises/enterprise-address-rules"
import type { EnterpriseAddressType } from "@/modules/enterprises/enterprise-addresses.schema"
import type { EnterpriseAddress } from "@/modules/enterprises/enterprises.schema"
import type { PatchEnterpriseAddressRequest } from "@/modules/enterprises/enterprise-addresses.schema"
import {
  useCreateEnterpriseAddressMutation,
  usePatchEnterpriseAddressMutation,
} from "@/modules/enterprises/use-enterprise-addresses"

function formatCepMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

type EnterpriseAddressFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  mode: "create" | "edit"
  editing?: EnterpriseAddress | null
  addresses?: EnterpriseAddress[]
}

type AddressFormState = {
  countryId: string
  stateId: string
  cityId: string
  cepId: string
  adressType: EnterpriseAddressType
}

function getInitialAddressFormState(
  mode: "create" | "edit",
  editing: EnterpriseAddress | null,
  addresses: EnterpriseAddress[]
): AddressFormState {
  if (mode === "edit" && editing) {
    return {
      countryId: editing.countryId,
      stateId: editing.stateId,
      cityId: editing.cityId,
      cepId: editing.cepId,
      adressType: editing.adressType as EnterpriseAddressType,
    }
  }

  const defaultType = findPrincipalEnterpriseAddress(addresses)
    ? "SECUNDARIO"
    : "PRINCIPAL"

  return {
    countryId: "",
    stateId: "",
    cityId: "",
    cepId: "",
    adressType: defaultType,
  }
}

function getFormContentKey(
  mode: "create" | "edit",
  editing: EnterpriseAddress | null,
  session: number
) {
  const base = mode === "edit" && editing ? `edit-${editing.id}` : "create"
  return `${base}-${session}`
}

export function EnterpriseAddressForm({
  open,
  onOpenChange,
  enterpriseId,
  mode,
  editing = null,
  addresses = [],
}: EnterpriseAddressFormProps) {
  const [prevOpen, setPrevOpen] = useState(open)
  const [session, setSession] = useState(0)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setSession((current) => current + 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,40rem)] overflow-y-auto sm:max-w-md">
        {open ? (
          <EnterpriseAddressFormContent
            key={getFormContentKey(mode, editing, session)}
            enterpriseId={enterpriseId}
            mode={mode}
            editing={editing}
            addresses={addresses}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

type EnterpriseAddressFormContentProps = {
  enterpriseId: string
  mode: "create" | "edit"
  editing: EnterpriseAddress | null
  addresses: EnterpriseAddress[]
  onOpenChange: (open: boolean) => void
}

function EnterpriseAddressFormContent({
  enterpriseId,
  mode,
  editing,
  addresses,
  onOpenChange,
}: EnterpriseAddressFormContentProps) {
  const initial = getInitialAddressFormState(mode, editing, addresses)
  const createMutation = useCreateEnterpriseAddressMutation(enterpriseId)
  const patchMutation = usePatchEnterpriseAddressMutation(enterpriseId)

  const [countryId, setCountryId] = useState(initial.countryId)
  const [stateId, setStateId] = useState(initial.stateId)
  const [cityId, setCityId] = useState(initial.cityId)
  const [cepId, setCepId] = useState(initial.cepId)
  const [adressType, setAdressType] = useState(initial.adressType)
  const [cepSearch, setCepSearch] = useState("")

  const countriesQuery = useCountriesQuery(true)
  const statesQuery = useStatesQuery(countryId || undefined, true)
  const citiesQuery = useCitiesQuery(stateId || undefined, true)
  const cepsQuery = useCepsQuery(cityId || undefined, cepSearch)

  const selectedCep: Cep | undefined = useMemo(() => {
    const items = cepsQuery.data ?? []
    return items.find((c) => c.id === cepId)
  }, [cepsQuery.data, cepId])

  const addressTypeOptions = useMemo(() => {
    const principal = findPrincipalEnterpriseAddress(addresses)
    const canSelectPrincipal =
      !principal || (mode === "edit" && editing?.id === principal.id)

    if (canSelectPrincipal) return ENTERPRISE_ADDRESS_TYPE_OPTIONS

    return ENTERPRISE_ADDRESS_TYPE_OPTIONS.filter(
      (option) => option.value !== "PRINCIPAL"
    )
  }, [addresses, mode, editing?.id])

  function handleCountryChange(value: string) {
    setCountryId(value)
    setStateId("")
    setCityId("")
    setCepId("")
  }

  function handleStateChange(value: string) {
    setStateId(value)
    setCityId("")
    setCepId("")
  }

  function handleCityChange(value: string) {
    setCityId(value)
    setCepId("")
    setCepSearch("")
  }

  function buildPatchInput(): PatchEnterpriseAddressRequest | null {
    if (!editing) return null

    const input: PatchEnterpriseAddressRequest = {}
    const geoChanged =
      countryId !== editing.countryId ||
      stateId !== editing.stateId ||
      cityId !== editing.cityId ||
      cepId !== editing.cepId

    if (geoChanged) {
      input.countryId = countryId
      input.stateId = stateId
      input.cityId = cityId
      input.cepId = cepId
    }

    if (adressType !== editing.adressType) {
      input.adressType = adressType
    }

    return Object.keys(input).length > 0 ? input : null
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!countryId || !stateId || !cityId || !cepId) {
      toast.error("Preencha país, estado, cidade e CEP.")
      return
    }

    if (
      hasConflictingPrincipalEnterpriseAddress(
        addresses,
        adressType,
        editing?.id
      )
    ) {
      toast.error(ENTERPRISE_PRINCIPAL_ADDRESS_EXISTS_MESSAGE)
      return
    }

    try {
      if (mode === "create") {
        await createMutation.mutateAsync({
          countryId,
          stateId,
          cityId,
          cepId,
          adressType,
        })
      } else if (editing) {
        const input = buildPatchInput()
        if (!input) {
          toast.message("Nenhuma alteração detectada.")
          return
        }
        await patchMutation.mutateAsync({
          addressId: editing.id,
          input,
        })
      }
      onOpenChange(false)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  const isPending = createMutation.isPending || patchMutation.isPending
  const countries = countriesQuery.data ?? []
  const states = statesQuery.data ?? []
  const cities = citiesQuery.data ?? []
  const ceps = cepsQuery.data ?? []

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "Novo endereço" : "Editar endereço"}
        </DialogTitle>
        <DialogDescription>
          Selecione país, estado, cidade e CEP do catálogo.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="mt-6">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel>País</FieldLabel>
            <Select
              value={countryId}
              onValueChange={handleCountryChange}
              disabled={countriesQuery.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o país..." />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.countryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Estado</FieldLabel>
            <Select
              value={stateId}
              onValueChange={handleStateChange}
              disabled={!countryId || statesQuery.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    countryId ? "Selecione o estado..." : "Escolha o país primeiro"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.acronym} — {s.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Cidade</FieldLabel>
            <Select
              value={cityId}
              onValueChange={handleCityChange}
              disabled={!stateId || citiesQuery.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    stateId ? "Selecione a cidade..." : "Escolha o estado primeiro"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.citieName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>CEP / Logradouro</FieldLabel>
            <Select
              value={cepId}
              onValueChange={setCepId}
              disabled={!cityId || cepsQuery.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    cityId ? "Selecione o CEP..." : "Escolha a cidade primeiro"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {ceps.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {formatCepMask(c.cepNumber)} — {c.address}, {c.neighborhood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {selectedCep && (
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Logradouro:</span>{" "}
                {selectedCep.address}
                {selectedCep.number ? `, ${selectedCep.number}` : ""}
              </p>
              <p>
                <span className="font-medium text-foreground">Bairro:</span>{" "}
                {selectedCep.neighborhood}
              </p>
              {selectedCep.complement && (
                <p>
                  <span className="font-medium text-foreground">Complemento:</span>{" "}
                  {selectedCep.complement}
                </p>
              )}
            </div>
          )}

          <Field>
            <FieldLabel>Tipo de endereço</FieldLabel>
            <Select
              value={adressType}
              onValueChange={(v) => setAdressType(v as EnterpriseAddressType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                {addressTypeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Button type="submit" disabled={isPending} tooltip="Salvar">
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </FieldGroup>
      </form>
    </>
  )
}
