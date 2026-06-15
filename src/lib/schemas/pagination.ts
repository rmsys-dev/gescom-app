import { z } from "zod"

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>

export const searchPaginationQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1).optional(),
})

export type SearchPaginationQuery = z.infer<typeof searchPaginationQuerySchema>
