import { z } from "zod"
import {
  authUserSchema,
  authEnterpriseSchema,
  meDepartmentSchema,
  meEnterpriseSchema,
  meUserSchema,
} from "@/modules/authentication/auth.schema"

/** Resposta de login ao browser (sem tokens). */
export const loginClientResponseSchema = z.object({
  user: authUserSchema,
  enterprises: z.array(authEnterpriseSchema),
})

export type LoginClientResponse = z.infer<typeof loginClientResponseSchema>

/** Resposta de switch-enterprise ao browser (sem tokens). */
export const switchEnterpriseClientResponseSchema = z.object({
  enterprise: z.object({
    id: z.uuid(),
    memberId: z.uuid(),
    memberDepartmentId: z.uuid().nullable(),
  }),
})

export type SwitchEnterpriseClientResponse = z.infer<
  typeof switchEnterpriseClientResponseSchema
>

export const sessionBootstrapSchema = z.discriminatedUnion("authenticated", [
  z.object({
    authenticated: z.literal(false),
  }),
  z.object({
    authenticated: z.literal(true),
    user: meUserSchema,
    enterprise: meEnterpriseSchema.nullable(),
    departments: z.array(meDepartmentSchema).default([]),
    permissions: z.array(z.string()).default([]),
    enterprises: z.array(authEnterpriseSchema),
  }),
])

export type SessionBootstrap = z.infer<typeof sessionBootstrapSchema>

/** Resposta de first-access verify ao browser (sem tokens). */
export const firstAccessVerifyClientResponseSchema = z.object({
  user: authUserSchema,
})

export type FirstAccessVerifyClientResponse = z.infer<
  typeof firstAccessVerifyClientResponseSchema
>
