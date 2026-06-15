"use client"

import { useQueryClient } from "@tanstack/react-query"

import { useMutationWithToast } from "@/lib/react-query/use-mutation-with-toast"
import { stockQueryKeys } from "@/modules/stock/stock-query-keys"
import {
  createStockMovementService,
} from "@/modules/stock/stock.service"
import type { CreateStockMovementRequest } from "@/modules/stock/stock.schema"

export function useCreateStockMovementMutation(enterpriseId: string) {
  const queryClient = useQueryClient()
  return useMutationWithToast({
    mutationFn: (input: CreateStockMovementRequest) =>
      createStockMovementService(input),
    successMessage: "Movimentação registrada com sucesso.",
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: stockQueryKeys.movements(enterpriseId),
      })
      void queryClient.invalidateQueries({
        queryKey: ["stock", enterpriseId, "batch-balances"],
      })
    },
  })
}
