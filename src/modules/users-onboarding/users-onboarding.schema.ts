import { z } from "zod"
import { apiNullableNumberSchema } from "@/lib/schemas/api-number"
import { apiNullableString } from "@/lib/validation/api-string"
import { apiNullablePhoneSchema, apiPhoneSchema } from "@/lib/validation/phone"

export const genderSchema = z.enum(["FEMININO", "MASCULINO", "NÃO_INFORMADO"])
export type Gender = z.infer<typeof genderSchema>

export const userAddressTypeSchema = z.enum([
  "RESIDENCIAL",
  "COMERCIAL",
  "ENTREGA",
  "COBRANCA",
  "FATURAMENTO",
  "SECUNDARIO",
  "PRINCIPAL",
  "OUTRO",
])
export type UserAddressType = z.infer<typeof userAddressTypeSchema>

export const userContactTypeSchema = z.enum([
  "SECUNDARIO",
  "PRINCIPAL",
  "TRABALHO",
  "RESIDENCIAL",
  "COMERCIAL",
  "CONJUGE",
  "FILHO",
  "PAI",
  "MAE",
  "AMIGO",
  "OUTRO",
])
export type UserContactType = z.infer<typeof userContactTypeSchema>

export const maritalStatusSchema = z.enum([
  "SOLTEIRO",
  "CASADO",
  "DIVORCIADO",
  "VIUVO",
  "UNIAO_ESTAVEL",
])
export type MaritalStatus = z.infer<typeof maritalStatusSchema>

export const housingTypeSchema = z.enum([
  "ALUGADO",
  "PRÓPRIO",
  "DOADO",
  "EMPRESTADO",
  "OUTRO",
])
export type HousingType = z.infer<typeof housingTypeSchema>

const housingTypeInputSchema = z.enum([
  "ALUGADO",
  "PROPRIO",
  "PRÓPRIO",
  "DOADO",
  "EMPRESTADO",
  "OUTRO",
])

const normalizedHousingTypeSchema = housingTypeInputSchema.transform((v) =>
  v === "PROPRIO" ? "PRÓPRIO" : v
) as z.ZodType<HousingType>

export const creditTypeSchema = z.enum(["CREDITO", "DEBITO", "OUTRO"])
export type CreditType = z.infer<typeof creditTypeSchema>

export const accessModeSchema = z.enum(["self", "directory"])
export type AccessMode = z.infer<typeof accessModeSchema>

export const userDetailsUserSchema = z.object({
  id: z.uuid(),
  userName: z.string(),
  userPhone: apiPhoneSchema,
  userEmail: z.string(),
})

