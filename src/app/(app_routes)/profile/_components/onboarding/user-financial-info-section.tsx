"use client"

import { useState } from "react"
import { Banknote, Percent } from "lucide-react"
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
import {
  CREDIT_TYPE_OPTIONS,
  getCreditTypeLabel,
} from "@/modules/users-onboarding/users-onboarding-labels"
import type {
  CreditType,
  FinancialInfo,
} from "@/modules/users-onboarding/users-onboarding.schema"
import {
  appendOnboardingBoolSelectField,
  appendOnboardingEnumField,
  appendOnboardingNumberField,
  appendOnboardingStringField,
  type OnboardingPatchBody,
} from "@/modules/users-onboarding/users-onboarding-patch"
import { useUpsertFinancialInfoMutation } from "@/modules/users-onboarding/use-users-onboarding"

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

function numLabel(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—"
  return String(v)
}

function numToInput(v: number | null | undefined): string {
  if (v === null || v === undefined) return ""
  return String(v)
}

export function UserFinancialInfoSection({
  enterpriseId,
  userId,
  memberId,
  financialInfo,
  canAlter,
}: {
  enterpriseId: string
  userId: string
  memberId?: string
  financialInfo: FinancialInfo | null
  canAlter: boolean
}) {
  const exists = financialInfo !== null
  const mutation = useUpsertFinancialInfoMutation(enterpriseId, userId, memberId)
  const [editing, setEditing] = useState(false)

  const [icmsReduction, setIcmsReduction] = useState(
    numToInput(financialInfo?.ICMSReduction)
  )
  const [discountLimit, setDiscountLimit] = useState(
    numToInput(financialInfo?.discountLimit)
  )
  const [discoutArrangement, setDiscoutArrangement] = useState(
    financialInfo?.discoutArrangement ?? ""
  )
  const [creditType, setCreditType] = useState<CreditType | "">(
    financialInfo?.creditType ?? ""
  )
  const [requestAmount, setRequestAmount] = useState(
    numToInput(financialInfo?.requestAmount)
  )
  const [budgetPrice, setBudgetPrice] = useState(
    numToInput(financialInfo?.budgetPrice)
  )
  const [taxRegime, setTaxRegime] = useState(financialInfo?.taxRegime ?? "")
  const [purchaseOrder, setPurchaseOrder] = useState(
    boolToSelect(financialInfo?.purchaseOrder)
  )
  const [prevRate, setPrevRate] = useState(numToInput(financialInfo?.prevRate))
  const [ratTax, setRatTax] = useState(numToInput(financialInfo?.ratTax))
  const [reductionRate, setReductionRate] = useState(
    numToInput(financialInfo?.reductionRate)
  )
  const [senarTax, setSenarTax] = useState(numToInput(financialInfo?.senarTax))
  const [low, setLow] = useState(boolToSelect(financialInfo?.low))
  const [saleDiscount, setSaleDiscount] = useState(
    numToInput(financialInfo?.sale_discount)
  )
  const [doSt, setDoSt] = useState(boolToSelect(financialInfo?.doSt))
  const [sendNF, setSendNF] = useState(boolToSelect(financialInfo?.sendNF))

  const resetDraft = () => {
    setIcmsReduction(numToInput(financialInfo?.ICMSReduction))
    setDiscountLimit(numToInput(financialInfo?.discountLimit))
    setDiscoutArrangement(financialInfo?.discoutArrangement ?? "")
    setCreditType(financialInfo?.creditType ?? "")
    setRequestAmount(numToInput(financialInfo?.requestAmount))
    setBudgetPrice(numToInput(financialInfo?.budgetPrice))
    setTaxRegime(financialInfo?.taxRegime ?? "")
    setPurchaseOrder(boolToSelect(financialInfo?.purchaseOrder))
    setPrevRate(numToInput(financialInfo?.prevRate))
    setRatTax(numToInput(financialInfo?.ratTax))
    setReductionRate(numToInput(financialInfo?.reductionRate))
    setSenarTax(numToInput(financialInfo?.senarTax))
    setLow(boolToSelect(financialInfo?.low))
    setSaleDiscount(numToInput(financialInfo?.sale_discount))
    setDoSt(boolToSelect(financialInfo?.doSt))
    setSendNF(boolToSelect(financialInfo?.sendNF))
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

    appendOnboardingNumberField(
      body,
      "ICMSReduction",
      icmsReduction,
      financialInfo?.ICMSReduction,
      exists
    )
    appendOnboardingNumberField(
      body,
      "discountLimit",
      discountLimit,
      financialInfo?.discountLimit,
      exists
    )
    appendOnboardingStringField(
      body,
      "discoutArrangement",
      discoutArrangement,
      financialInfo?.discoutArrangement,
      exists
    )
    appendOnboardingEnumField(
      body,
      "creditType",
      creditType,
      financialInfo?.creditType,
      exists
    )
    appendOnboardingNumberField(
      body,
      "requestAmount",
      requestAmount,
      financialInfo?.requestAmount,
      exists
    )
    appendOnboardingNumberField(
      body,
      "budgetPrice",
      budgetPrice,
      financialInfo?.budgetPrice,
      exists
    )
    appendOnboardingStringField(
      body,
      "taxRegime",
      taxRegime,
      financialInfo?.taxRegime,
      exists
    )
    appendOnboardingBoolSelectField(
      body,
      "purchaseOrder",
      purchaseOrder,
      financialInfo?.purchaseOrder,
      exists
    )
    appendOnboardingNumberField(body, "prevRate", prevRate, financialInfo?.prevRate, exists)
    appendOnboardingNumberField(body, "ratTax", ratTax, financialInfo?.ratTax, exists)
    appendOnboardingNumberField(
      body,
      "reductionRate",
      reductionRate,
      financialInfo?.reductionRate,
      exists
    )
    appendOnboardingNumberField(body, "senarTax", senarTax, financialInfo?.senarTax, exists)
    appendOnboardingBoolSelectField(body, "low", low, financialInfo?.low, exists)
    appendOnboardingNumberField(
      body,
      "sale_discount",
      saleDiscount,
      financialInfo?.sale_discount,
      exists
    )
    appendOnboardingBoolSelectField(body, "doSt", doSt, financialInfo?.doSt, exists)
    appendOnboardingBoolSelectField(body, "sendNF", sendNF, financialInfo?.sendNF, exists)

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
          <Banknote className="size-5 text-primary text-base" aria-hidden />
          Informações financeiras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!exists && !editing ? (
          <UserOnboardingEmpty
            title="Sem informações financeiras cadastradas."
            description="Registe limites de desconto, ICMS ou condições de crédito."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField
              label="Redução ICMS (%)"
              value={numLabel(financialInfo?.ICMSReduction)}
              icon={Percent}
              editing={editing}
              editValue={icmsReduction}
              onEditChange={setIcmsReduction}
              inputType="number"
            />
            <ProfileField
              label="Limite de desconto (%)"
              value={numLabel(financialInfo?.discountLimit)}
              icon={Percent}
              editing={editing}
              editValue={discountLimit}
              onEditChange={setDiscountLimit}
              inputType="number"
            />
            <ProfileField
              label="Acordo de desconto"
              value={financialInfo?.discoutArrangement}
              icon={Banknote}
              editing={editing}
              editValue={discoutArrangement}
              onEditChange={setDiscoutArrangement}
            />
            <ProfileField
              label="Tipo de crédito"
              value={getCreditTypeLabel(financialInfo?.creditType ?? null)}
              icon={Banknote}
              editing={editing}
              editValue={creditType}
              onEditChange={(value) => setCreditType(value as CreditType)}
              editSelectOptions={CREDIT_TYPE_OPTIONS}
            />
            <ProfileField
              label="Valor solicitado"
              value={numLabel(financialInfo?.requestAmount)}
              icon={Banknote}
              editing={editing}
              editValue={requestAmount}
              onEditChange={setRequestAmount}
              inputType="number"
            />
            <ProfileField
              label="Preço orçamento"
              value={numLabel(financialInfo?.budgetPrice)}
              icon={Banknote}
              editing={editing}
              editValue={budgetPrice}
              onEditChange={setBudgetPrice}
              inputType="number"
            />
            <ProfileField
              label="Regime fiscal"
              value={financialInfo?.taxRegime}
              icon={Banknote}
              editing={editing}
              editValue={taxRegime}
              onEditChange={setTaxRegime}
            />
            <ProfileField
              label="Ordem de compra"
              value={boolLabel(financialInfo?.purchaseOrder)}
              icon={Banknote}
              editing={editing}
              editValue={purchaseOrder}
              onEditChange={setPurchaseOrder}
              editSelectOptions={BOOL_OPTIONS}
              editPlaceholder="—"
            />
            <ProfileField
              label="Taxa prev. (%)"
              value={numLabel(financialInfo?.prevRate)}
              icon={Percent}
              editing={editing}
              editValue={prevRate}
              onEditChange={setPrevRate}
              inputType="number"
            />
            <ProfileField
              label="Taxa RAT (%)"
              value={numLabel(financialInfo?.ratTax)}
              icon={Percent}
              editing={editing}
              editValue={ratTax}
              onEditChange={setRatTax}
              inputType="number"
            />
            <ProfileField
              label="Taxa redução (%)"
              value={numLabel(financialInfo?.reductionRate)}
              icon={Percent}
              editing={editing}
              editValue={reductionRate}
              onEditChange={setReductionRate}
              inputType="number"
            />
            <ProfileField
              label="Taxa SENAR (%)"
              value={numLabel(financialInfo?.senarTax)}
              icon={Percent}
              editing={editing}
              editValue={senarTax}
              onEditChange={setSenarTax}
              inputType="number"
            />
            <ProfileField
              label="Low"
              value={boolLabel(financialInfo?.low)}
              icon={Banknote}
              editing={editing}
              editValue={low}
              onEditChange={setLow}
              editSelectOptions={BOOL_OPTIONS}
              editPlaceholder="—"
            />
            <ProfileField
              label="Desconto venda (%)"
              value={numLabel(financialInfo?.sale_discount)}
              icon={Percent}
              editing={editing}
              editValue={saleDiscount}
              onEditChange={setSaleDiscount}
              inputType="number"
            />
            <ProfileField
              label="Do ST"
              value={boolLabel(financialInfo?.doSt)}
              icon={Banknote}
              editing={editing}
              editValue={doSt}
              onEditChange={setDoSt}
              editSelectOptions={BOOL_OPTIONS}
              editPlaceholder="—"
            />
            <ProfileField
              label="Enviar NF"
              value={boolLabel(financialInfo?.sendNF)}
              icon={Banknote}
              editing={editing}
              editValue={sendNF}
              onEditChange={setSendNF}
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
