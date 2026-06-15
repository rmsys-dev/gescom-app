"use client"

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query"
import { toast } from "sonner"

/** Wrapper com toast de sucesso; erros são tratados pelo `QueryClient` global. */
export function useMutationWithToast<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    successMessage?: string
  }
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { successMessage, onSuccess, ...rest } = options

  return useMutation<TData, TError, TVariables, TContext>({
    ...rest,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (successMessage) {
        toast.success(successMessage)
      }
      onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}
