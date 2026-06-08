"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import {
  BadgeCheck,
  Building2,
  Calendar,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Store,
} from "lucide-react"
import { toast } from "sonner"

import {
  SectionToggle,
  SectionTogglePanel,
  type SectionToggleOption,
} from "@/components/global/section-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { HttpError } from "@/lib/api/http-error"
import { getUserInitials } from "@/lib/user-initials"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import { EnterpriseAddressList } from "@/app/(app_routes)/enterprise/_components/enterprise-address-list"
import { getEnterpriseStatusLabel } from "@/modules/enterprises/enterprise-status-label"
import type {
  Enterprise,
  EnterpriseDetail,
} from "@/modules/enterprises/enterprises.schema"
import { useUpdateEnterpriseMutation } from "@/modules/enterprises/use-enterprises"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"
import {
  formatCpfCnpj,
  formatDateOnly,
  formatPhone,
} from "@/lib/formatters"

type EnterpriseHeroProps = {
  enterprise: Pick<Enterprise, "tradeName" | "legalName"> | null
  children?: ReactNode
}

export function EnterpriseHero({
  enterprise,
  children,
}: EnterpriseHeroProps) {
  const hasContext = enterprise != null
  const displayName = enterprise?.tradeName?.trim() || "Empresa"
  const initials = getUserInitials(displayName)

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex justify-center">
          <Avatar
            size="default"
            className="size-24 ring-2 ring-background shadow-md after:border-0"
          >
            <AvatarFallback className="bg-primary/15 text-4xl font-semibold tracking-tight text-primary">
              {hasContext ? (
                initials
              ) : (
                <Building2 className="size-10" aria-hidden />
              )}
            </AvatarFallback>
          </Avatar>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

function formatValue(
  value: string | null | undefined | boolean
): string {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "boolean") return value ? "Sim" : "Não"
  return String(value)
}

export function EnterpriseField({
  label,
  value,
  icon: Icon,
  className,
  mono,
  editing = false,
  editValue,
  onEditChange,
  inputId,
  inputType = "text",
  required,
}: {
  label: string
  value: string | null | undefined | boolean
  icon: LucideIcon
  className?: string
  mono?: boolean
  editing?: boolean
  editValue?: string
  onEditChange?: (value: string) => void
  inputId?: string
  inputType?: React.HTMLInputTypeAttribute
  required?: boolean
}) {
  const display = formatValue(value)
  const empty = display === "—"

  return (
    <fieldset className={cn("min-w-0 space-y-2", className)}>
      <legend className="text-xs font-medium tracking-wide text-muted-foreground">
        {label}
      </legend>
      <div
        className={cn(
          "flex min-h-10 items-center gap-3 rounded-lg border border-border/60 bg-muted/25 px-3 py-2.5 transition-colors",
          !editing && empty && "text-muted-foreground"
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background/80 text-muted-foreground shadow-sm ring-1 ring-border/50">
          <Icon className="size-4" aria-hidden />
        </span>
        {editing && onEditChange ? (
          <Input
            id={inputId}
            type={inputType}
            value={editValue ?? ""}
            onChange={(e) => onEditChange(e.target.value)}
            required={required}
            className={cn(
              "min-w-0 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0",
              mono && "font-mono text-xs sm:text-sm"
            )}
          />
        ) : (
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm font-medium text-foreground",
              mono && "font-mono text-xs sm:text-sm",
              empty && "font-normal"
            )}
          >
            {display}
          </span>
        )}
      </div>
    </fieldset>
  )
}

