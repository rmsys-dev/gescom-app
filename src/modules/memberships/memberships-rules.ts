import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPayload } from "@/modules/memberships/memberships.schema"
import { normalizePhoneToE164 } from "@/lib/validation/phone"

export const CLIENT_MEMBER_CLASS = "CLIENTE" as const

export function isClienteClass(memberClass: EnterpriseMemberClass): boolean {
  return memberClass === CLIENT_MEMBER_CLASS
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function normalizeRegistration(raw: string): string {
  return raw.replace(/\D/g, "")
}

export function normalizePhone(raw: string): string {
  return normalizePhoneToE164(raw)
}

export type DepartmentsValidationResult =
  | { ok: true }
  | { ok: false; message: string }

export function validateDepartmentsPayload(
  memberClass: EnterpriseMemberClass,
  departments: MemberDepartmentPayload[]
): DepartmentsValidationResult {
  if (isClienteClass(memberClass)) {
    if (departments.length > 0) {
      return {
        ok: false,
        message: "Clientes nao devem ter departamentos.",
      }
    }
    return { ok: true }
  }

  if (departments.length === 0) {
    return {
      ok: false,
      message: "Selecione ao menos um departamento.",
    }
  }

  const mainCount = departments.filter((d) => d.mainDepartment).length
  if (mainCount !== 1) {
    return {
      ok: false,
      message: "Defina exactamente um departamento principal.",
    }
  }

  const ids = new Set<string>()
  for (const d of departments) {
    if (ids.has(d.departmentId)) {
      return {
        ok: false,
        message: "Departamentos duplicados nao sao permitidos.",
      }
    }
    ids.add(d.departmentId)
  }

  return { ok: true }
}
