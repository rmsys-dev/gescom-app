export const EMPTY_DISPLAY = "—"
const SAO_PAULO_TZ = "America/Sao_Paulo"

export function formatEmpty(
  value: string | null | undefined | boolean | number
): string {
  if (value === null || value === undefined || value === "") return EMPTY_DISPLAY
  if (typeof value === "boolean") return value ? "Sim" : "Não"
  return String(value)
}

const brazilianDateFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: SAO_PAULO_TZ,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "")
}

function extractIsoDateParts(
  value: string
): { y: string; m: string; d: string } | null {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null
  const [, y, m, d] = match
  if (!y || !m || !d) return null
  return { y, m, d }
}

/** Datas da API sem horário relevante (AAAA-MM-DD ou meia-noite UTC). */
function isApiDateOnly(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) ||
    /^\d{4}-\d{2}-\d{2}T00:00:00(\.000)?Z?$/.test(value)
  )
}

function formatDateParts({ y, m, d }: { y: string; m: string; d: string }): string {
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`
}

export function formatDateOnly(value: string | null | undefined): string {
  if (!value?.trim()) return EMPTY_DISPLAY

  const trimmed = value.trim()

  if (isApiDateOnly(trimmed)) {
    const parts = extractIsoDateParts(trimmed)
    if (parts) return formatDateParts(parts)
  }

  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) {
    const parts = extractIsoDateParts(trimmed)
    if (parts) return formatDateParts(parts)
    return value
  }

  return brazilianDateFormat.format(parsed)
}

/** Normaliza datas da API para `<input type="date">` (AAAA-MM-DD). */
export function toDateInputValue(value: string | null | undefined): string {
  if (!value?.trim()) return ""

  const trimmed = value.trim()

  if (isApiDateOnly(trimmed)) {
    const parts = extractIsoDateParts(trimmed)
    if (parts) return `${parts.y}-${parts.m}-${parts.d}`
  }

  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) {
    const parts = extractIsoDateParts(trimmed)
    if (parts) return `${parts.y}-${parts.m}-${parts.d}`
    return ""
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SAO_PAULO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(parsed)

  const y = parts.find((part) => part.type === "year")?.value
  const m = parts.find((part) => part.type === "month")?.value
  const d = parts.find((part) => part.type === "day")?.value

  return y && m && d ? `${y}-${m}-${d}` : ""
}

export function formatCpf(value: string | null | undefined): string {
  if (!value) return EMPTY_DISPLAY
  const digits = onlyDigits(value)
  if (digits.length !== 11) return value.trim() || EMPTY_DISPLAY
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function formatCnpj(value: string | null | undefined): string {
  if (!value) return EMPTY_DISPLAY
  const digits = onlyDigits(value)
  if (digits.length !== 14) return value.trim() || EMPTY_DISPLAY
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function formatCpfCnpj(value: string | null | undefined): string {
  if (!value) return EMPTY_DISPLAY
  const digits = onlyDigits(value)
  if (digits.length === 11) return formatCpf(digits)
  if (digits.length === 14) return formatCnpj(digits)
  return value.trim() || EMPTY_DISPLAY
}

const PERSON_NAME_LOCALE = "pt-BR"

/** Ex.: "JOÃO SILVA" → "João Silva" */
export function formatPersonName(value: string | null | undefined): string {
  if (!value?.trim()) return EMPTY_DISPLAY

  return value
    .trim()
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLocaleLowerCase(PERSON_NAME_LOCALE)
      return (
        lower.charAt(0).toLocaleUpperCase(PERSON_NAME_LOCALE) + lower.slice(1)
      )
    })
    .join(" ")
}

export function formatProfitMargin(
  value: string | number | null | undefined
): string {
  if (value === null || value === undefined || value === "") return EMPTY_DISPLAY
  const num =
    typeof value === "string" ? Number.parseFloat(value.trim()) : value
  if (Number.isNaN(num)) return EMPTY_DISPLAY
  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)}%`
}

export function formatCurrency(
  value: string | number | null | undefined
): string {
  if (value === null || value === undefined || value === "") return EMPTY_DISPLAY
  const num =
    typeof value === "string" ? Number.parseFloat(value.trim()) : value
  if (Number.isNaN(num)) return EMPTY_DISPLAY
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatPhone(value: string | null | undefined): string {
  if (!value?.trim()) return EMPTY_DISPLAY

  let digits = onlyDigits(value)

  if (digits.startsWith("55") && digits.length >= 12) {
    digits = digits.slice(2)
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return value.trim()
}
