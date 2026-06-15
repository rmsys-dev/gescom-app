import { z } from "zod"

export const departmentStatusSchema = z.enum([
  "ATIVO",
  "INATIVO",
  "BLOQUEADO",
  "PENDENTE",
  "ESPECIAL",
  "COBRANCA",
  "NAO_VENDER",
])

export type DepartmentStatus = z.infer<typeof departmentStatusSchema>

export const departmentSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  status: departmentStatusSchema,
  permissionReference: z.string(),
  registeredOn: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
})

export type Department = z.infer<typeof departmentSchema>

export const listDepartmentsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  status: departmentStatusSchema.optional(),
})

export type ListDepartmentsQuery = z.infer<typeof listDepartmentsQuerySchema>

export function buildDepartmentsQuery(query: ListDepartmentsQuery): string {
  const parsed = listDepartmentsQuerySchema.parse(query)
  const params = new URLSearchParams()
  if (parsed.limit !== undefined) params.set("limit", String(parsed.limit))
  if (parsed.offset !== undefined) params.set("offset", String(parsed.offset))
  if (parsed.status !== undefined) params.set("status", parsed.status)
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}
