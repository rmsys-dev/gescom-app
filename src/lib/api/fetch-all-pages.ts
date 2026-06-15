export type PaginatedPage<T> = {
  items: T[]
  total: number
  limit: number
  offset: number
}

export type FetchAllPagesResult<T> = {
  items: T[]
  truncated: boolean
  fetchedPages: number
}

export type FetchAllPagesOptions<T> = {
  fetchPage: (offset: number, limit: number) => Promise<PaginatedPage<T>>
  pageSize: number
  maxPages: number
  signal?: AbortSignal
}

/**
 * Percorre páginas sequencialmente até esgotar o total ou atingir maxPages.
 */
export async function fetchAllPages<T>({
  fetchPage,
  pageSize,
  maxPages,
  signal,
}: FetchAllPagesOptions<T>): Promise<FetchAllPagesResult<T>> {
  let offset = 0
  let total = 0
  let fetchedPages = 0
  const allItems: T[] = []

  do {
    signal?.throwIfAborted()
    const page = await fetchPage(offset, pageSize)
    allItems.push(...page.items)
    total = page.total
    offset += pageSize
    fetchedPages += 1
  } while (offset < total && fetchedPages < maxPages)

  return {
    items: allItems,
    truncated: offset < total,
    fetchedPages,
  }
}
