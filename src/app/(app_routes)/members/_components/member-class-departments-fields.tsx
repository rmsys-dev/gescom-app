"use client"

import { Field } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MemberDepartmentsPicker } from "@/app/(app_routes)/members/[memberId]/_components/member-departments-picker"
import { cn } from "@/lib/utils"
import { MEMBER_CLASS_OPTIONS } from "@/modules/memberships/member-class-label"
import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPayload } from "@/modules/memberships/memberships.schema"

type MemberClassDepartmentsFieldsProps = {
  memberClass: EnterpriseMemberClass
  departments: MemberDepartmentPayload[]
  onMemberClassChange: (value: EnterpriseMemberClass) => void
  onDepartmentsChange: (departments: MemberDepartmentPayload[]) => void
  departmentsFieldClassName?: string
}

export function MemberClassDepartmentsFields({
  memberClass,
  departments,
  onMemberClassChange,
  onDepartmentsChange,
  departmentsFieldClassName,
}: MemberClassDepartmentsFieldsProps) {
  return (
    <>
      <Field>
        <Select
          value={memberClass}
          onValueChange={(v) => onMemberClassChange(v as EnterpriseMemberClass)}
        >
          <SelectTrigger id="memberClass" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEMBER_CLASS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field className={cn(departmentsFieldClassName)}>
        <MemberDepartmentsPicker
          memberClass={memberClass}
          departments={departments}
          onChange={onDepartmentsChange}
        />
      </Field>
    </>
  )
}
