"use client"

import { useMemo } from "react"
import { useAuth } from "@/components/providers/authentication/auth-store"
import { useMeQuery } from "@/modules/authentication/use-account"

export const PERMISSION_CODES = {
  consultarMembros: "consultar_membros",
  consultarUsuarios: "consultar_usuarios",
  incluirUsuarios: "incluir_usuarios",
  incluirMembros: "incluir_membros",
  alterarMembros: "alterar_membros",
  alterarUsuarios: "alterar_usuarios",
  alterarPermissoes: "alterar_permissoes",
  consultarEmpresas: "consultar_empresas",
  alterarEmpresas: "alterar_empresas",
  consultarEnderecos: "consultar_enderecos",
  incluirEnderecos: "incluir_enderecos",
  alterarEnderecos: "alterar_enderecos",
  consultarDepartamentos: "consultar_departamentos",
  consultarProdutos: "consultar_produtos",
  consultarPrecos: "consultar_precos",
  consultarPrecosPromocionais: "consultar_precos_promocionais",
  consultarTributacaoProduto: "consultar_tributacao_produto",
  consultarAplicacoesProduto: "consultar_aplicacoes_produto",
  consultarUnidadesMedida: "consultar_unidades_medida",
  consultarTiposProduto: "consultar_tipos_produto",
  consultarNcmProdutos: "consultar_ncm_produtos",
  consultarCestProdutos: "consultar_cest_produtos",
  consultarAnpProdutos: "consultar_anp_produtos",
  consultarNbsProdutos: "consultar_nbs_produtos",
  consultarTributacaoIcms: "consultar_tributacao_icms",
  consultarGruposProduto: "consultar_grupos_produto",
  consultarSubgruposProduto: "consultar_subgrupos_produto",
  consultarMarcasProduto: "consultar_marcas_produto",
  consultarSituacaoPisCofins: "consultar_situacao_pis_cofins",
  consultarVendas: "consultar_vendas",
  consultarDevolucoesVendas: "consultar_devolucoes_vendas",
  consultarTiposPagamento: "consultar_tipos_pagamento",
  consultarSetoresEstoque: "consultar_setores_estoque",
  consultarLocacoesEstoque: "consultar_locacoes_estoque",
  consultarLotesEstoque: "consultar_lotes_estoque",
  consultarSaldosEstoque: "consultar_saldos_estoque",
  consultarSaldosLoteEstoque: "consultar_saldos_lote_estoque",
  consultarEstoqueMinMax: "consultar_estoque_min_max",
  consultarMovimentosEstoque: "consultar_movimentos_estoque",
  incluirMovimentosEstoque: "incluir_movimentos_estoque",
  incluirVendas: "incluir_vendas",
  alterarVendas: "alterar_vendas",
  gerarVendas: "gerar_vendas",
  incluirDevolucoesVendas: "incluir_devolucoes_vendas",
  incluirProdutos: "incluir_produtos",
  alterarProdutos: "alterar_produtos",
  consultarTiposRede: "consultar_tipos_rede",
  incluirTiposRede: "incluir_tipos_rede",
  alterarTiposRede: "alterar_tipos_rede",
  consultarTiposFornecedorCliente: "consultar_tipos_fornecedor_cliente",
  incluirTiposFornecedorCliente: "incluir_tipos_fornecedor_cliente",
  alterarTiposFornecedorCliente: "alterar_tipos_fornecedor_cliente",
} as const

/** Normaliza slugs da API (`consultar_membros`) para comparação estável. */
export function buildPermissionSet(permissions: string[] | undefined): Set<string> {
  return new Set(
    (permissions ?? [])
      .map((permission) => permission.trim().toLowerCase())
      .filter(Boolean)
  )
}

export function canPermission(
  permissions: Set<string>,
  code: string
): boolean {
  return permissions.has(code.trim().toLowerCase())
}

