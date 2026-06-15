import type { AuthEnterprise } from "@/modules/authentication/auth.schema"
import type { MeResponse } from "@/modules/authentication/auth.schema"

/**
 * Monta snapshot mínimo para cookie `gescom_enterprises` quando a API só devolve
 * contexto activo em GET /me (ex.: após first-access verify).
 */
export function enterprisesSnapshotFromMe(me: MeResponse): AuthEnterprise[] {
  if (!me.enterprise) return []
  return [
    {
      id: me.enterprise.id,
      tradeName: me.enterprise.tradeName,
      legalName: me.enterprise.legalName,
      memberId: me.enterprise.memberId,
      class: "COLABORADOR",
    },
  ]
}
