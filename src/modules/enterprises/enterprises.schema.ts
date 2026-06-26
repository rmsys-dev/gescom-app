import { z } from "zod"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"

/** Telefone na resposta pode vir em formato legado (ate 20 caracteres). */
export const enterpriseResponsePhoneSchema = z.string().max(20).nullable()

/** CPF/CNPJ na resposta — normaliza dígitos sem revalidar verificadores (dados legados). */
export const enterpriseResponseRegistrationSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, ""))

export const enterpriseStatusSchema = z.enum([
  "ATIVO",
  "INATIVO",
  "BLOQUEADO",
  "PENDENTE",
  "ESPECIAL",
  "COBRANCA",
  "NAO_VENDER",
])

export type EnterpriseStatus = z.infer<typeof enterpriseStatusSchema>

export const enterpriseAddressTypeSchema = z.enum([
  "PRINCIPAL",
  "SECUNDARIO",
  "COMERCIAL",
  "RESIDENCIAL",
  "ENTREGA",
  "COBRANCA",
  "FATURAMENTO",
  "OUTRO",
])

export type EnterpriseAddressType = z.infer<typeof enterpriseAddressTypeSchema>

export const enterpriseRecordSchema = z.object({
  id: z.uuid(),
  status: enterpriseStatusSchema,
  registration: enterpriseResponseRegistrationSchema,
  legalName: z.string(),
  tradeName: z.string(),
  phone: enterpriseResponsePhoneSchema,
  email: z
    .string()
    .trim()
    .transform((v) => v.toLowerCase())
    .pipe(z.string().email().max(255))
    .nullable(),
  whatsapp: enterpriseResponsePhoneSchema,
  registeredOn: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
})

export type EnterpriseRecord = z.infer<typeof enterpriseRecordSchema>

/** @deprecated Use `enterpriseRecordSchema` */
export const enterpriseSchema = enterpriseRecordSchema
/** @deprecated Use `EnterpriseRecord` */
export type Enterprise = EnterpriseRecord

export const enterpriseAddressSchema = z.object({
  id: z.uuid(),
  enterpriseId: z.uuid(),
  cepId: z.uuid(),
  number: z.string(),
  complement: z.string().nullable(),
  adressType: enterpriseAddressTypeSchema,
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
})

export type EnterpriseAddress = z.infer<typeof enterpriseAddressSchema>

export const enterpriseSequenceSchema = z.object({
  id: z.uuid(),
  enterpriseId: z.uuid(),
  sequence: z.string().max(255),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
})

export type EnterpriseSequence = z.infer<typeof enterpriseSequenceSchema>

export const enterpriseDetailSchema = enterpriseRecordSchema.extend({
  addresses: z.array(enterpriseAddressSchema),
  sequences: z.array(enterpriseSequenceSchema),
})

export type EnterpriseDetail = z.infer<typeof enterpriseDetailSchema>

export const updateEnterpriseRequestSchema = z
  .strictObject({
    registration: cpfCnpjSchema.optional(),
    legalName: z.string().trim().min(2).max(255).optional(),
    tradeName: z.string().trim().min(2).max(255).optional(),
    phone: phoneE164Schema.optional(),
    email: z
      .string()
      .trim()
      .transform((v) => v.toLowerCase())
      .pipe(z.string().email().max(255))
      .optional(),
    whatsapp: phoneE164Schema.optional(),
  })
  .refine(
    (data) =>
      data.registration !== undefined ||
      data.legalName !== undefined ||
      data.tradeName !== undefined ||
      data.phone !== undefined ||
      data.email !== undefined ||
      data.whatsapp !== undefined,
    { message: "Informe ao menos um campo para alterar." }
  )

export type UpdateEnterpriseRequest = z.infer<typeof updateEnterpriseRequestSchema>

export const enterpriseListItemSchema = z.object({
  id: z.uuid(),
  tradeName: z.string(),
  legalName: z.string(),
  memberId: z.uuid(),
  class: z.string(),
})

export type EnterpriseListItem = z.infer<typeof enterpriseListItemSchema>

export const listEnterprisesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

export type ListEnterprisesQuery = z.infer<typeof listEnterprisesQuerySchema>

export function buildEnterprisesQuery(query: ListEnterprisesQuery): string {
  const parsed = listEnterprisesQuerySchema.parse(query)
  const params = new URLSearchParams()
  if (parsed.limit !== undefined) params.set("limit", String(parsed.limit))
  if (parsed.offset !== undefined) params.set("offset", String(parsed.offset))
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}
