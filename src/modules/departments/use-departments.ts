"use client"

import { useQuery } from "@tanstack/react-query"
import { CACHE } from "@/lib/react-query/cache-policy"
import { useActiveEnterpriseId } from "@/lib/tenant/use-active-enterprise-id"
import { useOperatorPermissions } from "@/lib/permissions"
import { departmentsQueryKey } from "@/modules/departments/departments-query-keys"
import { listActiveDepartmentsService } from "@/modules/departments/departments.service"

export { departmentsQueryKey } from "@/modules/departments/departments-query-keys"

export function useDepartmentsQuery(enabled = true) {
  const enterpriseId = useActiveEnterpriseId()
  const perms = useOperatorPermissions()
  return useQuery({
    queryKey: departmentsQueryKey(enterpriseId ?? ""),
    queryFn: () => listActiveDepartmentsService(),
    enabled: enabled && Boolean(enterpriseId) && perms.canConsultDepartments,
    staleTime: CACHE.tenantStableCatalog,
  })
}
