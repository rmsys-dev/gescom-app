import { formatPermissionLabel } from "@/lib/permission-label"
import type {
  MemberDepartment,
  PermissionStatus,
} from "@/modules/memberships/memberships.schema"

export type MemberDepartmentPermissionEntry = {
  permission: string
  status: PermissionStatus
  kind: "default" | "extra"
}

export function mapMemberDepartmentPermissionEntries(
  department: Pick<
    MemberDepartment,
    "permissionsDefault" | "extraPermissions"
  >
): MemberDepartmentPermissionEntry[] {
  const map = new Map<string, MemberDepartmentPermissionEntry>()

  for (const item of department.permissionsDefault ?? []) {
    map.set(item.permission, {
      permission: item.permission,
      status: item.status,
      kind: "default",
    })
  }

  for (const item of department.extraPermissions ?? []) {
    map.set(item.permission, {
      permission: item.permission,
      status: item.status,
      kind: "extra",
    })
  }

  return Array.from(map.values()).sort((a, b) =>
    a.permission.localeCompare(b.permission, "pt-BR")
  )
}

export function filterMemberDepartmentPermissions(
  permissions: MemberDepartmentPermissionEntry[],
  query: string
): MemberDepartmentPermissionEntry[] {
  const term = query.trim().toLowerCase()
  if (!term) return []

  return permissions.filter((entry) => {
    const label = formatPermissionLabel(entry.permission).toLowerCase()
    return (
      entry.permission.toLowerCase().includes(term) || label.includes(term)
    )
  })
}
