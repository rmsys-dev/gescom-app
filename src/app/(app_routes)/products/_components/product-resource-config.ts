export type ProductResourceSlug = "groups" | "subgroups" | "brands"

export type ProductResourceConfig = {
  slug: ProductResourceSlug
  title: string
  description: string
  permissionLabel: string
  permissionKey:
    | "canConsultProductGroups"
    | "canConsultProductSubgroups"
    | "canConsultProductBrands"
  basePath: string
}

export const PRODUCT_RESOURCE_CONFIGS: ProductResourceConfig[] = [
  {
    slug: "groups",
    title: "Grupos",
    description: "Grupos de produto",
    permissionLabel: "consultar_grupos_produto",
    permissionKey: "canConsultProductGroups",
    basePath: "/products/groups",
  },
  {
    slug: "subgroups",
    title: "Subgrupos",
    description: "Subgrupos de produto",
    permissionLabel: "consultar_subgrupos_produto",
    permissionKey: "canConsultProductSubgroups",
    basePath: "/products/subgroups",
  },
  {
    slug: "brands",
    title: "Marcas",
    description: "Marcas de produto",
    permissionLabel: "consultar_marcas_produto",
    permissionKey: "canConsultProductBrands",
    basePath: "/products/brands",
  },
]

export function getProductResourceConfig(
  slug: string
): ProductResourceConfig | undefined {
  return PRODUCT_RESOURCE_CONFIGS.find((c) => c.slug === slug)
}