export const personalInfoSchema = z.object({
  id: z.uuid().optional(),
  gender: genderSchema.nullable().optional(),
  birthDate: z.string().nullable().optional(),
  placeOfBirth: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>

export const userAddressSchema = z.object({
  id: z.uuid(),
  cepId: z.uuid(),
  number: z.string(),
  complement: z.string().nullable(),
  adressType: userAddressTypeSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  deletedAt: z.string().nullable().optional(),
})

export type UserAddress = z.infer<typeof userAddressSchema>

export const userContactSchema = z.object({
  id: z.uuid(),
  type: userContactTypeSchema,
  phone: apiNullablePhoneSchema.optional(),
  email: apiNullableString({ max: 255 }),
  whatsapp: apiNullablePhoneSchema.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
  deletedAt: z.string().nullable().optional(),
})

export type UserContact = z.infer<typeof userContactSchema>

export const relationshipsSchema = z.object({
  id: z.uuid().optional(),
  maritalStatus: maritalStatusSchema.nullable().optional(),
  spouseName: apiNullableString({ min: 2, max: 255 }),
  housingType: normalizedHousingTypeSchema.nullable().optional(),
  rentalPeriod: apiNullableNumberSchema,
  motherName: apiNullableString({ min: 2, max: 255 }),
  fatherName: apiNullableString({ min: 2, max: 255 }),
  profession: apiNullableString({ min: 2, max: 255 }),
  professionDescription: apiNullableString({ min: 2, max: 255 }),
  professionTime: apiNullableNumberSchema,
  income: apiNullableNumberSchema,
  linkWithSeller: z.boolean().nullable().optional(),
  toWarmUp: z.boolean().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type Relationships = z.infer<typeof relationshipsSchema>

export const taxInfosSchema = z.object({
  id: z.uuid().optional(),
  renegotiation: z.boolean().nullable().optional(),
  spc_registration: apiNullableString({ min: 1, max: 255 }),
  spc_registry_date: z.string().nullable().optional(),
  stateRegistration: apiNullableString({ min: 1, max: 255 }),
  municipalRegistration: apiNullableString({ min: 1, max: 255 }),
  suframa_registration: apiNullableString({ min: 1, max: 255 }),
  userLegalName: apiNullableString({ min: 1, max: 255 }),
  r3_code: apiNullableNumberSchema,
  sefaz_Date: z.string().nullable().optional(),
  governmentEntity: apiNullableString({ min: 1, max: 255 }),
  benefitCode: apiNullableString({ min: 1, max: 255 }),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type TaxInfos = z.infer<typeof taxInfosSchema>

export const financialInfoSchema = z.object({
  id: z.uuid().optional(),
  ICMSReduction: apiNullableNumberSchema,
  discountLimit: apiNullableNumberSchema,
  discoutArrangement: apiNullableString({ min: 1 }),
  creditType: creditTypeSchema.nullable().optional(),
  requestAmount: apiNullableNumberSchema,
  budgetPrice: apiNullableNumberSchema,
  taxRegime: apiNullableString({ min: 1 }),
  purchaseOrder: z.boolean().nullable().optional(),
  prevRate: apiNullableNumberSchema,
  ratTax: apiNullableNumberSchema,
  reductionRate: apiNullableNumberSchema,
  senarTax: apiNullableNumberSchema,
  low: z.boolean().nullable().optional(),
  sale_discount: apiNullableNumberSchema,
  doSt: z.boolean().nullable().optional(),
  sendNF: z.boolean().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type FinancialInfo = z.infer<typeof financialInfoSchema>

export const userDetailsResponseSchema = z.object({
  user: userDetailsUserSchema,
  personalInfo: personalInfoSchema.nullable(),
  addresses: z.array(userAddressSchema),
  contacts: z.array(userContactSchema),
  relationships: relationshipsSchema.nullable(),
  taxInfos: taxInfosSchema.nullable(),
  financialInfo: financialInfoSchema.nullable(),
  accessMode: accessModeSchema.nullable().optional().transform((v) => v ?? "directory"),
})

export type UserDetailsResponse = z.infer<typeof userDetailsResponseSchema>

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD.")

export const postPersonalInfoRequestSchema = z.strictObject({
  gender: genderSchema.optional(),
  birthDate: dateStringSchema.optional(),
  placeOfBirth: z.string().min(1).optional(),
})

export const patchPersonalInfoRequestSchema = z
  .strictObject({
    gender: genderSchema.nullable().optional(),
    birthDate: dateStringSchema.nullable().optional(),
    placeOfBirth: z.string().min(1).nullable().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Informe ao menos um campo.",
  })

export const postUserAddressRequestSchema = z.strictObject({
  cepId: z.uuid(),
  number: z.string().trim().min(1).max(255),
  complement: z.string().trim().min(1).max(255).optional(),
  adressType: userAddressTypeSchema,
})

export const patchUserAddressRequestSchema = z
  .strictObject({
    cepId: z.uuid().optional(),
    number: z.string().trim().min(1).max(255).optional(),
    complement: z.string().trim().min(1).max(255).nullable().optional(),
    adressType: userAddressTypeSchema.optional(),
    softDelete: z.literal(true).optional(),
  })
  .refine(
    (d) =>
      d.cepId !== undefined ||
      d.number !== undefined ||
      d.complement !== undefined ||
      d.adressType !== undefined ||
      d.softDelete === true,
    { message: "Informe ao menos um campo." }
  )

export const postUserContactRequestSchema = z.strictObject({
  type: userContactTypeSchema,
  phone: apiPhoneSchema.optional(),
  email: z.string().email().optional(),
  whatsapp: apiPhoneSchema.optional(),
})

export const patchUserContactRequestSchema = z
  .strictObject({
    type: userContactTypeSchema.optional(),
    phone: apiPhoneSchema.nullable().optional(),
    email: z.string().email().nullable().optional(),
    whatsapp: apiPhoneSchema.nullable().optional(),
    softDelete: z.literal(true).optional(),
  })
  .refine(
    (d) =>
      d.type !== undefined ||
      d.phone !== undefined ||
      d.email !== undefined ||
      d.whatsapp !== undefined ||
      d.softDelete === true,
    { message: "Informe ao menos um campo." }
  )

export const postRelationshipsRequestSchema = z.strictObject({
  maritalStatus: maritalStatusSchema.optional(),
  spouseName: z.string().min(2).max(255).optional(),
  housingType: normalizedHousingTypeSchema.optional(),
  rentalPeriod: z.number().int().min(0).optional(),
  motherName: z.string().min(2).max(255).optional(),
  fatherName: z.string().min(2).max(255).optional(),
  profession: z.string().min(2).max(255).optional(),
  professionDescription: z.string().min(2).max(255).optional(),
  professionTime: z.number().int().min(0).optional(),
  income: z.number().min(0).optional(),
  linkWithSeller: z.boolean().optional(),
  toWarmUp: z.boolean().optional(),
})

export const patchRelationshipsRequestSchema = z
  .strictObject({
    maritalStatus: maritalStatusSchema.nullable().optional(),
    spouseName: z.string().min(2).max(255).nullable().optional(),
    housingType: normalizedHousingTypeSchema.nullable().optional(),
    rentalPeriod: z.number().int().min(0).nullable().optional(),
    motherName: z.string().min(2).max(255).nullable().optional(),
    fatherName: z.string().min(2).max(255).nullable().optional(),
    profession: z.string().min(2).max(255).nullable().optional(),
    professionDescription: z.string().min(2).max(255).nullable().optional(),
    professionTime: z.number().int().min(0).nullable().optional(),
    income: z.number().min(0).nullable().optional(),
    linkWithSeller: z.boolean().nullable().optional(),
    toWarmUp: z.boolean().nullable().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Informe ao menos um campo.",
  })

export const postTaxInfosRequestSchema = z.strictObject({
  renegotiation: z.boolean().optional(),
  spc_registration: z.string().min(1).max(255).optional(),
  spc_registry_date: dateStringSchema.optional(),
  stateRegistration: z.string().min(1).max(255).optional(),
  municipalRegistration: z.string().min(1).max(255).optional(),
  suframa_registration: z.string().min(1).max(255).optional(),
  userLegalName: z.string().min(1).max(255).optional(),
  r3_code: z.number().int().min(0).optional(),
  sefaz_Date: dateStringSchema.optional(),
  governmentEntity: z.string().min(1).max(255).optional(),
  benefitCode: z.string().min(1).max(255).optional(),
})

export const patchTaxInfosRequestSchema = z
  .strictObject({
    renegotiation: z.boolean().nullable().optional(),
    spc_registration: z.string().min(1).max(255).nullable().optional(),
    spc_registry_date: dateStringSchema.nullable().optional(),
    stateRegistration: z.string().min(1).max(255).nullable().optional(),
    municipalRegistration: z.string().min(1).max(255).nullable().optional(),
    suframa_registration: z.string().min(1).max(255).nullable().optional(),
    userLegalName: z.string().min(1).max(255).nullable().optional(),
    r3_code: z.number().int().min(0).nullable().optional(),
    sefaz_Date: dateStringSchema.nullable().optional(),
    governmentEntity: z.string().min(1).max(255).nullable().optional(),
    benefitCode: z.string().min(1).max(255).nullable().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Informe ao menos um campo.",
  })

export const postFinancialInfoRequestSchema = z.strictObject({
  ICMSReduction: z.number().min(0).max(100).optional(),
  discountLimit: z.number().min(0).max(100).optional(),
  discoutArrangement: z.string().min(1).optional(),
  creditType: creditTypeSchema.optional(),
  requestAmount: z.number().min(0).optional(),
  budgetPrice: z.number().min(0).optional(),
  taxRegime: z.string().min(1).optional(),
  purchaseOrder: z.boolean().optional(),
  prevRate: z.number().min(0).max(100).optional(),
  ratTax: z.number().min(0).max(100).optional(),
  reductionRate: z.number().min(0).max(100).optional(),
  senarTax: z.number().min(0).max(100).optional(),
  low: z.boolean().optional(),
  sale_discount: z.number().min(0).max(100).optional(),
  doSt: z.boolean().optional(),
  sendNF: z.boolean().optional(),
})

export const patchFinancialInfoRequestSchema = z
  .strictObject({
    ICMSReduction: z.number().min(0).max(100).nullable().optional(),
    discountLimit: z.number().min(0).max(100).nullable().optional(),
    discoutArrangement: z.string().min(1).nullable().optional(),
    creditType: creditTypeSchema.nullable().optional(),
    requestAmount: z.number().min(0).nullable().optional(),
    budgetPrice: z.number().min(0).nullable().optional(),
    taxRegime: z.string().min(1).nullable().optional(),
    purchaseOrder: z.boolean().nullable().optional(),
    prevRate: z.number().min(0).max(100).nullable().optional(),
    ratTax: z.number().min(0).max(100).nullable().optional(),
    reductionRate: z.number().min(0).max(100).nullable().optional(),
    senarTax: z.number().min(0).max(100).nullable().optional(),
    low: z.boolean().nullable().optional(),
    sale_discount: z.number().min(0).max(100).nullable().optional(),
    doSt: z.boolean().nullable().optional(),
    sendNF: z.boolean().nullable().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Informe ao menos um campo.",
  })

export type PostPersonalInfoRequest = z.infer<typeof postPersonalInfoRequestSchema>
export type PatchPersonalInfoRequest = z.infer<typeof patchPersonalInfoRequestSchema>
export type PostUserAddressRequest = z.infer<typeof postUserAddressRequestSchema>
export type PatchUserAddressRequest = z.infer<typeof patchUserAddressRequestSchema>
export type PostUserContactRequest = z.infer<typeof postUserContactRequestSchema>
export type PatchUserContactRequest = z.infer<typeof patchUserContactRequestSchema>
export type PostRelationshipsRequest = z.infer<typeof postRelationshipsRequestSchema>
export type PatchRelationshipsRequest = z.infer<typeof patchRelationshipsRequestSchema>
export type PostTaxInfosRequest = z.infer<typeof postTaxInfosRequestSchema>
export type PatchTaxInfosRequest = z.infer<typeof patchTaxInfosRequestSchema>
export type PostFinancialInfoRequest = z.infer<typeof postFinancialInfoRequestSchema>
export type PatchFinancialInfoRequest = z.infer<typeof patchFinancialInfoRequestSchema>
