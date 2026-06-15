import { toast } from "sonner"
import { ApiContractError } from "@/lib/api/contract-error"
import { HttpError } from "@/lib/api/http-error"

const MESSAGE_OVERRIDES: Partial<Record<string, string>> = {
  PROXY_PATH_FORBIDDEN: "Recurso nao disponivel.",
  RATE_LIMITED: "Muitas tentativas. Tente mais tarde.",
  FIRST_ACCESS_EMAIL_RATE_LIMITED:
    "Limite de envios de codigo atingido. Tente mais tarde.",
  PASSWORD_RESET_EMAIL_RATE_LIMITED:
    "Limite de envios de codigo atingido. Tente mais tarde.",
  USE_MEMBERSHIP_INVITE:
    "Utilizador com credenciais deve ser convidado. Use o fluxo de convite.",
  ENTERPRISE_CONFLICT:
    "Dados da empresa em conflito com cadastro existente. Revise CPF/CNPJ ou nomes duplicados.",
  ADDRESS_HIERARCHY_MISMATCH:
    "País, estado, cidade e CEP não estão alinhados. Verifique as seleções.",
  ENTERPRISE_ADDRESS_PRINCIPAL_ALREADY_EXISTS:
    "Já existe um endereço principal cadastrado para esta empresa. Altere o tipo ou edite o endereço principal existente.",
}

const CONTRACT_ERROR_FALLBACK =
  "Resposta inesperada do servidor. Tente novamente ou contacte o suporte."

/** Mapeia `HttpError` para mensagens de toast (prioriza `message` da API). */
export function toastHttpError(
  error: HttpError,
  fallback = "Ocorreu um erro. Tente novamente."
) {
  if (error.code === "VALIDATION_ERROR") {
    const first = error.details[0]
    toast.error(first ? `${first.path}: ${first.message}` : "Dados invalidos.")
    return
  }

  const override = MESSAGE_OVERRIDES[error.code]
  if (override) {
    toast.error(override)
    return
  }

  const message = error.message?.trim()
  toast.error(message || fallback)
}

/** Trata `HttpError`, `ApiContractError` e erros genéricos. */
export function toastApiError(
  error: unknown,
  fallback = "Ocorreu um erro. Tente novamente."
) {
  if (error instanceof HttpError) {
    toastHttpError(error, fallback)
    return
  }

  if (error instanceof ApiContractError) {
    const first = error.issues[0]
    toast.error(
      first
        ? `${CONTRACT_ERROR_FALLBACK} (${first.path.join(".")})`
        : CONTRACT_ERROR_FALLBACK
    )
    return
  }

  if (error instanceof Error && error.message.trim()) {
    toast.error(error.message.trim())
    return
  }

  toast.error(fallback)
}
