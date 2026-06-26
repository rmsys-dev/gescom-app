import type { PaginationQuery } from "@/modules/products/products-query"

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
}

export const CATALOG_CONFIGS: CatalogConfig[] = [
  {
    slug: "ncm",
    title: "NCM",
    description: "Visualize os códigos NCM",
    permissionLabel: "consultar_ncm_produtos",
    permissionKey: "canConsultNcm",
    basePath: "/products/catalogs/ncm",
  },
  {
    slug: "cest",
    title: "CEST",
    description: "Visualize os códigos CEST",
    permissionLabel: "consultar_cest_produtos",
    permissionKey: "canConsultCest",
    basePath: "/products/catalogs/cest",
  },
  {
    slug: "units",
    title: "Unidades de medida",
    description: "Visualize as siglas e descrições de unidades",
    permissionLabel: "consultar_unidades_medida",
    permissionKey: "canConsultUnits",
    basePath: "/products/catalogs/units",
  },
  {
    slug: "types",
    title: "Tipos de produto",
    description: "Visualize os tipos de produto",
    permissionLabel: "consultar_tipos_produto",
    permissionKey: "canConsultTypesProduct",
    basePath: "/products/catalogs/types",
  },

  {
    slug: "anp",
    title: "ANP",
    description: "Visualize os códigos ANP",
    permissionLabel: "consultar_anp_produtos",
    permissionKey: "canConsultAnp",
    basePath: "/products/catalogs/anp",
  },
  {
    slug: "nbs",
    title: "NBS",
    description: "Visualize os códigos NBS e classificação tributária",
    permissionLabel: "consultar_nbs_produtos",
    permissionKey: "canConsultNbs",
    basePath: "/products/catalogs/nbs",
  },
  {
    slug: "icms",
    title: "Tributação ICMS",
    description: "Visualize as CST e alíquotas ICMS",
    permissionLabel: "consultar_tributacao_icms",
    permissionKey: "canConsultIcmsTaxation",
    basePath: "/products/catalogs/icms",
  },
  {
    slug: "pis-cofins",
    title: "PIS/COFINS",
    description: "Visualize as situações CST PIS/COFINS",
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
