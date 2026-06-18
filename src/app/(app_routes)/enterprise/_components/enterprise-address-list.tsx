"use client"

import { useState } from "react"
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react"
import { ConfirmSoftDeleteDialog } from "@/components/global/dialogs/confirm-soft-delete-dialog"
import { EnterpriseAddressForm } from "@/app/(app_routes)/enterprise/_components/enterprise-address-form"
import { Button } from "@/components/ui/button"
import { useResolveEnterpriseAddressDisplay } from "@/modules/addresses/use-resolve-enterprise-address-display"
import { getEnterpriseAddressTypeLabel } from "@/modules/enterprises/enterprise-address-type-label"
import type { EnterpriseAddress } from "@/modules/enterprises/enterprises.schema"
import { usePatchEnterpriseAddressMutation } from "@/modules/enterprises/use-enterprise-addresses"

function EnterpriseSectionEmpty({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center"
    >
      <MapPin
        className="mb-3 size-10 text-muted-foreground/50"
        aria-hidden
      />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleString("pt-BR")
  } catch {
    return iso
  }
}

function AddressDetailField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  )
}

type EnterpriseAddressListProps = {
  enterpriseId: string
  addresses: EnterpriseAddress[]
  canIncludeAddresses?: boolean
  canAlterAddresses?: boolean
}

export function EnterpriseAddressList({
  enterpriseId,
  addresses,
  canIncludeAddresses,
  canAlterAddresses,
}: EnterpriseAddressListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingAddress, setEditingAddress] = useState<EnterpriseAddress | null>(
    null
  )
  const [deleteTarget, setDeleteTarget] = useState<EnterpriseAddress | null>(null)

  const { getDisplay, isLoading: labelsLoading } =
    useResolveEnterpriseAddressDisplay(addresses, addresses.length > 0)

  const patchMutation = usePatchEnterpriseAddressMutation(enterpriseId)

  function openCreate() {
    setFormMode("create")
    setEditingAddress(null)
    setFormOpen(true)
  }

  function openEdit(address: EnterpriseAddress) {
    setFormMode("edit")
    setEditingAddress(address)
    setFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    try {
      await patchMutation.mutateAsync({
        addressId: deleteTarget.id,
        input: { softDelete: true },
      })
      setDeleteTarget(null)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  if (addresses.length === 0) {
    return (
      <div className="space-y-4">
        {canIncludeAddresses && (
          <div className="flex justify-end">
            <Button type="button" size="sm" onClick={openCreate} tooltip="Adicionar endereço">
              <Plus className="size-4" aria-hidden />
              Novo endereço
            </Button>
          </div>
        )}
        <EnterpriseSectionEmpty
          title="Nenhum endereço cadastrado"
          description={
            canIncludeAddresses
              ? "Esta empresa não possui endereços activos. Use o botão acima para cadastrar o primeiro endereço."
              : "Esta empresa não possui endereços activos na API."
          }
        />
        <EnterpriseAddressForm
          open={formOpen}
          onOpenChange={setFormOpen}
          enterpriseId={enterpriseId}
          mode={formMode}
          editing={editingAddress}
          addresses={addresses}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {canIncludeAddresses && (
        <div className="flex justify-end">
          <Button type="button" className="w-full" onClick={openCreate} tooltip="Adicionar endereço">
            <Plus className="size-4" aria-hidden />
            Novo endereço
          </Button>
        </div>
      )}

      {labelsLoading && (
        <p className="text-sm text-muted-foreground">A carregar localização...</p>
      )}

      <ul className="space-y-4">
        {addresses.map((address, index) => {
          const display = getDisplay(address)
          return (
            <li
              key={address.id}
              className="border border-border/60 bg-muted/15 p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  Endereço {index + 1} —{" "}
                  {getEnterpriseAddressTypeLabel(address.adressType)}
                </p>
                {canAlterAddresses && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(address)}
                      tooltip="Editar endereço"
                    >
                      <Pencil className="size-3.5" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(address)}
                      tooltip="Remover endereço"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </Button>
                  </div>
                )}
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{display.cepSummary}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <AddressDetailField
                  label="Tipo"
                  value={getEnterpriseAddressTypeLabel(address.adressType)}
                />
                <AddressDetailField label="CEP" value={display.cepLabel} />
                <AddressDetailField label="País" value={display.countryName} />
                <AddressDetailField label="Estado" value={display.stateLabel} />
                <AddressDetailField label="Cidade" value={display.cityName} />
                <AddressDetailField
                  label="Criado em"
                  value={formatDateTime(address.createdAt)}
                />
                <AddressDetailField
                  label="Atualizado em"
                  value={formatDateTime(address.updatedAt)}
                />
              </div>
            </li>
          )
        })}
      </ul>

      <EnterpriseAddressForm
        open={formOpen}
        onOpenChange={setFormOpen}
        enterpriseId={enterpriseId}
        mode={formMode}
        editing={editingAddress}
        addresses={addresses}
      />

      <ConfirmSoftDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Tem a certeza que deseja remover este endereço?"
        description="Esta ação só poderá ser revertida mediante chamado ao suporte."
        confirmLabel="Remover"
        isPending={patchMutation.isPending}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  )
}
