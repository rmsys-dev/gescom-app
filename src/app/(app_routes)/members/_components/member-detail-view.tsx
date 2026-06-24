"use client"

import { Separator } from "@/components/ui/separator"
import { MemberProfileSummary } from "@/app/(app_routes)/members/_components/member-profile-summary"
import {
  MemberSheetItem,
  MemberSheetSection,
} from "@/app/(app_routes)/members/_components/member-sheet-parts"
import { formatCpfCnpj, formatDateOnly, formatEmpty, formatPhone } from "@/lib/formatters"
import { getMemberClassLabel } from "@/modules/memberships/member-class-label"
import { getMemberStatusLabel } from "@/modules/memberships/member-status-label"
import type {
  MemberDetail,
  MemberUserSummary,
} from "@/modules/memberships/memberships.schema"
import { useIncludedByDisplay } from "@/modules/memberships/use-included-by-display"

type MemberDetailViewProps = {
  member: MemberDetail
  enterpriseId: string
}

function MemberDetailUserSection({ user }: { user: MemberUserSummary }) {
  return (
    <MemberSheetSection
      title="Dados cadastrais"
      description="Informações de identificação do usuário"
    >
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <MemberSheetItem label="Nome completo" value={user.userName} />
        <MemberSheetItem
          label="CPF/CNPJ"
          value={formatCpfCnpj(user.userRegistration)}
        />
        <MemberSheetItem label="E-mail" value={user.userEmail} />
        <MemberSheetItem label="Telefone" value={formatPhone(user.userPhone)} />
      </dl>
    </MemberSheetSection>
  )
}

function MemberDetailLinkSection({
  member,
  enterpriseId,
}: {
  member: MemberDetail
  enterpriseId: string
}) {
  const { display: includedByDisplay, isPending: includedByPending } =
    useIncludedByDisplay(enterpriseId, member.includedBy)

  return (
    <MemberSheetSection
      title="Vínculo"
      description="Situação e histórico do membro na empresa"
    >
      <dl className="w-full grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <MemberSheetItem
          label="Classe"
          value={getMemberClassLabel(member.class)}
        />
        <MemberSheetItem
          label="Status"
          value={getMemberStatusLabel(member.status)}
        />
        <MemberSheetItem
          label="Código"
          value={member.code != null ? String(member.code) : null}
        />
        <MemberSheetItem label="Incluído por">
          {includedByPending ? "…" : formatEmpty(includedByDisplay)}
        </MemberSheetItem>
        <MemberSheetItem
          label="Registrado em"
          value={formatDateOnly(member.registeredOn)}
        />
        <MemberSheetItem
          label="Aprovado em"
          value={formatDateOnly(member.approvedAt)}
        />
      </dl>
    </MemberSheetSection>
  )
}

export function MemberDetailView({
  member,
  enterpriseId,
}: MemberDetailViewProps) {
  return (
    <article className="overflow-hidden w-full h-full">
      <div className="flex flex-col items-start justify-between gap-6 p-4">
        <MemberProfileSummary member={member} variant="sheet" showContact />

        <Separator />

        <MemberDetailUserSection user={member.user} />

        <Separator />

        <MemberDetailLinkSection member={member} enterpriseId={enterpriseId} />
      </div>
    </article>
  )
}
