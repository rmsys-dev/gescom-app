import { z } from "zod"
import {
  paginationQuerySchema,
  searchPaginationQuerySchema,
} from "@/modules/products/products-query"

export const productStatusSchema = z.enum(["ATIVO", "INATIVO"])

export type ProductStatus = z.infer<typeof productStatusSchema>

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
    description: z.string(),
  })
  .nullable()
  .optional()

const measurementUnitRefSchema = z
  .object({
    id: z.uuid(),
    unit: z.string(),
    description: z.string(),
  })
  .nullable()
  .optional()

const productTypeRefSchema = z
  .object({
    id: z.uuid(),
    type: z.string(),
    description: z.string(),
  })
  .nullable()
  .optional()

const productNcmRefSchema = z
  .object({
    id: z.uuid(),
    ncm: z.string(),
    description: z.string(),
  })
  .nullable()
  .optional()

const productCestRefSchema = z
  .object({
    id: z.uuid(),
    cest: z.string(),
    description: z.string(),
  })
  .nullable()
  .optional()

const productAnpRefSchema = z
  .object({
    id: z.uuid(),
    anp: z.string(),
    description: z.string(),
  })
  .nullable()
  .optional()

const productNbsRefSchema = z
  .object({
    id: z.uuid(),
    nbs: z.string(),
    description: z.string(),
  })
  .nullable()
  .optional()

export const productEnterpriseSchema = z.object({
  id: z.uuid(),
  productId: z.uuid(),
  enterprisesId: z.uuid(),
  code: z.number().int().nullable(),
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
  status: productStatusSchema,
  barCode: z.string(),
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
    status: productStatusSchema.optional(),
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
