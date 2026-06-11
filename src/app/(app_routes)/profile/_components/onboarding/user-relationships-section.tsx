"use client"

import { useState } from "react"
import { Briefcase, Heart, Home, User, Users } from "lucide-react"
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
import { HttpError } from "@/lib/api/http-error"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import {
  getHousingTypeLabel,
  getMaritalStatusLabel,
  HOUSING_TYPE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from "@/modules/users-onboarding/users-onboarding-labels"
import type {
  HousingType,
  MaritalStatus,
  Relationships,
} from "@/modules/users-onboarding/users-onboarding.schema"
import {
  appendOnboardingBoolSelectField,
  appendOnboardingEnumField,
  appendOnboardingNumberField,
  appendOnboardingStringField,
  type OnboardingPatchBody,
} from "@/modules/users-onboarding/users-onboarding-patch"
import { useUpsertRelationshipsMutation } from "@/modules/users-onboarding/use-users-onboarding"

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

export function UserRelationshipsSection({
  enterpriseId,
  userId,
  memberId,
  relationships,
  canAlter,
}: {
  enterpriseId: string
  userId: string
  memberId?: string
  relationships: Relationships | null
  canAlter: boolean
}) {
  const exists = relationships !== null
  const mutation = useUpsertRelationshipsMutation(enterpriseId, userId, memberId)
  const [editing, setEditing] = useState(false)

  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | "">(
    relationships?.maritalStatus ?? ""
  )
  const [spouseName, setSpouseName] = useState(relationships?.spouseName ?? "")
  const [housingType, setHousingType] = useState<HousingType | "">(
    relationships?.housingType ?? ""
  )
  const [rentalPeriod, setRentalPeriod] = useState(
    relationships?.rentalPeriod != null ? String(relationships.rentalPeriod) : ""
  )
  const [motherName, setMotherName] = useState(relationships?.motherName ?? "")
  const [fatherName, setFatherName] = useState(relationships?.fatherName ?? "")
  const [profession, setProfession] = useState(relationships?.profession ?? "")
  const [professionDescription, setProfessionDescription] = useState(
    relationships?.professionDescription ?? ""
  )
  const [professionTime, setProfessionTime] = useState(
    relationships?.professionTime != null
      ? String(relationships.professionTime)
      : ""
  )
  const [income, setIncome] = useState(
    relationships?.income != null ? String(relationships.income) : ""
  )
  const [linkWithSeller, setLinkWithSeller] = useState(
    boolToSelect(relationships?.linkWithSeller)
  )
  const [toWarmUp, setToWarmUp] = useState(boolToSelect(relationships?.toWarmUp))

  const resetDraft = () => {
    setMaritalStatus(relationships?.maritalStatus ?? "")
    setSpouseName(relationships?.spouseName ?? "")
    setHousingType(relationships?.housingType ?? "")
    setRentalPeriod(
      relationships?.rentalPeriod != null ? String(relationships.rentalPeriod) : ""
    )
    setMotherName(relationships?.motherName ?? "")
    setFatherName(relationships?.fatherName ?? "")
    setProfession(relationships?.profession ?? "")
    setProfessionDescription(relationships?.professionDescription ?? "")
    setProfessionTime(
      relationships?.professionTime != null ? String(relationships.professionTime) : ""
    )
    setIncome(relationships?.income != null ? String(relationships.income) : "")
    setLinkWithSeller(boolToSelect(relationships?.linkWithSeller))
    setToWarmUp(boolToSelect(relationships?.toWarmUp))
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

    appendOnboardingEnumField(
      body,
      "maritalStatus",
      maritalStatus,
      relationships?.maritalStatus,
      exists
    )
    appendOnboardingStringField(
      body,
      "spouseName",
      spouseName,
      relationships?.spouseName,
      exists
    )
    appendOnboardingEnumField(
      body,
      "housingType",
      housingType,
      relationships?.housingType,
      exists
    )
    appendOnboardingNumberField(
      body,
      "rentalPeriod",
      rentalPeriod,
      relationships?.rentalPeriod,
      exists
    )
    appendOnboardingStringField(
      body,
      "motherName",
      motherName,
      relationships?.motherName,
      exists
    )
    appendOnboardingStringField(
      body,
      "fatherName",
      fatherName,
      relationships?.fatherName,
      exists
    )
    appendOnboardingStringField(
      body,
      "profession",
      profession,
      relationships?.profession,
      exists
    )
    appendOnboardingStringField(
      body,
      "professionDescription",
      professionDescription,
      relationships?.professionDescription,
      exists
    )
    appendOnboardingNumberField(
      body,
      "professionTime",
      professionTime,
      relationships?.professionTime,
      exists
    )
    appendOnboardingNumberField(body, "income", income, relationships?.income, exists)
    appendOnboardingBoolSelectField(
      body,
      "linkWithSeller",
      linkWithSeller,
      relationships?.linkWithSeller,
      exists
    )
    appendOnboardingBoolSelectField(
      body,
      "toWarmUp",
      toWarmUp,
      relationships?.toWarmUp,
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
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível guardar.")
        return
      }
      toast.error("Não foi possível guardar.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5 text-primary text-base" aria-hidden />
          Relacionamentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!exists && !editing ? (
          <UserOnboardingEmpty
            title="Sem relacionamentos cadastrados."
            description="Registe estado civil, moradia, filiação ou profissão."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField
              label="Estado civil"
              value={getMaritalStatusLabel(relationships?.maritalStatus ?? null)}
              icon={Heart}
              editing={editing}
              editValue={maritalStatus}
              onEditChange={(value) => setMaritalStatus(value as MaritalStatus)}
              editSelectOptions={MARITAL_STATUS_OPTIONS}
            />
            <ProfileField
              label="Cônjuge"
              value={relationships?.spouseName}
              icon={User}
              editing={editing}
              editValue={spouseName}
              onEditChange={setSpouseName}
            />
            <ProfileField
              label="Tipo de moradia"
              value={getHousingTypeLabel(relationships?.housingType ?? null)}
              icon={Home}
              editing={editing}
              editValue={housingType}
              onEditChange={(value) => setHousingType(value as HousingType)}
              editSelectOptions={HOUSING_TYPE_OPTIONS}
            />
            <ProfileField
              label="Período de aluguer (meses)"
              value={
                relationships?.rentalPeriod != null
                  ? String(relationships.rentalPeriod)
                  : null
              }
              icon={Home}
              editing={editing}
              editValue={rentalPeriod}
              onEditChange={setRentalPeriod}
              inputType="number"
            />
            <ProfileField
              label="Mãe"
              value={relationships?.motherName}
              icon={User}
              editing={editing}
              editValue={motherName}
              onEditChange={setMotherName}
            />
            <ProfileField
              label="Pai"
              value={relationships?.fatherName}
              icon={User}
              editing={editing}
              editValue={fatherName}
              onEditChange={setFatherName}
            />
            <ProfileField
              label="Profissão"
              value={relationships?.profession}
              icon={Briefcase}
              editing={editing}
              editValue={profession}
              onEditChange={setProfession}
            />
            <ProfileField
              label="Descrição da profissão"
              value={relationships?.professionDescription}
              icon={Briefcase}
              editing={editing}
              editValue={professionDescription}
              onEditChange={setProfessionDescription}
            />
            <ProfileField
              label="Tempo na profissão (meses)"
              value={
                relationships?.professionTime != null
                  ? String(relationships.professionTime)
                  : null
              }
              icon={Briefcase}
              editing={editing}
              editValue={professionTime}
              onEditChange={setProfessionTime}
              inputType="number"
            />
            <ProfileField
              label="Rendimento"
              value={
                relationships?.income != null ? String(relationships.income) : null
              }
              icon={Briefcase}
              editing={editing}
              editValue={income}
              onEditChange={setIncome}
              inputType="number"
            />
            <ProfileField
              label="Ligação com vendedor"
              value={boolLabel(relationships?.linkWithSeller)}
              icon={User}
              editing={editing}
              editValue={linkWithSeller}
              onEditChange={setLinkWithSeller}
              editSelectOptions={BOOL_OPTIONS}
              editPlaceholder="—"
            />
            <ProfileField
              label="Enviar avisos"
              value={boolLabel(relationships?.toWarmUp)}
              icon={User}
              editing={editing}
              editValue={toWarmUp}
              onEditChange={setToWarmUp}
              editSelectOptions={BOOL_OPTIONS}
              editPlaceholder="—"
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
