import { QueryClient } from "@tanstack/react-query"
import { describe, expect, it } from "vitest"

import {
  clearTenantQueries,
  TENANT_QUERY_ROOTS,
} from "@/lib/react-query/clear-tenant-queries"

function seed(client: QueryClient, key: readonly unknown[]) {
  client.setQueryData(key, { ok: true })
}

describe("clearTenantQueries", () => {
  it("exports all 9 tenant roots", () => {
    expect([...TENANT_QUERY_ROOTS].sort()).toEqual(
      [
        "departments",
        "enterprises",
        "memberships",
        "products",
        "sales",
        "sales-analytics",
        "stock",
        "users",
      ].sort()
    )
  })

  it.each([
    "sales",
    "sales-analytics",
    "products",
    "memberships",
    "users",
    "enterprises",
    "departments",
    "stock",
  ] as const)("removes queries with root %s", (root) => {
    const client = new QueryClient()
    seed(client, [root, "ent-1", "list"])
    clearTenantQueries(client)
    expect(client.getQueryData([root, "ent-1", "list"])).toBeUndefined()
  })

  it("preserves addresses (catálogo geográfico global)", () => {
    const client = new QueryClient()
    seed(client, ["addresses", "countries"])
    seed(client, ["addresses", "cep", "cep-id"])
    clearTenantQueries(client)
    expect(client.getQueryData(["addresses", "countries"])).toEqual({ ok: true })
    expect(client.getQueryData(["addresses", "cep", "cep-id"])).toEqual({
      ok: true,
    })
  })

  it("preserves account (re-seedado no switch de empresa)", () => {
    const client = new QueryClient()
    seed(client, ["account", "me"])
    clearTenantQueries(client)
    expect(client.getQueryData(["account", "me"])).toEqual({ ok: true })
  })

  it("preserves auth e header-weather", () => {
    const client = new QueryClient()
    seed(client, ["auth", "session"])
    seed(client, ["header-weather", -23.5, -46.6])
    clearTenantQueries(client)
    expect(client.getQueryData(["auth", "session"])).toEqual({ ok: true })
    expect(client.getQueryData(["header-weather", -23.5, -46.6])).toEqual({
      ok: true,
    })
  })
})
