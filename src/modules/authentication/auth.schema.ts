import { z } from "zod"

export const loginTypeSchema = z.enum(["EMAIL", "CPF/CNPJ"])
export type LoginType = z.infer<typeof loginTypeSchema>

/** Valor enviado à API para login por documento (CPF ou CNPJ normalizado). */
export const DOCUMENT_LOGIN_TYPE = "CPF/CNPJ" as const satisfies LoginType

export function parseLoginTypeParam(
  value: string | null | undefined
): LoginType {
  if (value === "CPF" || value === "CPF/CNPJ") {
    return DOCUMENT_LOGIN_TYPE
  }
  return "EMAIL"
}

export const loginRequestSchema = z.strictObject({
  loginType: loginTypeSchema,
  login: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
})
export type LoginRequest = z.infer<typeof loginRequestSchema>

export const refreshRequestSchema = z.strictObject({
  refreshToken: z.string().min(20),
})

export const enterpriseMemberClassSchema = z.enum([
  "ADMINISTRADOR",
  "GERENTE",
  "COLABORADOR",
  "CLIENTE",
  "FORNECEDOR",
  "PARCEIRO",
  "SOCIO",
  "INVESTIDOR",
  "AUDITOR",
  "OUTRO",
])

export const authUserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string().nullable(),
  registration: z.string(),
  onboardingCompleted: z.boolean(),
})

export type AuthUser = z.infer<typeof authUserSchema>

export const authEnterpriseSchema = z.object({
  id: z.uuid(),
  tradeName: z.string(),
  legalName: z.string(),
  memberId: z.uuid(),
  class: enterpriseMemberClassSchema,
})

export type AuthEnterprise = z.infer<typeof authEnterpriseSchema>

/** @deprecated Use `authEnterpriseSchema` */
export const enterpriseSchema = authEnterpriseSchema
/** @deprecated Use `AuthEnterprise` */
export type Enterprise = AuthEnterprise

export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  user: authUserSchema,
  enterprises: z.array(authEnterpriseSchema),
})

export type LoginResponse = z.infer<typeof loginResponseSchema>

export const refreshResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
})

export type RefreshResponse = z.infer<typeof refreshResponseSchema>

export const switchEnterpriseRequestSchema = z.strictObject({
  enterpriseId: z.uuid(),
})

export const switchEnterpriseResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  enterprise: z.object({
    id: z.uuid(),
    memberId: z.uuid(),
    memberDepartmentId: z.uuid().nullable(),
  }),
})

export type SwitchEnterpriseResponse = z.infer<
  typeof switchEnterpriseResponseSchema
>

export const meEnterpriseSchema = z.object({
  id: z.uuid(),
  tradeName: z.string(),
  legalName: z.string(),
  memberId: z.uuid(),
  memberDepartmentId: z.uuid().nullable(),
})

export const meUserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string().nullable(),
  registration: z.string(),
  onboardingCompleted: z.boolean(),
  phone: z.string().nullable().optional(),
})

/** Vínculo departamental devolvido por `GET /auth/me` (formato actual da API). */
export const meDepartmentSchema = z.object({
  memberDepartmentId: z.uuid(),
  departmentId: z.uuid(),
  name: z.string(),
  mainDepartment: z.boolean(),
  permissions: z.array(z.string()).default([]),
})

export type MeDepartment = z.infer<typeof meDepartmentSchema>

/**
 * Resolve permissões efectivas da sessão.
 * A API pode enviar `permissions` no topo (legado) ou apenas em `departments`.
 */
export function resolveSessionPermissions(input: {
  permissions?: string[]
  departments?: Array<Pick<MeDepartment, "mainDepartment" | "permissions">>
}): string[] {
  const topLevel = input.permissions ?? []
  if (topLevel.length > 0) {
    return topLevel
  }

  const departments = input.departments ?? []
  if (departments.length === 0) {
    return []
  }

  const mainDepartments = departments.filter((department) => department.mainDepartment)
  const source = mainDepartments.length > 0 ? mainDepartments : departments

  return [
    ...new Set(source.flatMap((department) => department.permissions)),
  ]
}

const meResponseInputSchema = z.object({
  user: meUserSchema,
  enterprise: meEnterpriseSchema.nullable(),
  permissions: z.array(z.string()).optional(),
  departments: z.array(meDepartmentSchema).optional(),
})

export const meResponseSchema = meResponseInputSchema.transform((data) => ({
  user: data.user,
  enterprise: data.enterprise,
  departments: data.departments ?? [],
  permissions: resolveSessionPermissions(data),
}))

export type MeResponse = z.infer<typeof meResponseSchema>

/** Contexto da empresa activa na UI (merge de login/switch e GET /me). */
export type ActiveEnterprise = {
  id: string
  tradeName: string
  legalName: string
  memberId: string
  memberDepartmentId: string | null
}
