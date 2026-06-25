"use client"

import {
  MemberSheetItem,
  MemberSheetSection,
} from "@/app/(app_routes)/members/_components/member-sheet-parts"
import { UserContactHeader } from "@/components/global/user-contact-header"
import { formatPhone } from "@/lib/formatters"
import type { User } from "@/modules/users/users.schema"

type UserProfileSummaryProps = {
  user: User
}

export function UserProfileSummary({ user }: UserProfileSummaryProps) {
  const displayName = user.userName.trim()
  const phone = formatPhone(user.userPhone)

  return (
    <div className="space-y-4">
      <UserContactHeader
        displayName={displayName}
        email={user.userEmail}
        phone={phone}
        phoneRaw={user.userPhone}
        headingLevel="h2"
        layout="row"
      />

      <MemberSheetSection
        title="Dados cadastrais"
        description="Informações de identificação do usuário"
      >
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <MemberSheetItem label="Nome completo" value={user.userName} />
          <MemberSheetItem label="E-mail" value={user.userEmail} />
          <MemberSheetItem label="Telefone" value={phone} />
        </dl>
      </MemberSheetSection>
    </div>
  )
}
