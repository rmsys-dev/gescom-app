import { fetchAllPages } from "@/lib/api/fetch-all-pages"
import { fetchById, fetchPaginated } from "@/lib/api/paginated-fetch"
import {
  departmentSchema,
  type Department,
  type ListDepartmentsQuery,
} from "@/modules/departments/departments.schema"

const DEPARTMENTS_PAGE_SIZE = 100
/** Limite de páginas ao carregar departamentos ativos (até 2000 registros). */
const DEPARTMENTS_MAX_FETCH_PAGES = 20

export async function listDepartmentsService(query: ListDepartmentsQuery = {}) {
  return fetchPaginated("departments", departmentSchema, query)
}

export async function getDepartmentService(departmentId: string): Promise<Department> {
  return fetchById(`departments/${departmentId}`, departmentSchema)
}

export async function listActiveDepartmentsService() {
  const { items } = await fetchAllPages({
    pageSize: DEPARTMENTS_PAGE_SIZE,
    maxPages: DEPARTMENTS_MAX_FETCH_PAGES,
    fetchPage: (offset, limit) => listDepartmentsService({ limit, offset }),
  })

  return items
}
