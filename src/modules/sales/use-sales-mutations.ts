"use client"

import { useQueryClient } from "@tanstack/react-query"

import { useMutationWithToast } from "@/lib/react-query/use-mutation-with-toast"
import { salesQueryKeys } from "@/modules/sales/sales-query-keys"
import {
  addSaleItemService,
  convertToSaleService,
  createFullReturnService,
  createPartialReturnService,
  createSaleService,
  recalculateTotalsService,
  removeSaleItemService,
  updateSaleItemService,
  updateSaleService,
} from "@/modules/sales/sales.service"
import type {
  ConvertBudgetToSaleRequest,
  CreateFullReturnRequest,
  CreatePartialReturnRequest,
  CreateSaleItemRequest,
  CreateSaleRequest,
  UpdateSaleItemRequest,
  UpdateSaleRequest,
} from "@/modules/sales/sales.schema"

function useInvalidateSales(enterpriseId: string, saleId?: string) {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: ["sales", enterpriseId] })
    if (saleId) {
      void queryClient.invalidateQueries({
        queryKey: salesQueryKeys.detail(enterpriseId, saleId),
      })
    }
  }
}

export function useCreateSaleMutation(enterpriseId: string) {
  const invalidate = useInvalidateSales(enterpriseId)
  return useMutationWithToast({
    mutationFn: (input: CreateSaleRequest) => createSaleService(input),
    successMessage: "Venda criada com sucesso.",
    onSuccess: () => invalidate(),
  })
}

export function useUpdateSaleMutation(enterpriseId: string, saleId: string) {
  const invalidate = useInvalidateSales(enterpriseId, saleId)
  return useMutationWithToast({
    mutationFn: (input: UpdateSaleRequest) =>
      updateSaleService(saleId, input),
    successMessage: "Venda atualizada com sucesso.",
    onSuccess: () => invalidate(),
  })
}

export function useRecalculateSaleTotalsMutation(
  enterpriseId: string,
  saleId: string
) {
  const invalidate = useInvalidateSales(enterpriseId, saleId)
  return useMutationWithToast({
    mutationFn: () => recalculateTotalsService(saleId),
    successMessage: "Totais recalculados.",
    onSuccess: () => invalidate(),
  })
}

export function useConvertToSaleMutation(enterpriseId: string, saleId: string) {
  const invalidate = useInvalidateSales(enterpriseId, saleId)
  return useMutationWithToast({
    mutationFn: (input: ConvertBudgetToSaleRequest) =>
      convertToSaleService(saleId, input),
    successMessage: "Orçamento convertido em venda.",
    onSuccess: () => invalidate(),
  })
}

export function useAddSaleItemMutation(enterpriseId: string, saleId: string) {
  const invalidate = useInvalidateSales(enterpriseId, saleId)
  return useMutationWithToast({
    mutationFn: (input: CreateSaleItemRequest) =>
      addSaleItemService(saleId, input),
    successMessage: "Item adicionado.",
    onSuccess: () => invalidate(),
  })
}

export function useUpdateSaleItemMutation(
  enterpriseId: string,
  saleId: string,
  saleItemId: string
) {
  const invalidate = useInvalidateSales(enterpriseId, saleId)
  return useMutationWithToast({
    mutationFn: (input: UpdateSaleItemRequest) =>
      updateSaleItemService(saleId, saleItemId, input),
    successMessage: "Item atualizado.",
    onSuccess: () => invalidate(),
  })
}

export function useRemoveSaleItemMutation(
  enterpriseId: string,
  saleId: string
) {
  const invalidate = useInvalidateSales(enterpriseId, saleId)
  return useMutationWithToast({
    mutationFn: (saleItemId: string) =>
      removeSaleItemService(saleId, saleItemId),
    successMessage: "Item removido.",
    onSuccess: () => invalidate(),
  })
}

export function useCreatePartialReturnMutation(
  enterpriseId: string,
  saleId: string
) {
  const invalidate = useInvalidateSales(enterpriseId, saleId)
  return useMutationWithToast({
    mutationFn: (input: CreatePartialReturnRequest) =>
      createPartialReturnService(saleId, input),
    successMessage: "Devolução parcial registrada.",
    onSuccess: () => invalidate(),
  })
}

export function useCreateFullReturnMutation(
  enterpriseId: string,
  saleId: string
) {
  const invalidate = useInvalidateSales(enterpriseId, saleId)
  return useMutationWithToast({
    mutationFn: (input: CreateFullReturnRequest = {}) =>
      createFullReturnService(saleId, input),
    successMessage: "Devolução total registrada.",
    onSuccess: () => invalidate(),
  })
}