function EnterpriseSectionEmpty({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center"
    >
      <Icon
        className="mb-3 size-10 text-muted-foreground/50"
        aria-hidden
      />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

type EnterpriseDetailSection = "cadastro" | "enderecos"

const DETAIL_SECTIONS: SectionToggleOption<EnterpriseDetailSection>[] = [
  { id: "cadastro", label: "Cadastro" },
  { id: "enderecos", label: "Endereços" },
]

function EnterpriseCadastroSection({
  enterprise,
  enterpriseId,
  canEdit,
  onUpdateSuccess,
}: {
  enterprise: EnterpriseDetail
  enterpriseId?: string
  canEdit?: boolean
  onUpdateSuccess?: () => void
}) {
  const [editing, setEditing] = useState(false)
  const mutation = useUpdateEnterpriseMutation(enterpriseId ?? "")
  const [tradeName, setTradeName] = useState(enterprise.tradeName)
  const [legalName, setLegalName] = useState(enterprise.legalName)
  const [registration, setRegistration] = useState(enterprise.registration)
  const [phone, setPhone] = useState(enterprise.phone ?? "")
  const [email, setEmail] = useState(enterprise.email ?? "")
  const [whatsapp, setWhatsapp] = useState(enterprise.whatsapp ?? "")

  const resetDraft = () => {
    setTradeName(enterprise.tradeName)
    setLegalName(enterprise.legalName)
    setRegistration(enterprise.registration)
    setPhone(enterprise.phone ?? "")
    setEmail(enterprise.email ?? "")
    setWhatsapp(enterprise.whatsapp ?? "")
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
    const patch: {
      registration?: string
      legalName?: string
      tradeName?: string
      phone?: string
      email?: string
      whatsapp?: string
    } = {}

    const nextTradeName = tradeName.trim()
    const nextLegalName = legalName.trim()
    const nextRegistration = normalizeRegistration(registration)
    const nextPhone = normalizePhone(phone)
    const nextEmail = normalizeEmail(email)
    const nextWhatsapp = normalizePhone(whatsapp)

    if (nextTradeName && nextTradeName !== enterprise.tradeName) {
      patch.tradeName = nextTradeName
    }
    if (nextLegalName && nextLegalName !== enterprise.legalName) {
      patch.legalName = nextLegalName
    }
    if (nextRegistration && nextRegistration !== enterprise.registration) {
      const regParsed = cpfCnpjSchema.safeParse(nextRegistration)
      if (!regParsed.success) {
        toast.error("CPF/CNPJ invalido.")
        return
      }
      patch.registration = regParsed.data
    }
    if (nextTradeName.length < 2 || nextLegalName.length < 2) {
      toast.error("Nome fantasia e razao social devem ter pelo menos 2 caracteres.")
      return
    }
    if (nextPhone && nextPhone !== (enterprise.phone ?? "")) {
      const phoneParsed = phoneE164Schema.safeParse(nextPhone)
      if (!phoneParsed.success) {
        toast.error("Telefone invalido. Use formato +5511999999999.")
        return
      }
      patch.phone = phoneParsed.data
    }
    if (nextEmail && nextEmail !== (enterprise.email ?? "")) {
      patch.email = nextEmail
    }
    if (nextWhatsapp && nextWhatsapp !== (enterprise.whatsapp ?? "")) {
      const whatsappParsed = phoneE164Schema.safeParse(nextWhatsapp)
      if (!whatsappParsed.success) {
        toast.error("WhatsApp invalido. Use formato +5511999999999.")
        return
      }
      patch.whatsapp = whatsappParsed.data
    }

    if (Object.keys(patch).length === 0) {
      toast.message("Nenhuma alteração detectada.")
      setEditing(false)
      return
    }

    try {
      await mutation.mutateAsync(patch)
      setEditing(false)
      onUpdateSuccess?.()
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível atualizar a empresa.")
        return
      }
      toast.error("Não foi possível atualizar a empresa.")
    }
  }

  const showEditControls = Boolean(canEdit && enterpriseId)

  return (
    <div className="space-y-4">


      <div className="grid gap-4 sm:grid-cols-2">
        <EnterpriseField
          label="Nome fantasia"
          value={enterprise.tradeName}
          icon={Store}
          editing={editing}
          editValue={tradeName}
          onEditChange={setTradeName}
          inputId="enterprise-tradeName"
          required
        />
        <EnterpriseField
          label="Razão social"
          value={enterprise.legalName}
          icon={Landmark}
          editing={editing}
          editValue={legalName}
          onEditChange={setLegalName}
          inputId="enterprise-legalName"
          required
        />
        <EnterpriseField
          label="CPF / CNPJ"
          value={formatCpfCnpj(enterprise.registration)}
          icon={BadgeCheck}
          mono
          editing={editing}
          editValue={registration}
          onEditChange={setRegistration}
          inputId="enterprise-registration"
        />
        <EnterpriseField
          label="E-mail"
          value={enterprise.email}
          icon={Mail}
          editing={editing}
          editValue={email}
          onEditChange={setEmail}
          inputId="enterprise-email"
          inputType="email"
        />
        <EnterpriseField
          label="Telefone"
          value={formatPhone(enterprise.phone)}
          icon={Phone}
          editing={editing}
          editValue={phone}
          onEditChange={setPhone}
          inputId="enterprise-phone"
        />
        <EnterpriseField
          label="WhatsApp"
          value={formatPhone(enterprise.whatsapp)}
          icon={MessageCircle}
          editing={editing}
          editValue={whatsapp}
          onEditChange={setWhatsapp}
          inputId="enterprise-whatsapp"
        />
        <EnterpriseField
          label="Registrado em"
          value={formatDateOnly(enterprise.registeredOn)}
          icon={Calendar}
        />
        <EnterpriseField
          label="Status"
          value={getEnterpriseStatusLabel(enterprise.status)}
          icon={BadgeCheck}
        />
      </div>

      {showEditControls && !editing && (
        <div className="flex w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleStartEdit}
            aria-label="Editar cadastro da empresa"
            tooltip="Editar cadastro"
            className="w-full"
          >
            <Pencil className="size-4" aria-hidden />
            Editar
          </Button>
        </div>
      )}

      {editing && (
        <div className="flex flex-wrap justify-end gap-2 border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={mutation.isPending}
            tooltip="Salvar alterações"
          >
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      )}
    </div>
  )
}

export function EnterpriseDetailFields({
  enterprise,
  className,
  enterpriseId,
  canEdit,
  onUpdateSuccess,
  canConsultAddresses,
  canIncludeAddresses,
  canAlterAddresses,
}: {
  enterprise: EnterpriseDetail
  className?: string
  enterpriseId?: string
  canEdit?: boolean
  onUpdateSuccess?: () => void
  canConsultAddresses?: boolean
  canIncludeAddresses?: boolean
  canAlterAddresses?: boolean
}) {
  const [section, setSection] = useState<EnterpriseDetailSection>("cadastro")

  return (
    <div className={cn("space-y-4", className)}>
      <SectionToggle
        value={section}
        onValueChange={setSection}
        options={DETAIL_SECTIONS}
        ariaLabel="Seções de dados da empresa"
        idPrefix="enterprise"
      />

      <SectionTogglePanel sectionId={section} idPrefix="enterprise">
        {section === "cadastro" && (
          <EnterpriseCadastroSection
            enterprise={enterprise}
            enterpriseId={enterpriseId}
            canEdit={canEdit}
            onUpdateSuccess={onUpdateSuccess}
          />
        )}
        {section === "enderecos" &&
          (canConsultAddresses === false ? (
            <EnterpriseSectionEmpty
              icon={MapPin}
              title="Sem permissão"
              description="Necessita da permissão consultar_enderecos para ver os endereços da empresa."
            />
          ) : enterpriseId ? (
            <EnterpriseAddressList
              enterpriseId={enterpriseId}
              addresses={enterprise.addresses}
              canIncludeAddresses={canIncludeAddresses}
              canAlterAddresses={canAlterAddresses}
            />
          ) : (
            <EnterpriseSectionEmpty
              icon={MapPin}
              title="Empresa não identificada"
              description="Não foi possível carregar o identificador da empresa para gerir endereços."
            />
          ))}
      </SectionTogglePanel>
    </div>
  )
}
