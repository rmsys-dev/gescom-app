export function departmentsQueryKey(enterpriseId: string) {
  return ["departments", enterpriseId] as const
}
