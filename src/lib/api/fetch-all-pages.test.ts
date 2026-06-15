import { describe, expect, it } from "vitest"
import { fetchAllPages } from "@/lib/api/fetch-all-pages"

describe("fetchAllPages", () => {
  it("accumulates all pages when total fits within maxPages", async () => {
    const pages = [
      { items: [1, 2], total: 4, limit: 2, offset: 0 },
      { items: [3, 4], total: 4, limit: 2, offset: 2 },
    ]
    let call = 0

    const result = await fetchAllPages({
      pageSize: 2,
      maxPages: 10,
      fetchPage: async () => pages[call++],
    })

    expect(result.items).toEqual([1, 2, 3, 4])
    expect(result.truncated).toBe(false)
    expect(result.fetchedPages).toBe(2)
  })

  it("stops at maxPages and marks truncated", async () => {
    const result = await fetchAllPages({
      pageSize: 2,
      maxPages: 1,
      fetchPage: async () => ({
        items: [1, 2],
        total: 100,
        limit: 2,
        offset: 0,
      }),
    })

    expect(result.items).toEqual([1, 2])
    expect(result.truncated).toBe(true)
    expect(result.fetchedPages).toBe(1)
  })
})
