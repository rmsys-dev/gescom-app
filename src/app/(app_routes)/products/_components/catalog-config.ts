import type { PaginationQuery } from "@/modules/products/products-query"
import type { ListProductNbsQuery } from "@/modules/products/products-catalogs.schema"

export type CatalogSlug =
  | "units"
  | "types"
  | "ncm"
  | "cest"
  | "anp"
  | "nbs"
  | "icms"
  | "pis-cofins"

export type CatalogConfig = {
  slug: CatalogSlug
  title: string
  description: string
  permissionLabel: string
  permissionKey:
    | "canConsultUnits"
    | "canConsultTypesProduct"
    | "canConsultNcm"
    | "canConsultCest"
    | "canConsultAnp"
    | "canConsultNbs"
    | "canConsultIcmsTaxation"
    | "canConsultPisCofins"
  basePath: string
  supportsSearch?: boolean
}

export const CATALOG_CONFIGS: CatalogConfig[] = [
  {
    slug: "units",
    title: "Unidades de medida",
    description: "Siglas e descrições de unidades",
    permissionLabel: "consultar_unidades_medida",
    permissionKey: "canConsultUnits",
    basePath: "/products/catalogs/units",
  },
  {
    slug: "types",
    title: "Tipos de produto",
    description: "Tipos de produto do catálogo global",
    permissionLabel: "consultar_tipos_produto",
    permissionKey: "canConsultTypesProduct",
    basePath: "/products/catalogs/types",
  },
  {
    slug: "ncm",
    title: "NCM",
    description: "Códigos NCM",
    permissionLabel: "consultar_ncm_produtos",
    permissionKey: "canConsultNcm",
    basePath: "/products/catalogs/ncm",
  },
  {
    slug: "cest",
    title: "CEST",
    description: "Códigos CEST vinculados a NCM",
    permissionLabel: "consultar_cest_produtos",
    permissionKey: "canConsultCest",
    basePath: "/products/catalogs/cest",
  },
  {
    slug: "anp",
    title: "ANP",
    description: "Códigos ANP",
    permissionLabel: "consultar_anp_produtos",
    permissionKey: "canConsultAnp",
    basePath: "/products/catalogs/anp",
  },
  {
    slug: "nbs",
    title: "NBS",
    description: "Códigos NBS e classificação tributária",
    permissionLabel: "consultar_nbs_produtos",
    permissionKey: "canConsultNbs",
    basePath: "/products/catalogs/nbs",
    supportsSearch: true,
  },
  {
    slug: "icms",
    title: "Tributação ICMS",
    description: "CST e alíquotas ICMS",
    permissionLabel: "consultar_tributacao_icms",
    permissionKey: "canConsultIcmsTaxation",
    basePath: "/products/catalogs/icms",
  },
  {
    slug: "pis-cofins",
    title: "PIS/COFINS",
    description: "Situações CST PIS/COFINS",
    permissionLabel: "consultar_situacao_pis_cofins",
    permissionKey: "canConsultPisCofins",
    basePath: "/products/catalogs/pis-cofins",
  },
]

export function getCatalogConfig(slug: string): CatalogConfig | undefined {
  return CATALOG_CONFIGS.find((c) => c.slug === slug)
}

export const DEFAULT_CATALOG_FILTERS: PaginationQuery = {
  limit: 50,
  offset: 0,
}

export const DEFAULT_NBS_FILTERS: ListProductNbsQuery = {
  limit: 50,
  offset: 0,
}
