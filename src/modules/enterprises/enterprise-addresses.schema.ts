import { z } from "zod"
import {
  enterpriseAddressSchema,
  enterpriseAddressTypeSchema,
} from "@/modules/enterprises/enterprises.schema"

export { enterpriseAddressTypeSchema, enterpriseAddressSchema }

export type EnterpriseAddressType = z.infer<typeof enterpriseAddressTypeSchema>

export const createEnterpriseAddressRequestSchema = z.strictObject({
  cepId: z.uuid(),
  number: z.string().trim().min(1).max(255),
  complement: z.string().trim().min(1).max(255).optional(),
  adressType: enterpriseAddressTypeSchema,
})

export type CreateEnterpriseAddressRequest = z.infer<
  typeof createEnterpriseAddressRequestSchema
>

export const patchEnterpriseAddressRequestSchema = z
  .strictObject({
    cepId: z.uuid().optional(),
    number: z.string().trim().min(1).max(255).optional(),
    complement: z.string().trim().min(1).max(255).nullable().optional(),
    adressType: enterpriseAddressTypeSchema.optional(),
    softDelete: z.literal(true).optional(),
  })
  .refine(
    (data) =>
      data.cepId !== undefined ||
      data.number !== undefined ||
      data.complement !== undefined ||
      data.adressType !== undefined ||
      data.softDelete === true,
    { message: "Informe ao menos um campo para alterar." }
  )

export type PatchEnterpriseAddressRequest = z.infer<
  typeof patchEnterpriseAddressRequestSchema
>

export const listEnterpriseAddressesQuerySchema = z.object({
  adressType: enterpriseAddressTypeSchema.optional(),
})

export type ListEnterpriseAddressesQuery = z.infer<
  typeof listEnterpriseAddressesQuerySchema
>

export const listEnterpriseAddressesResponseSchema = z.array(enterpriseAddressSchema)
