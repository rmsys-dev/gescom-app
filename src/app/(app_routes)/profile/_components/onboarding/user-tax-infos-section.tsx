"use client"

import { useState } from "react"
import { Building2, Calendar, FileText } from "lucide-react"
import { toast } from "sonner"

import {
  ProfileEditActions,
  ProfileField,
} from "@/app/(app_routes)/profile/_components/profile-field"
import { UserOnboardingEmpty } from "@/app/(app_routes)/profile/_components/onboarding/user-onboarding-empty"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDateOnly, toDateInputValue } from "@/lib/formatters"
import type { TaxInfos } from "@/modules/users-onboarding/users-onboarding.schema"
import {
  appendOnboardingBoolSelectField,
  appendOnboardingNumberField,
  appendOnboardingStringField,
  type OnboardingPatchBody,
} from "@/modules/users-onboarding/users-onboarding-patch"
import { useUpsertTaxInfosMutation } from "@/modules/users-onboarding/use-users-onboarding"

const BOOL_OPTIONS = [
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
]

function boolLabel(v: boolean | null | undefined): string {
  if (v === null || v === undefined) return "—"
  return v ? "Sim" : "Não"
}

function boolToSelect(v: boolean | null | undefined): string {
  if (v === true) return "true"
  if (v === false) return "false"
  return ""
}

