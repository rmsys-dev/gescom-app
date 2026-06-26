import type {
  CreditType,
  Gender,
  HousingType,
  MaritalStatus,
  UserAddressType,
  UserContactType,
} from "@/modules/users-onboarding/users-onboarding.schema"

const GENDER_LABELS: Record<Gender, string> = {
  FEMININO: "Feminino",
  MASCULINO: "Masculino",
  "NÃO_INFORMADO": "Não informado",
}

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "FEMININO", label: "Feminino" },
  { value: "MASCULINO", label: "Masculino" },
  { value: "NÃO_INFORMADO", label: "Não informado" },
]

export function getGenderLabel(value: string | null | undefined): string {
  if (!value) return "—"
  return GENDER_LABELS[value as Gender] ?? value
}

const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  SOLTEIRO: "Solteiro(a)",
  CASADO: "Casado(a)",
  DIVORCIADO: "Divorciado(a)",
  VIUVO: "Viúvo(a)",
  UNIAO_ESTAVEL: "União estável",
}

export const MARITAL_STATUS_OPTIONS: { value: MaritalStatus; label: string }[] =
  [
    { value: "SOLTEIRO", label: "Solteiro(a)" },
    { value: "CASADO", label: "Casado(a)" },
    { value: "DIVORCIADO", label: "Divorciado(a)" },
    { value: "VIUVO", label: "Viúvo(a)" },
    { value: "UNIAO_ESTAVEL", label: "União estável" },
  ]

export function getMaritalStatusLabel(value: string | null | undefined): string {
  if (!value) return "—"
  return MARITAL_STATUS_LABELS[value as MaritalStatus] ?? value
}

const HOUSING_TYPE_LABELS: Record<HousingType, string> = {
  ALUGADO: "Alugado",
  "PRÓPRIO": "Próprio",
  DOADO: "Doado",
  EMPRESTADO: "Emprestado",
  OUTRO: "Outro",
}

export const HOUSING_TYPE_OPTIONS: { value: HousingType; label: string }[] = [
  { value: "ALUGADO", label: "Alugado" },
  { value: "PRÓPRIO", label: "Próprio" },
  { value: "DOADO", label: "Doado" },
  { value: "EMPRESTADO", label: "Emprestado" },
  { value: "OUTRO", label: "Outro" },
]

export function getHousingTypeLabel(value: string | null | undefined): string {
  if (!value) return "—"
  return HOUSING_TYPE_LABELS[value as HousingType] ?? value
}

const ADDRESS_TYPE_LABELS: Record<UserAddressType, string> = {
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  ENTREGA: "Entrega",
  COBRANCA: "Cobrança",
  FATURAMENTO: "Faturamento",
  SECUNDARIO: "Secundário",
  PRINCIPAL: "Principal",
  OUTRO: "Outro",
}

export const USER_ADDRESS_TYPE_OPTIONS: {
  value: UserAddressType
  label: string
}[] = [
  { value: "PRINCIPAL", label: "Principal" },
  { value: "SECUNDARIO", label: "Secundário" },
  { value: "RESIDENCIAL", label: "Residencial" },
  { value: "COMERCIAL", label: "Comercial" },
  { value: "ENTREGA", label: "Entrega" },
  { value: "COBRANCA", label: "Cobrança" },
  { value: "FATURAMENTO", label: "Faturamento" },
  { value: "OUTRO", label: "Outro" },
]

export function getUserAddressTypeLabel(value: string): string {
  return ADDRESS_TYPE_LABELS[value as UserAddressType] ?? value
}

const CONTACT_TYPE_LABELS: Record<UserContactType, string> = {
  SECUNDARIO: "Secundário",
  PRINCIPAL: "Principal",
  TRABALHO: "Trabalho",
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  CONJUGE: "Cônjuge",
  FILHO: "Filho(a)",
  PAI: "Pai",
  MAE: "Mãe",
  AMIGO: "Amigo(a)",
  OUTRO: "Outro",
}

export const USER_CONTACT_TYPE_OPTIONS: {
  value: UserContactType
  label: string
}[] = [
  { value: "PRINCIPAL", label: "Principal" },
  { value: "SECUNDARIO", label: "Secundário" },
  { value: "TRABALHO", label: "Trabalho" },
  { value: "RESIDENCIAL", label: "Residencial" },
  { value: "COMERCIAL", label: "Comercial" },
  { value: "CONJUGE", label: "Cônjuge" },
  { value: "FILHO", label: "Filho(a)" },
  { value: "PAI", label: "Pai" },
  { value: "MAE", label: "Mãe" },
  { value: "AMIGO", label: "Amigo(a)" },
  { value: "OUTRO", label: "Outro" },
]

export function getUserContactTypeLabel(value: string): string {
  return CONTACT_TYPE_LABELS[value as UserContactType] ?? value
}

const CREDIT_TYPE_LABELS: Record<CreditType, string> = {
  CREDITO: "Crédito",
  DEBITO: "Débito",
  OUTRO: "Outro",
}

export const CREDIT_TYPE_OPTIONS: { value: CreditType; label: string }[] = [
  { value: "CREDITO", label: "Crédito" },
  { value: "DEBITO", label: "Débito" },
  { value: "OUTRO", label: "Outro" },
]

export function getCreditTypeLabel(value: string | null | undefined): string {
  if (!value) return "—"
  return CREDIT_TYPE_LABELS[value as CreditType] ?? value
}

export { formatDateOnly } from "@/lib/formatters"
