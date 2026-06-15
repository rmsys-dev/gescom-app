import { z } from "zod"
import {
  authUserSchema,
  authEnterpriseSchema,
  loginTypeSchema,
} from "@/modules/authentication/auth.schema"
import { sixDigitCodeSchema } from "@/lib/validation/code"

export const invitationMemberIdParamsSchema = z.uuid()

export const invitationAcceptRequestSchema = z.strictObject({
  loginType: loginTypeSchema,
  login: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
  code: sixDigitCodeSchema,
})

export type InvitationAcceptRequest = z.infer<
  typeof invitationAcceptRequestSchema
>

export const invitationActionResponseSchema = z.object({
  ok: z.boolean().optional(),
  message: z.string().optional(),
})

export type InvitationActionResponse = z.infer<
  typeof invitationActionResponseSchema
>

/** Resposta de accept: mesmo contrato de POST /login. */
export const invitationAcceptResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  user: authUserSchema,
  enterprises: z.array(authEnterpriseSchema),
})

export type InvitationAcceptResponse = z.infer<
  typeof invitationAcceptResponseSchema
>