export function useOperatorPermissions() {
  const { hydrated, isAuthenticated } = useAuth()
  const { data, isPending, isFetching, isFetched, isError, error } =
    useMeQuery()

  const queryEnabled = hydrated && isAuthenticated
  const isReady = queryEnabled && isFetched
  const isLoading = queryEnabled && (isPending || (isFetching && !data))

  return useMemo(() => {
    const set = buildPermissionSet(data?.permissions)

    return {
      isReady,
      isLoading,
      isError,
      error,
      permissions: set,
      canConsultMembers: canPermission(
        set,
        PERMISSION_CODES.consultarMembros
      ),
      canConsultUsers: canPermission(set, PERMISSION_CODES.consultarUsuarios),
      canIncludeUsers: canPermission(set, PERMISSION_CODES.incluirUsuarios),
      canAlterUsers: canPermission(set, PERMISSION_CODES.alterarUsuarios),
      canIncludeMembers: canPermission(set, PERMISSION_CODES.incluirMembros),
      canAlterMembers: canPermission(set, PERMISSION_CODES.alterarMembros),
      canAlterPermissions: canPermission(
        set,
        PERMISSION_CODES.alterarPermissoes
      ),
      canConsultEnterprises: canPermission(
        set,
        PERMISSION_CODES.consultarEmpresas
      ),
      canAlterEnterprises: canPermission(
        set,
        PERMISSION_CODES.alterarEmpresas
      ),
      canConsultAddresses: canPermission(
        set,
        PERMISSION_CODES.consultarEnderecos
      ),
      canIncludeAddresses: canPermission(
        set,
        PERMISSION_CODES.incluirEnderecos
      ),
      canAlterAddresses: canPermission(
        set,
        PERMISSION_CODES.alterarEnderecos
      ),
      canConsultDepartments: canPermission(
        set,
        PERMISSION_CODES.consultarDepartamentos
      ),
      canConsultProducts: canPermission(
        set,
        PERMISSION_CODES.consultarProdutos
      ),
      canConsultPrices: canPermission(set, PERMISSION_CODES.consultarPrecos),
      canConsultPromotionalPrices: canPermission(
        set,
        PERMISSION_CODES.consultarPrecosPromocionais
      ),
      canConsultProductTaxation: canPermission(
        set,
        PERMISSION_CODES.consultarTributacaoProduto
      ),
      canConsultProductApplications: canPermission(
        set,
        PERMISSION_CODES.consultarAplicacoesProduto
      ),
      canConsultUnits: canPermission(
        set,
        PERMISSION_CODES.consultarUnidadesMedida
      ),
      canConsultTypesProduct: canPermission(
        set,
        PERMISSION_CODES.consultarTiposProduto
      ),
      canConsultNcm: canPermission(set, PERMISSION_CODES.consultarNcmProdutos),
      canConsultCest: canPermission(set, PERMISSION_CODES.consultarCestProdutos),
      canConsultAnp: canPermission(set, PERMISSION_CODES.consultarAnpProdutos),
      canConsultNbs: canPermission(set, PERMISSION_CODES.consultarNbsProdutos),
      canConsultIcmsTaxation: canPermission(
        set,
        PERMISSION_CODES.consultarTributacaoIcms
      ),
      canConsultProductGroups: canPermission(
        set,
        PERMISSION_CODES.consultarGruposProduto
      ),
      canConsultProductSubgroups: canPermission(
        set,
        PERMISSION_CODES.consultarSubgruposProduto
      ),
      canConsultProductBrands: canPermission(
        set,
        PERMISSION_CODES.consultarMarcasProduto
      ),
      canConsultPisCofins: canPermission(
        set,
        PERMISSION_CODES.consultarSituacaoPisCofins
      ),
      canConsultSales: canPermission(set, PERMISSION_CODES.consultarVendas),
      canConsultSaleReturns: canPermission(
        set,
        PERMISSION_CODES.consultarDevolucoesVendas
      ),
      canConsultPaymentTypes: canPermission(
        set,
        PERMISSION_CODES.consultarTiposPagamento
      ),
      canConsultStockSectors: canPermission(
        set,
        PERMISSION_CODES.consultarSetoresEstoque
      ),
      canConsultStockLocations: canPermission(
        set,
        PERMISSION_CODES.consultarLocacoesEstoque
      ),
      canConsultStockBatches: canPermission(
        set,
        PERMISSION_CODES.consultarLotesEstoque
      ),
      canConsultStockBalances: canPermission(
        set,
        PERMISSION_CODES.consultarSaldosEstoque
      ),
      canConsultStockBatchBalances: canPermission(
        set,
        PERMISSION_CODES.consultarSaldosLoteEstoque
      ),
      canConsultStockMinMax: canPermission(
        set,
        PERMISSION_CODES.consultarEstoqueMinMax
      ),
      canConsultStockMovements: canPermission(
        set,
        PERMISSION_CODES.consultarMovimentosEstoque
      ),
      canIncludeStockMovements: canPermission(
        set,
        PERMISSION_CODES.incluirMovimentosEstoque
      ),
      canIncludeSales: canPermission(set, PERMISSION_CODES.incluirVendas),
      canAlterSales: canPermission(set, PERMISSION_CODES.alterarVendas),
      canGenerateSales: canPermission(set, PERMISSION_CODES.gerarVendas),
      canIncludeSaleReturns: canPermission(
        set,
        PERMISSION_CODES.incluirDevolucoesVendas
      ),
      canIncludeProducts: canPermission(set, PERMISSION_CODES.incluirProdutos),
      canAlterProducts: canPermission(set, PERMISSION_CODES.alterarProdutos),
      canConsultTypeNetworks: canPermission(
        set,
        PERMISSION_CODES.consultarTiposRede
      ),
      canIncludeTypeNetworks: canPermission(
        set,
        PERMISSION_CODES.incluirTiposRede
      ),
      canAlterTypeNetworks: canPermission(
        set,
        PERMISSION_CODES.alterarTiposRede
      ),
      canConsultTypeSupplierCustomers: canPermission(
        set,
        PERMISSION_CODES.consultarTiposFornecedorCliente
      ),
      canIncludeTypeSupplierCustomers: canPermission(
        set,
        PERMISSION_CODES.incluirTiposFornecedorCliente
      ),
      canAlterTypeSupplierCustomers: canPermission(
        set,
        PERMISSION_CODES.alterarTiposFornecedorCliente
      ),
      canCreateMemberWithUser:
        canPermission(set, PERMISSION_CODES.incluirUsuarios) &&
        canPermission(set, PERMISSION_CODES.incluirMembros),
    }
  }, [data?.permissions, error, isError, isLoading, isReady])
}
