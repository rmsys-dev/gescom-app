import { z } from "zod"
import { enterpriseStatusSchema } from "@/modules/enterprises/enterprises.schema"
import {
  paginationQuerySchema,
  searchPaginationQuerySchema,
} from "@/modules/products/products-query"

/** Status do produto global (`GET /products`). */
export const productStatusSchema = z.enum(["ATIVO", "INATIVO"])

export type ProductStatus = z.infer<typeof productStatusSchema>

/** Status no vínculo produto-empresa (`GET /products-enterprises`). */
export const productEnterpriseStatusSchema = enterpriseStatusSchema

export type ProductEnterpriseStatus = z.infer<
  typeof productEnterpriseStatusSchema
>

export const productSchema = z.object({
  id: z.uuid(),
  status: productStatusSchema,
  description: z.string(),
  barCode: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type Product = z.infer<typeof productSchema>

export const listProductsQuerySchema = searchPaginationQuerySchema.extend({
  status: productStatusSchema.optional(),
})

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>

const productCatalogRefSchema = z
  .object({
    id: z.uuid(),
    description: z.string().optional(),
  })
  .nullable()
  .optional()

const measurementUnitRefSchema = z
  .object({
    id: z.uuid(),
    unit: z.string().optional(),
    description: z.string().optional(),
  })
  .nullable()
  .optional()

const productTypeRefSchema = z
  .object({
    id: z.uuid(),
    type: z.string().optional(),
    description: z.string().optional(),
  })
  .nullable()
  .optional()

const productNcmRefSchema = z
  .object({
    id: z.uuid(),
    ncm: z.string().optional(),
    description: z.string().optional(),
  })
  .nullable()
  .optional()

const productCestRefSchema = z
  .object({
    id: z.uuid(),
    cest: z.string().optional(),
    description: z.string().optional(),
  })
  .nullable()
  .optional()

const productAnpRefSchema = z
  .object({
    id: z.uuid(),
    anp: z.string().optional(),
    description: z.string().optional(),
  })
  .nullable()
  .optional()

const productNbsRefSchema = z
  .object({
    id: z.uuid(),
    nbs: z.string().optional(),
    description: z.string().optional(),
  })
  .nullable()
  .optional()

const productEnterpriseCodeSchema = z
  .union([z.number(), z.string(), z.null()])
  .transform((value) => {
    if (value === null || value === undefined || value === "") return null
    const parsed =
      typeof value === "number" ? value : Number.parseInt(String(value), 10)
    return Number.isFinite(parsed) ? Math.trunc(parsed) : null
  })

export const productEnterpriseSchema = z.object({
  id: z.uuid(),
  productId: z.uuid(),
  enterprisesId: z.uuid(),
  code: productEnterpriseCodeSchema,
  description: z.string(),
  origin: z.string().nullable(),
  manufacturer: z.string().nullable(),
  measurementUnitId: z.uuid().nullable().optional(),
  productTypeId: z.uuid().nullable().optional(),
  productNcmId: z.uuid().nullable().optional(),
  productCestId: z.uuid().nullable().optional(),
  productAnpId: z.uuid().nullable().optional(),
  productNbsId: z.uuid().nullable().optional(),
  productGroupId: z.uuid().nullable().optional(),
  productSubgroupId: z.uuid().nullable().optional(),
  productBrandId: z.uuid().nullable().optional(),
  measurementUnit: measurementUnitRefSchema,
  productType: productTypeRefSchema,
  productNcm: productNcmRefSchema,
  productCest: productCestRefSchema,
  productAnp: productAnpRefSchema,
  productNbs: productNbsRefSchema,
  productGroup: productCatalogRefSchema,
  productSubgroup: productCatalogRefSchema,
  productBrand: productCatalogRefSchema,
  controlsBatch: z.boolean(),
  status: productEnterpriseStatusSchema,
  barCode: z
    .string()
    .nullable()
    .transform((value) => value ?? ""),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type ProductEnterprise = z.infer<typeof productEnterpriseSchema>

export type ProductEnterpriseListItem = ProductEnterprise & {
  group: string | null
  subgroup: string | null
  brand: string | null
  application: string | null
  stockLocation: string | null
}

/** Query params aceites por `GET /products-enterprises` (strict — sem filtros só de cliente). */
export const listProductsEnterprisesQuerySchema =
  searchPaginationQuerySchema.extend({
    status: productEnterpriseStatusSchema.optional(),
    description: z.string().trim().min(1).optional(),
    code: z.coerce.number().int().positive().optional(),
    barCode: z.string().trim().min(1).optional(),
    manufacturer: z.string().trim().min(1).optional(),
    origin: z.string().trim().min(1).optional(),
    group: z.string().trim().min(1).optional(),
    subgroup: z.string().trim().min(1).optional(),
    brand: z.string().trim().min(1).optional(),
    application: z.string().trim().min(1).optional(),
  })

export type ListProductsEnterprisesQuery = z.infer<
  typeof listProductsEnterprisesQuerySchema
>

export { paginationQuerySchema }