export function UserTaxInfosSection({
  enterpriseId,
  userId,
  memberId,
  taxInfos,
  canAlter,
}: {
  enterpriseId: string
  userId: string
  memberId?: string
  taxInfos: TaxInfos | null
  canAlter: boolean
}) {
  const exists = taxInfos !== null
  const mutation = useUpsertTaxInfosMutation(enterpriseId, userId, memberId)
  const [editing, setEditing] = useState(false)

  const [renegotiation, setRenegotiation] = useState(
    boolToSelect(taxInfos?.renegotiation)
  )
  const [spcRegistration, setSpcRegistration] = useState(
    taxInfos?.spc_registration ?? ""
  )
  const [spcRegistryDate, setSpcRegistryDate] = useState(
    toDateInputValue(taxInfos?.spc_registry_date ?? null)
  )
  const [stateRegistration, setStateRegistration] = useState(
    taxInfos?.stateRegistration ?? ""
  )
  const [municipalRegistration, setMunicipalRegistration] = useState(
    taxInfos?.municipalRegistration ?? ""
  )
  const [suframaRegistration, setSuframaRegistration] = useState(
    taxInfos?.suframa_registration ?? ""
  )
  const [userLegalName, setUserLegalName] = useState(taxInfos?.userLegalName ?? "")
  const [r3Code, setR3Code] = useState(
    taxInfos?.r3_code != null ? String(taxInfos.r3_code) : ""
  )
  const [sefazDate, setSefazDate] = useState(
    toDateInputValue(taxInfos?.sefaz_Date ?? null)
  )
  const [governmentEntity, setGovernmentEntity] = useState(
    taxInfos?.governmentEntity ?? ""
  )
  const [benefitCode, setBenefitCode] = useState(taxInfos?.benefitCode ?? "")

  const resetDraft = () => {
    setRenegotiation(boolToSelect(taxInfos?.renegotiation))
    setSpcRegistration(taxInfos?.spc_registration ?? "")
    setSpcRegistryDate(toDateInputValue(taxInfos?.spc_registry_date ?? null))
    setStateRegistration(taxInfos?.stateRegistration ?? "")
    setMunicipalRegistration(taxInfos?.municipalRegistration ?? "")
    setSuframaRegistration(taxInfos?.suframa_registration ?? "")
    setUserLegalName(taxInfos?.userLegalName ?? "")
    setR3Code(taxInfos?.r3_code != null ? String(taxInfos.r3_code) : "")
    setSefazDate(toDateInputValue(taxInfos?.sefaz_Date ?? null))
    setGovernmentEntity(taxInfos?.governmentEntity ?? "")
    setBenefitCode(taxInfos?.benefitCode ?? "")
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
    const body: OnboardingPatchBody = {}

    appendOnboardingBoolSelectField(
      body,
      "renegotiation",
      renegotiation,
      taxInfos?.renegotiation,
      exists
    )
    appendOnboardingStringField(
      body,
      "spc_registration",
      spcRegistration,
      taxInfos?.spc_registration,
      exists
    )
    appendOnboardingStringField(
      body,
      "spc_registry_date",
      spcRegistryDate,
      toDateInputValue(taxInfos?.spc_registry_date ?? null) || null,
      exists
    )
    appendOnboardingStringField(
      body,
      "stateRegistration",
      stateRegistration,
      taxInfos?.stateRegistration,
      exists
    )
    appendOnboardingStringField(
      body,
      "municipalRegistration",
      municipalRegistration,
      taxInfos?.municipalRegistration,
      exists
    )
    appendOnboardingStringField(
      body,
      "suframa_registration",
      suframaRegistration,
      taxInfos?.suframa_registration,
      exists
    )
    appendOnboardingStringField(
      body,
      "userLegalName",
      userLegalName,
      taxInfos?.userLegalName,
      exists
    )
    appendOnboardingNumberField(body, "r3_code", r3Code, taxInfos?.r3_code, exists)
    appendOnboardingStringField(
      body,
      "sefaz_Date",
      sefazDate,
      toDateInputValue(taxInfos?.sefaz_Date ?? null) || null,
      exists
    )
    appendOnboardingStringField(
      body,
      "governmentEntity",
      governmentEntity,
      taxInfos?.governmentEntity,
      exists
    )
    appendOnboardingStringField(
      body,
      "benefitCode",
      benefitCode,
      taxInfos?.benefitCode,
      exists
    )

    if (Object.keys(body).length === 0) {
      if (exists) {
        setEditing(false)
        return
      }
      toast.message("Informe ao menos um campo.")
      return
    }

    try {
      await mutation.mutateAsync({ exists, input: body })
      setEditing(false)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5 text-primary text-base" aria-hidden />
          Informações fiscais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!exists && !editing ? (
          <UserOnboardingEmpty
            title="Sem informações fiscais cadastradas."
            description="Registe inscrições estaduais, municipais ou SPC."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField
              label="Renegociação"
              value={boolLabel(taxInfos?.renegotiation)}
              icon={FileText}
              editing={editing}
              editValue={renegotiation}
              onEditChange={setRenegotiation}
              editSelectOptions={BOOL_OPTIONS}
              editPlaceholder="—"
            />
            <ProfileField
              label="Registo SPC"
              value={taxInfos?.spc_registration}
              icon={FileText}
              editing={editing}
              editValue={spcRegistration}
              onEditChange={setSpcRegistration}
            />
            <ProfileField
              label="Data registo SPC"
              value={formatDateOnly(taxInfos?.spc_registry_date ?? null)}
              icon={Calendar}
              editing={editing}
              editValue={spcRegistryDate}
              onEditChange={setSpcRegistryDate}
              inputType="date"
            />
            <ProfileField
              label="Inscrição estadual"
              value={taxInfos?.stateRegistration}
              icon={Building2}
              editing={editing}
              editValue={stateRegistration}
              onEditChange={setStateRegistration}
            />
            <ProfileField
              label="Inscrição municipal"
              value={taxInfos?.municipalRegistration}
              icon={Building2}
              editing={editing}
              editValue={municipalRegistration}
              onEditChange={setMunicipalRegistration}
            />
            <ProfileField
              label="SUFRAMA"
              value={taxInfos?.suframa_registration}
              icon={Building2}
              editing={editing}
              editValue={suframaRegistration}
              onEditChange={setSuframaRegistration}
            />
            <ProfileField
              label="Razão social"
              value={taxInfos?.userLegalName}
              icon={Building2}
              className="sm:col-span-2"
              editing={editing}
              editValue={userLegalName}
              onEditChange={setUserLegalName}
            />
            <ProfileField
              label="Código R3"
              value={taxInfos?.r3_code != null ? String(taxInfos.r3_code) : null}
              icon={FileText}
              editing={editing}
              editValue={r3Code}
              onEditChange={setR3Code}
              inputType="number"
            />
            <ProfileField
              label="Data SEFAZ"
              value={formatDateOnly(taxInfos?.sefaz_Date ?? null)}
              icon={Calendar}
              editing={editing}
              editValue={sefazDate}
              onEditChange={setSefazDate}
              inputType="date"
            />
            <ProfileField
              label="Entidade governamental"
              value={taxInfos?.governmentEntity}
              icon={Building2}
              editing={editing}
              editValue={governmentEntity}
              onEditChange={setGovernmentEntity}
            />
            <ProfileField
              label="Código de benefício"
              value={taxInfos?.benefitCode}
              icon={FileText}
              editing={editing}
              editValue={benefitCode}
              onEditChange={setBenefitCode}
            />
          </div>
        )}

        {canAlter && (
          <ProfileEditActions
            editing={editing}
            canEdit
            onStartEdit={handleStartEdit}
            onCancel={handleCancel}
            onSave={() => void handleSave()}
            isPending={mutation.isPending}
            isEmpty={!exists}
          />
        )}
      </CardContent>
    </Card>
  )
}
