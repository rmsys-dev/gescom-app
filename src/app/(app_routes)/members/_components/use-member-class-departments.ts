"use client"

import { useState } from "react"

import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPayload } from "@/modules/memberships/memberships.schema"
import { isClienteClass } from "@/modules/memberships/memberships-rules"

export function useMemberClassDepartments(options?: {
  fixedClass?: EnterpriseMemberClass
  defaultClass?: EnterpriseMemberClass
}) {
  const { fixedClass, defaultClass = "COLABORADOR" } = options ?? {}
  const [memberClass, setMemberClass] = useState<EnterpriseMemberClass>(
    fixedClass ?? defaultClass
  )
  const [departments, setDepartments] = useState<MemberDepartmentPayload[]>([])

  function handleMemberClassChange(next: EnterpriseMemberClass) {
    setMemberClass(next)
    if (isClienteClass(next)) setDepartments([])
  }

  return {
    memberClass,
    setMemberClass: handleMemberClassChange,
    departments,
    setDepartments,
    effectiveClass: fixedClass ?? memberClass,
    showFields: !fixedClass,
  }
}
