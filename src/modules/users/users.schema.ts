import { z } from "zod"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { apiPhoneSchema, phoneE164Schema } from "@/lib/validation/phone"

export const accessModeSchema = z.enum(["self", "directory"])

// Perfil público (listagem/detalhe conforme contrato da API)
export const userPublicSchema = z.object({
  id: z.uuid(),
  userName: z.string().trim().min(2).max(255),
  userPhone: apiPhoneSchema,
  userEmail: z.string().trim().email().max(255),
  accessMode: accessModeSchema.optional(),
})

export type UserPublic = z.infer<typeof userPublicSchema>

// Compat: código legado ainda importa `User` como tipo base de listagem.
export type User = UserPublic

// Query da requisição de listagem de usuários
export const listUsersQuerySchema = z.object({
  registration: cpfCnpjSchema.optional(),
  email: z.string().trim().email().max(255).optional(),
  phone: phoneE164Schema.optional(),
  /** Busca por nome (quando suportado pela API). */
  userName: z.string().trim().min(2).max(255).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema> // Tipo da query da requisição de listagem de usuários

// Corpo da requisição de atualização de usuário
export const updateUserRequestSchema = z
  .strictObject({
    userName: z.string().trim().min(2).max(255).optional(),
    userRegistration: cpfCnpjSchema.optional(),
    userEmail: z.string().trim().email("E-mail inválido").max(255).optional(),
    userPhone: phoneE164Schema.optional(),
  })
  .refine(
    (data) =>
      data.userName !== undefined ||
      data.userRegistration !== undefined ||
      data.userEmail !== undefined ||
      data.userPhone !== undefined,
    { message: "Informe ao menos um campo para alterar." }
  )

export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema> // Tipo da requisição de atualização de usuário

export const createUserRequestSchema = z.strictObject({
  userName: z.string().trim().min(2).max(255),
  userRegistration: cpfCnpjSchema,
  userEmail: z.string().trim().email("E-mail inválido").max(255),
  userPhone: phoneE164Schema,
})

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>

export const createUserResponseSchema = userPublicSchema.extend({
  userRegistration: cpfCnpjSchema,
})

export type CreateUserResponse = z.infer<typeof createUserResponseSchema>

// Resposta da requisição de atualização de usuário
export const updateUserResponseSchema = userPublicSchema.omit({
  accessMode: true,
})

export type UpdateUserResponse = z.infer<typeof updateUserResponseSchema> // Tipo da resposta da requisição de atualização de usuário
