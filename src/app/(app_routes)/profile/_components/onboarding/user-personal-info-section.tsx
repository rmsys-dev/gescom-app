"use client"

import { useState } from "react"
import { Calendar, MapPin, User } from "lucide-react"
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
import {
  GENDER_OPTIONS,
  getGenderLabel,
} from "@/modules/users-onboarding/users-onboarding-labels"
import type {
  Gender,
  PersonalInfo,
} from "@/modules/users-onboarding/users-onboarding.schema"
import {
  appendOnboardingEnumField,
  appendOnboardingStringField,
  type OnboardingPatchBody,
} from "@/modules/users-onboarding/users-onboarding-patch"
import { useUpsertPersonalInfoMutation } from "@/modules/users-onboarding/use-users-onboarding"

export function UserPersonalInfoSection({
  enterpriseId,
  userId,
  memberId,
  personalInfo,
  canAlter,
}: {
  enterpriseId: string
  userId: string
  memberId?: string
  personalInfo: PersonalInfo | null
  canAlter: boolean
}) {
  const exists = personalInfo !== null
  const mutation = useUpsertPersonalInfoMutation(enterpriseId, userId, memberId)
  const [editing, setEditing] = useState(false)
  const [gender, setGender] = useState<Gender | "">(personalInfo?.gender ?? "")
  const [birthDate, setBirthDate] = useState(
    toDateInputValue(personalInfo?.birthDate ?? null)
  )
  const [placeOfBirth, setPlaceOfBirth] = useState(
    personalInfo?.placeOfBirth ?? ""
  )

  const resetDraft = () => {
    setGender(personalInfo?.gender ?? "")
    setBirthDate(toDateInputValue(personalInfo?.birthDate ?? null))
    setPlaceOfBirth(personalInfo?.placeOfBirth ?? "")
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

    appendOnboardingEnumField(body, "gender", gender, personalInfo?.gender, exists)
    appendOnboardingStringField(
      body,
      "birthDate",
      birthDate,
      toDateInputValue(personalInfo?.birthDate ?? null) || null,
      exists
    )
    appendOnboardingStringField(
      body,
      "placeOfBirth",
      placeOfBirth,
      personalInfo?.placeOfBirth,
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
          <User className="size-5 text-primary text-base" aria-hidden />
          Informações pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!exists && !editing ? (
          <UserOnboardingEmpty
            title="Sem informações pessoais cadastradas."
            description="Registre gênero, data de nascimento ou local de nascimento."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField
              label="Gênero"
              value={getGenderLabel(personalInfo?.gender ?? null)}
              icon={User}
              editing={editing}
              editValue={gender}
              onEditChange={(value) => setGender(value as Gender)}
              inputId="pi-gender"
              editSelectOptions={GENDER_OPTIONS}
              editPlaceholder="Selecione..."
            />
            <ProfileField
              label="Data de nascimento"
              value={formatDateOnly(personalInfo?.birthDate ?? null)}
              icon={Calendar}
              editing={editing}
              editValue={birthDate}
              onEditChange={setBirthDate}
              inputId="pi-birthDate"
              inputType="date"
            />
            <ProfileField
              label="Local de nascimento"
              value={personalInfo?.placeOfBirth}
              icon={MapPin}
              className="sm:col-span-2"
              editing={editing}
              editValue={placeOfBirth}
              onEditChange={setPlaceOfBirth}
              inputId="pi-placeOfBirth"
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
