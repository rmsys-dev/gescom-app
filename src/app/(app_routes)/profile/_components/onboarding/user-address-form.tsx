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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { HttpError } from "@/lib/api/http-error"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import type { Cep } from "@/modules/addresses/addresses.schema"
import {
  useCepsQuery,
  useCitiesQuery,
  useCountriesQuery,
  useStatesQuery,
} from "@/modules/addresses/use-address-catalog"
import { USER_ADDRESS_TYPE_OPTIONS } from "@/modules/users-onboarding/users-onboarding-labels"
import type {
  UserAddress,
  UserAddressType,
} from "@/modules/users-onboarding/users-onboarding.schema"
import {
  useCreateUserAddressMutation,
  usePatchUserAddressMutation,
} from "@/modules/users-onboarding/use-users-onboarding"

function formatCepMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

type UserAddressFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  userId: string
  memberId?: string
  mode: "create" | "edit"
  editing?: UserAddress | null
}

export function UserAddressForm({
  open,
  onOpenChange,
  enterpriseId,
  userId,
  memberId,
  mode,
  editing = null,
}: UserAddressFormProps) {
  const [session, setSession] = useState(0)
  const [prevOpen, setPrevOpen] = useState(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setSession((s) => s + 1)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        {open ? (
          <UserAddressFormContent
            key={`${mode}-${editing?.id ?? "create"}-${session}`}
            enterpriseId={enterpriseId}
            userId={userId}
            memberId={memberId}
            mode={mode}
            editing={editing}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function UserAddressFormContent({
  enterpriseId,
  userId,
  memberId,
  mode,
  editing,
  onOpenChange,
}: {
  enterpriseId: string
  userId: string
  memberId?: string
  mode: "create" | "edit"
  editing: UserAddress | null
  onOpenChange: (open: boolean) => void
}) {
  const createMutation = useCreateUserAddressMutation(
    enterpriseId,
    userId,
    memberId
  )
  const patchMutation = usePatchUserAddressMutation(
    enterpriseId,
    userId,
    memberId
  )

  const [countryId, setCountryId] = useState(editing?.countryId ?? "")
  const [stateId, setStateId] = useState(editing?.stateId ?? "")
  const [cityId, setCityId] = useState(editing?.cityId ?? "")
  const [cepId, setCepId] = useState(editing?.cepId ?? "")
  const [adressType, setAdressType] = useState<UserAddressType>(
    editing?.adressType ?? "PRINCIPAL"
  )

  const countriesQuery = useCountriesQuery(true)
  const statesQuery = useStatesQuery(countryId || undefined, true)
  const citiesQuery = useCitiesQuery(stateId || undefined, true)
  const cepsQuery = useCepsQuery(cityId || undefined, undefined)

  const selectedCep: Cep | undefined = useMemo(() => {
    const items = cepsQuery.data ?? []
    return items.find((c) => c.id === cepId)
  }, [cepsQuery.data, cepId])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!countryId || !stateId || !cityId || !cepId) {
      toast.error("Preencha país, estado, cidade e CEP.")
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
        await patchMutation.mutateAsync({
          addressId: editing.id,
          input: { countryId, stateId, cityId, cepId, adressType },
        })
      }
      onOpenChange(false)
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(
          error,
          mode === "create"
            ? "Não foi possível adicionar o endereço."
            : "Não foi possível atualizar o endereço."
        )
        return
      }
      toast.error("Operação falhou.")
    }
  }

  const isPending = createMutation.isPending || patchMutation.isPending

  return (
    <>
      <SheetHeader>
        <SheetTitle>
          {mode === "create" ? "Novo endereço" : "Editar endereço"}
        </SheetTitle>
        <SheetDescription>
          Selecione país, estado, cidade e CEP do catálogo.
        </SheetDescription>
      </SheetHeader>
      <form onSubmit={handleSubmit} className="mt-6">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel>País</FieldLabel>
            <Select value={countryId} onValueChange={(v) => {
              setCountryId(v)
              setStateId("")
              setCityId("")
              setCepId("")
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o país..." />
              </SelectTrigger>
              <SelectContent>
                {(countriesQuery.data ?? []).map((c) => (
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
              onValueChange={(v) => {
                setStateId(v)
                setCityId("")
                setCepId("")
              }}
              disabled={!countryId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o estado..." />
              </SelectTrigger>
              <SelectContent>
                {(statesQuery.data ?? []).map((s) => (
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
              onValueChange={(v) => {
                setCityId(v)
                setCepId("")
              }}
              disabled={!stateId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a cidade..." />
              </SelectTrigger>
              <SelectContent>
                {(citiesQuery.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.citieName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>CEP / Logradouro</FieldLabel>
            <Select value={cepId} onValueChange={setCepId} disabled={!cityId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o CEP..." />
              </SelectTrigger>
              <SelectContent>
                {(cepsQuery.data ?? []).map((c) => (
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
              </p>
            </div>
          )}
          <Field>
            <FieldLabel>Tipo</FieldLabel>
            <Select
              value={adressType}
              onValueChange={(v) => setAdressType(v as UserAddressType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_ADDRESS_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "A guardar..." : "Guardar"}
          </Button>
        </FieldGroup>
      </form>
    </>
  )
}
