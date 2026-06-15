"use client"

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { useState } from "react"

import { toastApiError } from "@/modules/authentication/http-error-feedback"
import { CACHE, GC } from "@/lib/react-query/cache-policy"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: CACHE.tenantList,
            gcTime: GC.tenantList,
            retry: 1,
          },
          mutations: {
            onError: (error) => {
              toastApiError(error)
            },
          },
        },
      })
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
