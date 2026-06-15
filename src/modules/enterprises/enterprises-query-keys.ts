export function enterpriseDetailQueryKey(enterpriseId: string) {
  return ["enterprises", enterpriseId, "detail"] as const
}
